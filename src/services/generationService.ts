import { SingleGeneration, AspectRatio, CameraMotion, StageText } from '../types';
import { matchAssetForPrompt } from '../data/assets';
import { STYLE_PRESETS } from '../data/presets';
import { StorageService } from './storage';

export interface GenerationRequest {
  id?: string;
  prompt: string;
  styleId: string;
  modelId: string;
  aspectRatio: AspectRatio;
  cameraMotion: CameraMotion;
  durationSec: number;
  seed?: number;
  shotType?: 'wide' | 'medium' | 'closeup' | 'standalone';
}

export interface ActiveJob {
  id: string;
  generation: SingleGeneration;
  elapsedSec: number;
  cancel: () => void;
}

interface QueuedTask {
  id: string;
  req: GenerationRequest;
  initialGen: SingleGeneration;
  callbacks: {
    onProgress: (progress: number, stage: StageText, elapsedSec: number) => void;
    onSuccess: (completedGen: SingleGeneration) => void;
    onError: (failedGen: SingleGeneration, errorMessage: string) => void;
  };
  cancelled: boolean;
  cancel: () => void;
}

export class GenerationEngine {
  private static taskQueue: QueuedTask[] = [];
  private static isProcessingQueue = false;
  private static activeJobsMap = new Map<string, QueuedTask>();

  public static createJobId(): string {
    return 'gen-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  }

  public static getDimensions(aspectRatio: AspectRatio): { width: number; height: number } {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '1:1':
        return { width: 1024, height: 1024 };
      case '16:9':
      default:
        return { width: 1280, height: 720 };
    }
  }

  public static buildPollinationsUrl(
    prompt: string,
    styleId: string,
    aspectRatio: AspectRatio,
    seed: number
  ): { url: string; fullPrompt: string; width: number; height: number; seed: number } {
    const style = STYLE_PRESETS.find(s => s.id === styleId) || STYLE_PRESETS[0];
    const fullPrompt = `${prompt.trim()}, ${style.promptSuffix}`;
    const { width, height } = this.getDimensions(aspectRatio);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
    return { url, fullPrompt, width, height, seed };
  }

  /**
   * Main generation entry point.
   * Places request in a sequential, rate-limited queue and executes one at a time.
   */
  public static simulateGeneration(
    req: GenerationRequest,
    callbacks: {
      onProgress: (progress: number, stage: StageText, elapsedSec: number) => void;
      onSuccess: (completedGen: SingleGeneration) => void;
      onError: (failedGen: SingleGeneration, errorMessage: string) => void;
    },
    _isRetry = false
  ): { jobId: string; cancel: () => void } {
    const jobId = req.id || this.createJobId();
    const seed = req.seed !== undefined ? req.seed : Math.floor(Math.random() * 1000000);

    const initialGen: SingleGeneration = {
      id: jobId,
      prompt: req.prompt,
      styleId: req.styleId,
      modelId: req.modelId,
      aspectRatio: req.aspectRatio,
      cameraMotion: req.cameraMotion,
      durationSec: req.durationSec,
      mediaType: 'image',
      seed,
      status: 'queued',
      progress: 0,
      stageText: 'Queued',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    const task: QueuedTask = {
      id: jobId,
      req: { ...req, seed },
      initialGen,
      callbacks,
      cancelled: false,
      cancel: () => {
        task.cancelled = true;
        this.activeJobsMap.delete(jobId);
        this.taskQueue = this.taskQueue.filter(t => t.id !== jobId);
      },
    };

    this.activeJobsMap.set(jobId, task);
    this.taskQueue.push(task);

    // Initial queued notification
    callbacks.onProgress(0, this.taskQueue.length > 1 ? 'Waiting for your turn' : 'Queued', 0);

    // Trigger queue runner
    this.processNextInQueue();

    return { jobId, cancel: task.cancel };
  }

  private static processNextInQueue(): void {
    if (this.isProcessingQueue || this.taskQueue.length === 0) {
      return;
    }

    const currentTask = this.taskQueue.shift();
    if (!currentTask || currentTask.cancelled) {
      this.processNextInQueue();
      return;
    }

    this.isProcessingQueue = true;
    this.executeImageGeneration(currentTask)
      .finally(() => {
        // Space sequential requests by 800ms to respect rate limits
        setTimeout(() => {
          this.isProcessingQueue = false;
          this.processNextInQueue();
        }, 800);
      });
  }

  private static async executeImageGeneration(task: QueuedTask): Promise<void> {
    const { req, initialGen, callbacks } = task;
    const style = STYLE_PRESETS.find(s => s.id === req.styleId) || STYLE_PRESETS[0];
    const seed = req.seed || Math.floor(Math.random() * 1000000);
    const { url } = this.buildPollinationsUrl(req.prompt, req.styleId, req.aspectRatio, seed);

    const startTime = Date.now();
    let elapsed = 0;
    callbacks.onProgress(10, 'Rendering', 0);

    // Progress tick interval while network request is pending
    const progressInterval = setInterval(() => {
      if (task.cancelled) {
        clearInterval(progressInterval);
        return;
      }
      elapsed = Math.floor((Date.now() - startTime) / 1000);
      // Smoothly advance progress up to 92%
      callbacks.onProgress(Math.min(92, 10 + elapsed * 15), 'Rendering', elapsed);
    }, 400);

    try {
      // Load image with 45s hard timeout
      await this.loadImageWithTimeout(url, 45000);

      clearInterval(progressInterval);
      if (task.cancelled) return;

      callbacks.onProgress(98, 'Finishing', elapsed);

      const completedGen: SingleGeneration = {
        ...initialGen,
        status: 'done',
        progress: 100,
        stageText: 'Completed',
        imageUrl: url,
        seed,
        isFallback: false,
      };

      StorageService.incrementGenerationCount();
      StorageService.saveGeneration(completedGen);
      this.activeJobsMap.delete(task.id);
      callbacks.onSuccess(completedGen);

    } catch (error) {
      clearInterval(progressInterval);
      if (task.cancelled) return;

      // Failure fallback: on timeout, error, or rate limit, fall back to closest sample clip
      console.warn('[GenerationEngine] Live image generation failed or timed out. Falling back to sample clip.', error);

      const fallbackAsset = matchAssetForPrompt(req.prompt, style.genre, req.shotType || 'wide');
      const completedFallbackGen: SingleGeneration = {
        ...initialGen,
        status: 'done',
        progress: 100,
        stageText: 'Completed',
        resultAssetId: fallbackAsset.id,
        imageUrl: fallbackAsset.posterUrl || fallbackAsset.svgFallback,
        seed,
        isFallback: true,
        fallbackReason: 'Live generation unavailable (sample fallback shown)',
      };

      StorageService.incrementGenerationCount();
      StorageService.saveGeneration(completedFallbackGen);
      this.activeJobsMap.delete(task.id);
      callbacks.onSuccess(completedFallbackGen);
    }
  }

  private static loadImageWithTimeout(url: string, timeoutMs: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // In non-browser (test) environment, resolve immediately
      if (typeof window === 'undefined' || typeof Image === 'undefined') {
        resolve({} as HTMLImageElement);
        return;
      }

      const img = new Image();
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        img.src = '';
        reject(new Error(`Image generation timed out after ${timeoutMs / 1000}s`));
      }, timeoutMs);

      img.onload = () => {
        if (!timedOut) {
          clearTimeout(timer);
          resolve(img);
        }
      };

      img.onerror = (err) => {
        if (!timedOut) {
          clearTimeout(timer);
          reject(err || new Error('Failed to load image from service'));
        }
      };

      img.src = url;
    });
  }
}
