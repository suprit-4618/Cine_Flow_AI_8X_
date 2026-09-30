import React from 'react';
import { Sparkles, Layers, Wand2 } from 'lucide-react';
import { STYLE_PRESETS } from '../../data/presets';
import { StylePreset, AspectRatio } from '../../types';
import { PrototypeBadge } from '../common/PrototypeBadge';

interface IdeaInputBarProps {
  idea: string;
  onChangeIdea: (val: string) => void;
  selectedStyleId: string;
  onSelectStyle: (style: StylePreset) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  onDeconstruct: () => void;
  isGenerating: boolean;
  hasShots: boolean;
}

export const IdeaInputBar: React.FC<IdeaInputBarProps> = ({
  idea,
  onChangeIdea,
  selectedStyleId,
  onSelectStyle,
  aspectRatio,
  onChangeAspectRatio,
  onDeconstruct,
  isGenerating,
  hasShots,
}) => {
  const currentStyle = STYLE_PRESETS.find((s: StylePreset) => s.id === selectedStyleId) || STYLE_PRESETS[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (idea.trim() && !isGenerating) {
        onDeconstruct();
      }
    }
  };

  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border p-5 sm:p-6 space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label htmlFor="storyboard-idea" className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-cine-amber" />
          Master Narrative Premise / Scene Concept
        </label>
        <span className="text-xs text-text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-cine-border text-[10px] text-text-secondary">Ctrl+Enter</kbd> to generate
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="storyboard-idea"
          rows={3}
          value={idea}
          onChange={(e) => onChangeIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your whole scene or storyline (e.g., A cybernetic courier fleeing across rain-slicked neon skyscrapers under heavy cyber storm clouds...)"
          className="w-full px-4 py-3 bg-surface-raised/70 border border-cine-border rounded-xl text-text-primary placeholder-text-muted/60 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cine-amber/60 focus:border-cine-amber transition-all resize-none"
        />
        <div className="absolute right-3 bottom-3 text-xs text-text-muted select-none">
          {idea.length}/300
        </div>
      </div>

      {/* Style Presets and Aspect Ratio Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            1. Unified Aesthetic Look & Style Preset
          </span>
          <span className="text-xs text-cine-amber font-medium">
            Active: {currentStyle.name}
          </span>
        </div>

        {/* Style Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {STYLE_PRESETS.map((preset: StylePreset) => {
            const isSelected = preset.id === selectedStyleId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectStyle(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cine-amber/15 border-cine-amber text-text-primary shadow-amber-sm ring-1 ring-cine-amber/50'
                    : 'bg-surface-raised/60 hover:bg-surface-raised border-cine-border text-text-muted hover:text-text-primary hover:border-cine-border/80'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold truncate">{preset.name}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cine-amber shrink-0 animate-pulse" />}
                </div>
                <span className="text-[10px] text-text-muted line-clamp-1">{preset.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio & Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-cine-border/60">
        {/* Aspect Ratio Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted mr-1">Aspect Ratio:</span>
          {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => onChangeAspectRatio(ratio)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                aspectRatio === ratio
                  ? 'bg-surface-raised border-cine-amber text-cine-amber'
                  : 'bg-surface-dark border-cine-border text-text-muted hover:text-text-primary'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Action Button & Simulation Tag */}
        <div className="flex items-center gap-3">
          <PrototypeBadge />
          <button
            type="button"
            disabled={!idea.trim() || isGenerating}
            onClick={onDeconstruct}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md ${
              !idea.trim() || isGenerating
                ? 'bg-surface-raised text-text-muted border border-cine-border cursor-not-allowed opacity-60'
                : 'bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian shadow-amber-md hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{hasShots ? 'Re-Deconstruct & Generate All' : 'Deconstruct into 3 Shots'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
