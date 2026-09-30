import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SingleGeneration, Storyboard, AspectRatio, CameraMotion } from '../types';
import { StorageService } from '../services/storage';
import { GenerationEngine, GenerationRequest, ActiveJob } from '../services/generationService';

interface DraftState {
  prompt: string;
  styleId: string;
  modelId: string;
  aspectRatio: AspectRatio;
  cameraMotion: CameraMotion;
  durationSec: number;
}

interface StudioContextType {
  generations: SingleGeneration[];
  storyboards: Storyboard[];
  activeJobs: ActiveJob[];
  selectedGeneration: SingleGeneration | null;
  draft: DraftState;
  isStorageBlocked: boolean;
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
  updateDraft: (updates: Partial<DraftState>) => void;
  startGeneration: (customReq?: Partial<GenerationRequest>) => string | null;
  cancelJob: (jobId: string) => void;
  retryJob: (gen: SingleGeneration) => void;
  selectGeneration: (gen: SingleGeneration | null) => void;
  reusePrompt: (gen: SingleGeneration) => void;
  makeVariations: (gen: SingleGeneration) => void;
  deleteGeneration: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [generations, setGenerations] = useState<SingleGeneration[]>([]);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<SingleGeneration | null>(null);
  const [isStorageBlocked, setIsStorageBlocked] = useState<boolean>(false);

  const [draft, setDraft] = useState<DraftState>({
    prompt: '',
    styleId: 'neon-noir',
    modelId: 'cinemotion-v3',
    aspectRatio: '16:9',
    cameraMotion: 'static',
    durationSec: 5,
  });

  // Hydrate state from localStorage on mount
  useEffect(() => {
    const state = StorageService.loadState();
    setGenerations(state.generations || []);
    setStoryboards(state.storyboards || []);
    setIsStorageBlocked(StorageService.isBlocked());

    if (state.activeDraft) {
      setDraft(prev => ({
        ...prev,
        ...state.activeDraft,
      }));
    }

    if (state.generations && state.generations.length > 0) {
      setSelectedGeneration(state.generations[0]);
    }
  }, []);

  const updateDraft = useCallback((updates: Partial<DraftState>) => {
    setDraft(prev => {
      const next = { ...prev, ...updates };
      const currentState = StorageService.loadState();
      StorageService.saveState({
        ...currentState,
        activeDraft: {
          prompt: next.prompt,
          styleId: next.styleId,
          modelId: next.modelId,
          aspectRatio: next.aspectRatio,
          cameraMotion: next.cameraMotion,
        },
      });
      return next;
    });
  }, []);

  const cancelJob = useCallback((jobId: string) => {
    setActiveJobs(prev => {
      const target = prev.find(j => j.id === jobId);
      if (target) {
        target.cancel();
      }
      return prev.filter(j => j.id !== jobId);
    });
  }, []);

  const startGeneration = useCallback((customReq?: Partial<GenerationRequest>): string | null => {
    const promptText = customReq?.prompt !== undefined ? customReq.prompt : draft.prompt;
    if (!promptText.trim()) return null;

    const req: GenerationRequest = {
      prompt: promptText.trim(),
      styleId: customReq?.styleId || draft.styleId,
      modelId: customReq?.modelId || draft.modelId,
      aspectRatio: customReq?.aspectRatio || draft.aspectRatio,
      cameraMotion: customReq?.cameraMotion || draft.cameraMotion,
      durationSec: customReq?.durationSec || draft.durationSec,
    };

    const initialGen: SingleGeneration = {
      id: GenerationEngine.createJobId(),
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

    let activeJobRef: ActiveJob;

    const { jobId, cancel } = GenerationEngine.simulateGeneration(
      { ...req, id: initialGen.id },
      {
        onProgress: (progress, stage, elapsed) => {
          setActiveJobs(prev =>
            prev.map(j =>
              j.id === jobId
                ? {
                    ...j,
                    elapsedSec: elapsed,
                    generation: {
                      ...j.generation,
                      progress,
                      stageText: stage,
                      status: stage === 'Queued' ? 'queued' : 'rendering',
                    },
                  }
                : j
            )
          );
        },
        onSuccess: completedGen => {
          setGenerations(prev => [completedGen, ...prev.filter(g => g.id !== completedGen.id)]);
          setSelectedGeneration(completedGen);
          setActiveJobs(prev => prev.filter(j => j.id !== jobId));
          setIsStorageBlocked(StorageService.isBlocked());
        },
        onError: (failedGen, errorMsg) => {
          setActiveJobs(prev =>
            prev.map(j =>
              j.id === jobId
                ? {
                    ...j,
                    generation: {
                      ...failedGen,
                      errorMessage: errorMsg,
                    },
                  }
                : j
            )
          );
        },
      }
    );

    activeJobRef = {
      id: jobId,
      generation: initialGen,
      elapsedSec: 0,
      cancel,
    };

    setActiveJobs(prev => [activeJobRef, ...prev]);
    return jobId;
  }, [draft]);

  const retryJob = useCallback((gen: SingleGeneration) => {
    // Remove from activeJobs if still present
    setActiveJobs(prev => prev.filter(j => j.id !== gen.id));

    const req: GenerationRequest = {
      id: gen.id,
      prompt: gen.prompt,
      styleId: gen.styleId,
      modelId: gen.modelId,
      aspectRatio: gen.aspectRatio,
      cameraMotion: gen.cameraMotion,
      durationSec: gen.durationSec,
    };

    const { jobId, cancel } = GenerationEngine.simulateGeneration(
      req,
      {
        onProgress: (progress, stage, elapsed) => {
          setActiveJobs(prev =>
            prev.map(j =>
              j.id === jobId
                ? {
                    ...j,
                    elapsedSec: elapsed,
                    generation: {
                      ...j.generation,
                      progress,
                      stageText: stage,
                      status: stage === 'Queued' ? 'queued' : 'rendering',
                    },
                  }
                : j
            )
          );
        },
        onSuccess: completedGen => {
          setGenerations(prev => [completedGen, ...prev.filter(g => g.id !== completedGen.id)]);
          setSelectedGeneration(completedGen);
          setActiveJobs(prev => prev.filter(j => j.id !== jobId));
        },
        onError: (failedGen, errorMsg) => {
          setActiveJobs(prev =>
            prev.map(j =>
              j.id === jobId
                ? {
                    ...j,
                    generation: {
                      ...failedGen,
                      errorMessage: errorMsg,
                    },
                  }
                : j
            )
          );
        },
      },
      true // isRetry = true (guarantees success)
    );

    const retryJobObj: ActiveJob = {
      id: jobId,
      generation: { ...gen, status: 'queued', progress: 0, stageText: 'Queued', errorMessage: undefined },
      elapsedSec: 0,
      cancel,
    };

    setActiveJobs(prev => [retryJobObj, ...prev.filter(j => j.id !== jobId)]);
  }, []);

  const reusePrompt = useCallback((gen: SingleGeneration) => {
    updateDraft({
      prompt: gen.prompt,
      styleId: gen.styleId,
      modelId: gen.modelId,
      aspectRatio: gen.aspectRatio,
      cameraMotion: gen.cameraMotion,
      durationSec: gen.durationSec,
    });
  }, [updateDraft]);

  const makeVariations = useCallback((gen: SingleGeneration) => {
    const variationPrompt = `${gen.prompt}, variant angle, subtle lighting shift, high dynamic range`;
    updateDraft({
      prompt: variationPrompt,
      styleId: gen.styleId,
      modelId: gen.modelId,
      aspectRatio: gen.aspectRatio,
      cameraMotion: gen.cameraMotion,
      durationSec: gen.durationSec,
    });
  }, [updateDraft]);

  const deleteGeneration = useCallback((id: string) => {
    StorageService.deleteGeneration(id);
    setGenerations(prev => prev.filter(g => g.id !== id));
    if (selectedGeneration?.id === id) {
      setSelectedGeneration(generations.find(g => g.id !== id) || null);
    }
  }, [selectedGeneration, generations]);

  const toggleFavorite = useCallback((id: string) => {
    const isFav = StorageService.toggleFavorite(id);
    setGenerations(prev =>
      prev.map(g => (g.id === id ? { ...g, isFavorite: isFav } : g))
    );
    if (selectedGeneration?.id === id) {
      setSelectedGeneration(prev => prev ? { ...prev, isFavorite: isFav } : null);
    }
  }, [selectedGeneration]);

  const clearHistory = useCallback(() => {
    StorageService.clearAll();
    setGenerations([]);
    setSelectedGeneration(null);
  }, []);

  return (
    <StudioContext.Provider
      value={{
        generations,
        storyboards,
        activeJobs,
        selectedGeneration,
        draft,
        isStorageBlocked,
        setDraft,
        updateDraft,
        startGeneration,
        cancelJob,
        retryJob,
        selectGeneration: setSelectedGeneration,
        reusePrompt,
        makeVariations,
        deleteGeneration,
        toggleFavorite,
        clearHistory,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = (): StudioContextType => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
