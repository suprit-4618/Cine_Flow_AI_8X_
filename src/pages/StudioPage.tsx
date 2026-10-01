import React from 'react';
import { useStudio } from '../context/StudioContext';
import { PromptBox } from '../components/studio/PromptBox';
import { StyleSelector } from '../components/studio/StyleSelector';
import { ModelPicker } from '../components/studio/ModelPicker';
import { AspectRatioPicker } from '../components/studio/AspectRatioPicker';
import { DurationPicker } from '../components/studio/DurationPicker';
import { CameraWidget } from '../components/studio/CameraWidget';
import { GenerateButton } from '../components/studio/GenerateButton';
import { ActiveJobsFeed } from '../components/studio/ActiveJobsFeed';
import { ResultPlayer } from '../components/studio/ResultPlayer';
import { StorageBlockedBanner } from '../components/common/StorageBlockedBanner';
import { Film, Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudioPage: React.FC = () => {
  const {
    draft,
    activeJobs,
    selectedGeneration,
    generations,
    startGeneration,
    isStorageBlocked,
  } = useStudio();

  const isGenerating = activeJobs.length > 0;
  const isPromptEmpty = !draft.prompt.trim();

  const handleGenerate = () => {
    startGeneration();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Storage Warning if blocked */}
      <StorageBlockedBanner isBlocked={isStorageBlocked} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Single-Shot Studio
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-cine-border text-cine-amber">
              v1.0 Production
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Prompt-to-video synthesis engine with 2D camera motion control, style presets, and deterministic neural matching.
          </p>
        </div>

        {/* Action Link to Storyboard */}
        <Link
          to="/storyboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-amber/40 text-xs font-semibold text-cine-amber transition-all shadow-sm group min-h-[44px]"
        >
          <Film className="w-4 h-4 text-cine-amber group-hover:scale-110 transition-transform" />
          <span>Switch to 3-Shot Storyboard</span>
        </Link>
      </div>

      {/* Main Studio 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Primary Column: Prompting, Presets, Active Renders & Result */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Workspace */}
          <PromptBox onGenerate={handleGenerate} isGenerating={isGenerating} />

          {/* Style Preset Selector */}
          <StyleSelector />

          {/* Primary Generate Bar (Mobile & Desktop Accessible) */}
          <GenerateButton
            onClick={handleGenerate}
            isGenerating={isGenerating}
            disabled={isPromptEmpty}
          />

          {/* Active Generation Queue Feed */}
          <ActiveJobsFeed jobs={activeJobs} />

          {/* Latest Generation Result Player */}
          {selectedGeneration ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Clapperboard className="w-4 h-4 text-cine-amber" />
                  <span>Preview & Result Master</span>
                </h3>
                <span className="text-xs text-text-dim">
                  {generations.length} {generations.length === 1 ? 'creation' : 'creations'} saved
                </span>
              </div>
              <ResultPlayer generation={selectedGeneration} />
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-surface-dark/60 border border-cine-border/70 flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center mb-3 text-text-dim">
                <Clapperboard className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No Render Selected Yet</h3>
              <p className="text-xs text-text-muted max-w-sm mt-1">
                Enter a scene prompt and click <strong className="text-cine-amber">Generate</strong> to launch the live AI image generation pipeline.
              </p>
            </div>
          )}
        </div>

        {/* Right Secondary Column: Parameters, Camera Gizmo & Estimates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Model Engine Selector */}
          <ModelPicker />

          {/* Aspect Ratio & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-dark border border-cine-border">
            <AspectRatioPicker />
            <DurationPicker />
          </div>

          {/* 2D CSS Camera Motion Widget */}
          <CameraWidget />
        </div>

      </div>
    </div>
  );
};
