import React, { useState, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  Save, 
  Check, 
  Play, 
  Info
} from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { StorageBlockedBanner } from '../components/common/StorageBlockedBanner';
import { IdeaInputBar } from '../components/storyboard/IdeaInputBar';
import { ShotCard } from '../components/storyboard/ShotCard';
import { SequencePlayer } from '../components/storyboard/SequencePlayer';
import { HowItWorksBanner } from '../components/storyboard/HowItWorksBanner';
import { STYLE_PRESETS } from '../data/presets';
import { 
  Storyboard, 
  StoryboardShot, 
  StylePreset, 
  AspectRatio, 
  CameraMotion,
  GenerationStatus,
  StageText
} from '../types';
import { 
  deconstructIdeaIntoShots, 
  IdeaSuggestion 
} from '../utils/storyboardHelper';
import { StorageService } from '../services/storage';
import { GenerationEngine } from '../services/generationService';

export const StoryboardPage: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [shots, setShots] = useState<StoryboardShot[]>([]);
  const [masterSeed, setMasterSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [storyboardId, setStoryboardId] = useState<string>('');

  // Storage blocked check
  const [isStorageBlocked, setIsStorageBlocked] = useState(false);

  useEffect(() => {
    setIsStorageBlocked(StorageService.isBlocked());
  }, []);

  // Save active storyboard to History
  const handleSaveToHistory = useCallback((currentShots: StoryboardShot[] = shots) => {
    if (currentShots.length === 0) return;

    const sbToSave: Storyboard = {
      id: storyboardId || `sb-${Date.now()}`,
      title: idea.slice(0, 60) || `${selectedStyle.name} 3-Shot Reel`,
      masterIdea: idea,
      genre: selectedStyle.genre,
      stylePresetId: selectedStyle.id,
      aspectRatio: aspectRatio,
      seed: masterSeed,
      shots: currentShots,
      status: currentShots.every(s => s.status === 'done') ? 'done' : 'rendering',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    StorageService.saveStoryboard(sbToSave);
    setStoryboardId(sbToSave.id);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  }, [idea, selectedStyle, aspectRatio, masterSeed, shots, storyboardId]);

  // Execute real image generation for a batch of shots through sequential queue
  const generateShotsReal = useCallback((shotsToQueue: StoryboardShot[], sequenceSeed: number) => {
    setIsGenerating(true);

    let completedCount = 0;
    const totalToGenerate = shotsToQueue.filter(s => !(s.locked && s.status === 'done')).length;

    if (totalToGenerate === 0) {
      setIsGenerating(false);
      return;
    }

    shotsToQueue.forEach((shot) => {
      if (shot.locked && shot.status === 'done') {
        return;
      }

      const shotTypeKey = shot.shotType.includes('Wide') ? 'wide' :
                          shot.shotType.includes('Medium') ? 'medium' : 'closeup';

      GenerationEngine.simulateGeneration(
        {
          id: shot.id,
          prompt: shot.prompt,
          styleId: selectedStyle.id,
          modelId: 'cinemotion-v3',
          aspectRatio,
          cameraMotion: shot.cameraMotion,
          durationSec: shot.durationSec || 5,
          seed: shot.seed !== undefined ? shot.seed : sequenceSeed,
          shotType: shotTypeKey,
        },
        {
          onProgress: (progress: number, stage: StageText) => {
            setShots(prev => prev.map(s => s.id === shot.id ? {
              ...s,
              progress,
              stageText: stage,
              status: (stage === 'Queued' || stage === 'Waiting for your turn') ? 'queued' : 'rendering',
            } : s));
          },
          onSuccess: (completedGen) => {
            setShots(prev => {
              const updated = prev.map(s => s.id === shot.id ? {
                ...s,
                status: 'done' as GenerationStatus,
                progress: 100,
                stageText: 'Completed' as StageText,
                imageUrl: completedGen.imageUrl,
                seed: completedGen.seed,
                isFallback: completedGen.isFallback,
                fallbackReason: completedGen.fallbackReason,
                resultAssetId: completedGen.resultAssetId,
              } : s);

              completedCount++;
              if (completedCount >= totalToGenerate) {
                setIsGenerating(false);
                handleSaveToHistory(updated);
              }
              return updated;
            });
          },
          onError: (failedGen, errorMsg) => {
            setShots(prev => {
              const updated = prev.map(s => s.id === shot.id ? {
                ...s,
                status: 'failed' as GenerationStatus,
                errorMessage: errorMsg || failedGen.errorMessage,
              } : s);

              completedCount++;
              if (completedCount >= totalToGenerate) {
                setIsGenerating(false);
              }
              return updated;
            });
          },
        }
      );
    });
  }, [selectedStyle.id, aspectRatio, handleSaveToHistory]);

  // Handle Deconstruct & Generate
  const handleDeconstruct = () => {
    if (!idea.trim()) return;

    const newSeed = Math.floor(Math.random() * 1000000);
    setMasterSeed(newSeed);

    const initialShots = deconstructIdeaIntoShots(idea, selectedStyle);
    const shotsWithSeed = initialShots.map(s => ({
      ...s,
      seed: newSeed,
      status: 'queued' as GenerationStatus,
      progress: 0,
      stageText: 'Queued' as StageText,
    }));

    setShots(shotsWithSeed);
    setStoryboardId(`sb-${Date.now()}`);
    generateShotsReal(shotsWithSeed, newSeed);
  };

  // Regenerate only unlocked shots with a new sequence seed
  const handleRegenerateUnlocked = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setMasterSeed(newSeed);

    const updatedShots = shots.map((s) => {
      if (s.locked) return s;
      return {
        ...s,
        seed: newSeed,
        status: 'queued' as GenerationStatus,
        progress: 0,
        stageText: 'Queued' as StageText,
      };
    });

    setShots(updatedShots);
    generateShotsReal(updatedShots, newSeed);
  };

  // Regenerate a single specific shot with a new random seed
  const handleRegenerateSingleShot = (shotId: string) => {
    const targetShot = shots.find((s) => s.id === shotId);
    if (!targetShot) return;

    const newShotSeed = Math.floor(Math.random() * 1000000);
    const shotTypeKey = targetShot.shotType.includes('Wide') ? 'wide' :
                        targetShot.shotType.includes('Medium') ? 'medium' : 'closeup';

    setShots(prev => prev.map(s => s.id === shotId ? {
      ...s,
      seed: newShotSeed,
      status: 'queued',
      progress: 0,
      stageText: 'Queued',
    } : s));

    GenerationEngine.simulateGeneration(
      {
        id: targetShot.id,
        prompt: targetShot.prompt,
        styleId: selectedStyle.id,
        modelId: 'cinemotion-v3',
        aspectRatio,
        cameraMotion: targetShot.cameraMotion,
        durationSec: targetShot.durationSec || 5,
        seed: newShotSeed,
        shotType: shotTypeKey,
      },
      {
        onProgress: (progress: number, stage: StageText) => {
          setShots(prev => prev.map(s => s.id === shotId ? {
            ...s,
            progress,
            stageText: stage,
            status: (stage === 'Queued' || stage === 'Waiting for your turn') ? 'queued' : 'rendering',
          } : s));
        },
        onSuccess: (completedGen) => {
          setShots(prev => {
            const updated = prev.map(s => s.id === shotId ? {
              ...s,
              status: 'done' as GenerationStatus,
              progress: 100,
              stageText: 'Completed' as StageText,
              imageUrl: completedGen.imageUrl,
              seed: completedGen.seed,
              isFallback: completedGen.isFallback,
              fallbackReason: completedGen.fallbackReason,
              resultAssetId: completedGen.resultAssetId,
            } : s);
            handleSaveToHistory(updated);
            return updated;
          });
        },
        onError: (failedGen, errorMsg) => {
          setShots(prev => prev.map(s => s.id === shotId ? {
            ...s,
            status: 'failed' as GenerationStatus,
            errorMessage: errorMsg || failedGen.errorMessage,
          } : s));
        },
      }
    );
  };

  // Update prompt inline
  const handleUpdatePrompt = (shotId: string, newPrompt: string) => {
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, prompt: newPrompt } : s))
    );
  };

  // Toggle lock
  const handleToggleLock = (shotId: string) => {
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, locked: !s.locked } : s))
    );
  };

  // Change camera motion
  const handleChangeCamera = (shotId: string, motion: CameraMotion) => {
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, cameraMotion: motion } : s))
    );
  };

  // Change shot duration
  const handleChangeDuration = (shotId: string, durationSec: number) => {
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, durationSec } : s))
    );
  };

  // Reorder shots: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setShots((prev) => {
      const newShots = [...prev];
      const temp = newShots[index - 1];
      newShots[index - 1] = newShots[index];
      newShots[index] = temp;
      return newShots;
    });
  };

  // Reorder shots: Move Down
  const handleMoveDown = (index: number) => {
    if (index === shots.length - 1) return;
    setShots((prev) => {
      const newShots = [...prev];
      const temp = newShots[index + 1];
      newShots[index + 1] = newShots[index];
      newShots[index] = temp;
      return newShots;
    });
  };

  // Quick Starter selection
  const handleSelectSuggestion = (sug: IdeaSuggestion) => {
    setIdea(sug.idea);
    const matchedStyle = STYLE_PRESETS.find((s: StylePreset) => s.id === sug.styleId) || STYLE_PRESETS[0];
    setSelectedStyle(matchedStyle);

    const newSeed = Math.floor(Math.random() * 1000000);
    setMasterSeed(newSeed);

    const initialShots = deconstructIdeaIntoShots(sug.idea, matchedStyle);
    const shotsWithSeed = initialShots.map(s => ({
      ...s,
      seed: newSeed,
      status: 'queued' as GenerationStatus,
      progress: 0,
      stageText: 'Queued' as StageText,
    }));

    setShots(shotsWithSeed);
    setStoryboardId(`sb-${Date.now()}`);
    generateShotsReal(shotsWithSeed, newSeed);
  };

  const hasShots = shots.length > 0;
  const allShotsDone = hasShots && shots.every((s) => s.status === 'done');

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Storage Alert if applicable */}
      <StorageBlockedBanner isBlocked={isStorageBlocked} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              3-Shot Storyboard Engine
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cine-amber/20 text-cine-amber border border-cine-amber/40 shadow-amber-sm">
              Synchronized Multi-Angle Stills
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Transform a single creative premise into a 3-shot sequence (Wide Establishing, Medium Subject, Close-Up Detail) with shared seed coherency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PrototypeBadge variant="prominent" />
        </div>
      </div>

      {/* Master Narrative Idea Input Bar */}
      <IdeaInputBar
        idea={idea}
        onChangeIdea={setIdea}
        selectedStyleId={selectedStyle.id}
        onSelectStyle={setSelectedStyle}
        aspectRatio={aspectRatio}
        onChangeAspectRatio={setAspectRatio}
        onDeconstruct={handleDeconstruct}
        isGenerating={isGenerating}
        hasShots={hasShots}
      />

      {/* Empty State: 5-Second Explainer Banner */}
      {!hasShots && (
        <HowItWorksBanner onSelectSuggestion={handleSelectSuggestion} />
      )}

      {/* Active Storyboard Workflow Section */}
      {hasShots && (
        <div className="space-y-6 animate-fadeIn">
          {/* Action Toolbar */}
          <div className="p-4 rounded-2xl bg-surface-dark border border-cine-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cine-amber animate-pulse" />
              <span className="text-sm font-bold text-text-primary">
                3-Shot Direction Setup ({selectedStyle.name})
              </span>
              <span className="text-xs text-text-muted">
                ({shots.filter((s: StoryboardShot) => s.locked).length} locked)
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
              {/* Regenerate Unlocked */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleRegenerateUnlocked}
                className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border hover:border-cine-amber text-text-primary text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 text-cine-amber ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Unlocked</span>
              </button>

              {/* Save to History Button */}
              <button
                type="button"
                onClick={() => handleSaveToHistory()}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  savedFeedback
                    ? 'bg-cine-emerald/20 border-cine-emerald text-cine-emerald'
                    : 'bg-surface-raised hover:bg-surface-raised/80 border-cine-border hover:border-cine-amber text-text-primary'
                }`}
              >
                {savedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cine-emerald" />
                    <span>Saved to History!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-cine-amber" />
                    <span>Save to History</span>
                  </>
                )}
              </button>

              {/* Master Theater Play Trigger */}
              <button
                type="button"
                onClick={() => setShowPlayerModal(!showPlayerModal)}
                className="px-4 py-2 rounded-xl bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian text-xs font-bold flex items-center gap-1.5 shadow-amber-md transition-transform hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{showPlayerModal ? 'Hide Master Theater' : 'Play Sequence'}</span>
              </button>
            </div>
          </div>

          {/* Master Theater Player View */}
          {showPlayerModal && (
            <div className="animate-fadeIn">
              <SequencePlayer
                shots={shots}
                masterIdea={idea}
                stylePreset={selectedStyle}
                aspectRatio={aspectRatio}
              />
            </div>
          )}

          {/* 3-Shot Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {shots.map((shot, index) => (
              <ShotCard
                key={shot.id}
                shot={shot}
                index={index}
                totalShots={shots.length}
                aspectRatio={aspectRatio}
                expectedGenre={selectedStyle.genre}
                onUpdatePrompt={handleUpdatePrompt}
                onToggleLock={handleToggleLock}
                onChangeCamera={handleChangeCamera}
                onChangeDuration={handleChangeDuration}
                onRegenerateShot={handleRegenerateSingleShot}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isGenerating={isGenerating}
              />
            ))}
          </div>

          {/* Persistent Sequence Player if modal is not open */}
          {!showPlayerModal && allShotsDone && (
            <div className="pt-4 animate-fadeIn">
              <SequencePlayer
                shots={shots}
                masterIdea={idea}
                stylePreset={selectedStyle}
                aspectRatio={aspectRatio}
              />
            </div>
          )}

          {/* Coherency & Attribution Disclaimer Notice */}
          <div className="p-4 rounded-xl bg-surface-raised/50 border border-cine-border/70 flex items-start gap-3 text-xs text-text-muted">
            <Info className="w-4 h-4 text-cine-amber shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary">
                Live Generation & Narrative Continuity:
              </p>
              <p className="mt-0.5">
                All 3 shots are generated with synchronized seed #{masterSeed} in "{selectedStyle.name}" styling. Requests are spaced through a client-side queue to respect public rate limits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
