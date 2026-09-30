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
  rotateAssetForShot, 
  IdeaSuggestion 
} from '../utils/storyboardHelper';
import { StorageService } from '../services/storage';

export const StoryboardPage: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [shots, setShots] = useState<StoryboardShot[]>([]);
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
      shots: currentShots,
      status: currentShots.every(s => s.status === 'done') ? 'done' : 'rendering',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    StorageService.saveStoryboard(sbToSave);
    setStoryboardId(sbToSave.id);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  }, [idea, selectedStyle, aspectRatio, shots, storyboardId]);

  // Simulate generation for a list of shots with rotation guarantee
  const runGenerationPipeline = useCallback(async (shotsToRun: StoryboardShot[]) => {
    setIsGenerating(true);

    const stages: { stage: StageText; progress: number; delay: number }[] = [
      { stage: 'Queued', progress: 15, delay: 400 },
      { stage: 'Rendering', progress: 50, delay: 800 },
      { stage: 'Finishing', progress: 85, delay: 700 },
      { stage: 'Completed', progress: 100, delay: 500 },
    ];

    let currentWorkingShots = [...shotsToRun];

    for (const step of stages) {
      await new Promise((res) => setTimeout(res, step.delay));

      currentWorkingShots = currentWorkingShots.map((shot) => {
        // Skip locked shots if they are already done
        if (shot.locked && shot.status === 'done') return shot;

        return {
          ...shot,
          status: (step.progress === 100 ? 'done' : 'rendering') as GenerationStatus,
          progress: step.progress,
          stageText: step.stage,
        };
      });

      setShots(currentWorkingShots);
    }

    setIsGenerating(false);
    handleSaveToHistory(currentWorkingShots);
  }, [handleSaveToHistory]);

  // Handle Deconstruct & Generate
  const handleDeconstruct = () => {
    if (!idea.trim()) return;

    const newShots = deconstructIdeaIntoShots(idea, selectedStyle);
    setShots(newShots);
    setStoryboardId(`sb-${Date.now()}`);
    runGenerationPipeline(newShots);
  };

  // Regenerate only unlocked shots with rotated variety (Fix 1 & 2)
  const handleRegenerateUnlocked = () => {
    const updated = shots.map((s) => {
      if (s.locked) return s;
      // Rotate asset within the selected genre look, ensuring a new output
      const newAsset = rotateAssetForShot(s.resultAssetId, selectedStyle.genre, s.shotType);
      return {
        ...s,
        resultAssetId: newAsset.id,
        status: 'queued' as GenerationStatus,
        progress: 0,
        stageText: 'Queued' as StageText,
      };
    });
    setShots(updated);
    runGenerationPipeline(updated);
  };

  // Regenerate a single specific shot with rotation variety (Fix 1 & 2)
  const handleRegenerateSingleShot = async (shotId: string) => {
    const targetShot = shots.find((s) => s.id === shotId);
    if (!targetShot) return;

    // Pick rotated asset within the SAME genre look (never same output twice in a row)
    const newAsset = rotateAssetForShot(targetShot.resultAssetId, selectedStyle.genre, targetShot.shotType);

    // Set to queued
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { 
        ...s, 
        resultAssetId: newAsset.id,
        status: 'queued', 
        progress: 10, 
        stageText: 'Queued' 
      } : s))
    );

    // Simulate rendering stages
    await new Promise((r) => setTimeout(r, 500));
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, status: 'rendering', progress: 55, stageText: 'Rendering' } : s))
    );

    await new Promise((r) => setTimeout(r, 700));
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, status: 'rendering', progress: 90, stageText: 'Finishing' } : s))
    );

    await new Promise((r) => setTimeout(r, 400));
    setShots((prev) => {
      const updated = prev.map((s) =>
        s.id === shotId ? { 
          ...s, 
          resultAssetId: newAsset.id,
          status: 'done' as GenerationStatus, 
          progress: 100, 
          stageText: 'Completed' as StageText 
        } : s
      );
      handleSaveToHistory(updated);
      return updated;
    });
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

  // Change shot duration (Fix 3)
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
    const newShots = deconstructIdeaIntoShots(sug.idea, matchedStyle);
    setShots(newShots);
    setStoryboardId(`sb-${Date.now()}`);
    runGenerationPipeline(newShots);
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
              Original Signature Feature
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Transform a single creative premise into a synchronized 3-shot sequence (Wide Establishing, Medium Subject, Close-Up Detail).
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
                <span>{showPlayerModal ? 'Hide Master Theater' : 'Play Full Sequence'}</span>
              </button>
            </div>
          </div>

          {/* Master Theater Player View (Inline or toggled) */}
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
                Aesthetic & Sequence Continuity Note:
              </p>
              <p className="mt-0.5">
                All 3 shots are rendered in synchronized "{selectedStyle.name}" ({selectedStyle.genre}) color palettes and matching environmental lighting. Shots showcase matched atmospheric tone and location staging across Wide, Medium, and Close-up perspectives without falsely asserting identical human actors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
