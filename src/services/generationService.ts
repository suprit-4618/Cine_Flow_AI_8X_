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
}

export interface ActiveJob {
  id: string;
  generation: SingleGeneration;
  elapsedSec: number;
  cancel: () => void;
}

export class GenerationEngine {
  private static activeJobsMap = new Map<string, { timerId: NodeJS.Timeout | number; cancelled: boolean }>();

  /**
   * Deterministically generates a unique ID or uses existing.
   */
  public static createJobId(): string {
    return 'gen-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  }

  /**
   * Simulates generation following the state machine:
   * idle -> queued (1-2s) -> rendering (4-6s) -> done / failed
   */
  public static simulateGeneration(
    req: GenerationRequest,
    callbacks: {
      onProgress: (progress: number, stage: StageText, elapsedSec: number) => void;
      onSuccess: (completedGen: SingleGeneration) => void;
      onError: (failedGen: SingleGeneration, errorMessage: string) => void;
    },
    isRetry = false
  ): { jobId: string; cancel: () => void } {
    const jobId = req.id || this.createJobId();
    const style = STYLE_PRESETS.find(s => s.id === req.styleId) || STYLE_PRESETS[0];

    // Check session counter for deterministic 1st-try success
    const currentAttemptCount = StorageService.loadState().generationCount || 0;
    const willFail = !isRetry && currentAttemptCount > 0 && Math.random() < 0.10;

    const initialGen: SingleGeneration = {
      id: jobId,
      prompt: req.prompt,
      styleId: req.styleId,
      modelId: req.modelId,
      aspectRatio: req.aspectRatio,
      cameraMotion: req.cameraMotion,
      durationSec: req.durationSec,
      status: 'queued',
      progress: 0,
      stageText: 'Queued',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    let cancelled = false;
    let elapsed = 0;
    const startTime = Date.now();

    const jobRecord = { timerId: 0 as any, cancelled: false };
    this.activeJobsMap.set(jobId, jobRecord);

    const cancel = () => {
      cancelled = true;
      jobRecord.cancelled = true;
      clearTimeout(jobRecord.timerId);
      this.activeJobsMap.delete(jobId);
    };

    // Stage 1: Queued (1.2 seconds)
    callbacks.onProgress(0, 'Queued', 0);

    const queueDurationMs = 1200;
    const renderDurationMs = Math.max(3500, req.durationSec * 600); // 3.5s - 5.5s
    const totalSteps = 40;
    const stepIntervalMs = renderDurationMs / totalSteps;

    jobRecord.timerId = setTimeout(() => {
      if (cancelled) return;

      // Stage 2: Rendering (0% to 95%)
      let step = 0;
      const renderInterval = setInterval(() => {
        if (cancelled) {
          clearInterval(renderInterval);
          return;
        }

        step++;
        elapsed = Math.floor((Date.now() - startTime) / 1000);
        const progress = Math.min(95, Math.round((step / totalSteps) * 95));
        callbacks.onProgress(progress, 'Rendering', elapsed);

        if (step >= totalSteps) {
          clearInterval(renderInterval);

          if (willFail) {
            // Simulated 10% failure condition
            StorageService.incrementGenerationCount();
            const failedGen: SingleGeneration = {
              ...initialGen,
              status: 'failed',
              progress: 88,
              stageText: 'Error',
              errorMessage: 'Simulated GPU cluster timeout. Please click Retry.',
            };
            this.activeJobsMap.delete(jobId);
            callbacks.onError(failedGen, failedGen.errorMessage!);
          } else {
            // Stage 3: Finishing (95% to 100%)
            callbacks.onProgress(98, 'Finishing', elapsed);

            jobRecord.timerId = setTimeout(() => {
              if (cancelled) return;

              // Match deterministic asset
              const matchedAsset = matchAssetForPrompt(req.prompt, style.genre, 'wide');
              StorageService.incrementGenerationCount();

              const completedGen: SingleGeneration = {
                ...initialGen,
                status: 'done',
                progress: 100,
                stageText: 'Completed',
                resultAssetId: matchedAsset.id,
              };

              StorageService.saveGeneration(completedGen);
              this.activeJobsMap.delete(jobId);
              callbacks.onSuccess(completedGen);
            }, 600);
          }
        }
      }, stepIntervalMs);
    }, queueDurationMs);

    return { jobId, cancel };
  }
}
