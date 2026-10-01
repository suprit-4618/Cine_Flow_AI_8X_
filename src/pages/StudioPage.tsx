import React, { useRef, useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { SAMPLE_ASSETS } from '../data/assets';
import { STYLE_PRESETS } from '../data/presets';
import { SampleVideoCard } from '../components/studio/SampleVideoCard';
import { GenerationFeedCard } from '../components/studio/GenerationFeedCard';
import { ComposerBar } from '../components/studio/ComposerBar';
import { ResultModal } from '../components/studio/ResultModal';
import { StorageBlockedBanner } from '../components/common/StorageBlockedBanner';
import { SingleGeneration, GenreCategory } from '../types';

export const StudioPage: React.FC = () => {
  const {
    activeJobs,
    generations,
    startGeneration,
    cancelJob,
    retryJob,
    reusePrompt,
    updateDraft,
    isStorageBlocked,
  } = useStudio();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inspectingResult, setInspectingResult] = useState<SingleGeneration | null>(null);

  const isGenerating = activeJobs.length > 0;

  const handleSelectSample = (prompt: string, styleId: string) => {
    updateDraft({ prompt, styleId });
    textareaRef.current?.focus();
    // Scroll smoothly to composer
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleGenerate = () => {
    startGeneration();
  };

  // Group sample clips by genre look
  const genreGroups: { genre: GenreCategory; name: string; assets: typeof SAMPLE_ASSETS }[] = [
    {
      genre: 'neon_city',
      name: 'Neon Noir',
      assets: SAMPLE_ASSETS.filter(a => a.genre === 'neon_city'),
    },
    {
      genre: 'alpine_nature',
      name: 'Alpine Vista',
      assets: SAMPLE_ASSETS.filter(a => a.genre === 'alpine_nature'),
    },
    {
      genre: 'deep_space',
      name: 'Deep Space',
      assets: SAMPLE_ASSETS.filter(a => a.genre === 'deep_space'),
    },
    {
      genre: 'macro_abstract',
      name: 'Macro Prism',
      assets: SAMPLE_ASSETS.filter(a => a.genre === 'macro_abstract'),
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between pb-44 sm:pb-36">
      {/* Storage Warning if blocked */}
      <StorageBlockedBanner isBlocked={isStorageBlocked} />

      {/* Main Media Canvas */}
      <div className="space-y-8 animate-fadeIn">
        {/* Simple Honest Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Studio
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Pick a look to start, or write your own.
            </p>
          </div>
        </div>

        {/* Active In-Progress Generations Feed (Top of Canvas) */}
        {activeJobs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Generating
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeJobs.map((job) => (
                <GenerationFeedCard
                  key={job.id}
                  generation={job.generation}
                  elapsedSec={job.elapsedSec}
                  onCancel={() => cancelJob(job.id)}
                  onRetry={retryJob}
                  onSelectResult={setInspectingResult}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Creations in Gallery (If any exist) */}
        {generations.length > 0 && activeJobs.length === 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Latest Creation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <GenerationFeedCard
                generation={generations[0]}
                onSelectResult={setInspectingResult}
              />
            </div>
          </div>
        )}

        {/* Living Media Inspiration Gallery Grouped by Look */}
        <div className="space-y-8">
          {genreGroups.map((group) => {
            const style = STYLE_PRESETS.find(s => s.genre === group.genre);
            return (
              <div key={group.genre} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-text-primary">
                    {group.name}
                  </h2>
                  <span className="text-xs text-text-dim">
                    {style?.tag || '3 Shots'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.assets.map((asset) => (
                    <SampleVideoCard
                      key={asset.id}
                      asset={asset}
                      onSelectPrompt={handleSelectSample}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Anchored Hero Composer Bar */}
      <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 px-4 sm:px-6 lg:px-8 z-40 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <ComposerBar
            textareaRef={textareaRef}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Result Player Modal */}
      {inspectingResult && (
        <ResultModal
          generation={inspectingResult}
          onClose={() => setInspectingResult(null)}
          onReusePrompt={reusePrompt}
        />
      )}
    </div>
  );
};
