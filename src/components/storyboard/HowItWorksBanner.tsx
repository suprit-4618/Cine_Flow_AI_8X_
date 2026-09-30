import React from 'react';
import { Lightbulb, Layers, PlayCircle, Sparkles } from 'lucide-react';
import { STORYBOARD_SUGGESTIONS, IdeaSuggestion } from '../../utils/storyboardHelper';

interface HowItWorksBannerProps {
  onSelectSuggestion: (sug: IdeaSuggestion) => void;
}

export const HowItWorksBanner: React.FC<HowItWorksBannerProps> = ({ onSelectSuggestion }) => {
  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cine-amber/10 border border-cine-amber/30 flex items-center justify-center text-cine-amber">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            How the 3-Shot Storyboard Engine Works
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Direct coherent cinematic scenes in 3 automated narrative angles.
          </p>
        </div>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-raised border border-cine-border/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cine-amber/20 text-cine-amber text-xs font-bold flex items-center justify-center border border-cine-amber/40">1</span>
            <Lightbulb className="w-4 h-4 text-cine-amber" />
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Describe Vision</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Enter a single narrative premise or logline and pick a visual style preset.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-raised border border-cine-border/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cine-amber/20 text-cine-amber text-xs font-bold flex items-center justify-center border border-cine-amber/40">2</span>
            <Layers className="w-4 h-4 text-cine-amber" />
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Deconstruct</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            CineFlow splits your idea into matched Wide, Medium, and Close-up camera setups.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-raised border border-cine-border/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cine-amber/20 text-cine-amber text-xs font-bold flex items-center justify-center border border-cine-amber/40">3</span>
            <PlayCircle className="w-4 h-4 text-cine-amber" />
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Master Theater</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Fine-tune or lock shots, then play the continuous sequence in our auto-advancing theater player.
          </p>
        </div>
      </div>

      {/* Quick Starters */}
      <div className="pt-2 border-t border-cine-border/60">
        <p className="text-xs font-semibold text-text-secondary mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cine-amber" />
          Or try a quick director premise starter:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STORYBOARD_SUGGESTIONS.map((sug) => (
            <button
              key={sug.id}
              onClick={() => onSelectSuggestion(sug)}
              className="p-3 rounded-xl bg-surface-raised/80 hover:bg-surface-raised border border-cine-border hover:border-cine-amber/50 text-left transition-all duration-200 group flex items-start justify-between gap-2"
            >
              <div>
                <p className="text-xs font-semibold text-text-primary group-hover:text-cine-amber transition-colors">
                  {sug.title}
                </p>
                <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                  {sug.idea}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-dark border border-cine-border text-cine-amber shrink-0 group-hover:border-cine-amber/40">
                Load
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
