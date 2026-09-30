import React from 'react';
import { Clapperboard } from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const StudioPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Cinematic Studio
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Prompt-to-video generation with custom camera motions and cinematic presets.
          </p>
        </div>
        <PrototypeBadge variant="prominent" />
      </div>

      {/* Studio Canvas Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[360px]">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center mb-4 text-cine-amber shadow-amber-sm">
            <Clapperboard className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Studio Canvas Initialized</h2>
          <p className="text-sm text-text-muted max-w-md mt-2">
            Phase 1 scaffold loaded. Prompt controls, 2D camera motion widgets, and style presets will be wired in Phase 2.
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-dark border border-cine-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Parameters</h3>
            <span className="text-xs text-cine-amber font-mono">15 Tokens / shot</span>
          </div>
          <div className="h-28 rounded-xl bg-surface-raised/50 border border-cine-border/50 flex items-center justify-center text-xs text-text-dim">
            Model & Aspect Ratio Selector
          </div>
          <div className="h-28 rounded-xl bg-surface-raised/50 border border-cine-border/50 flex items-center justify-center text-xs text-text-dim">
            2D Camera Motion Gizmo
          </div>
        </div>
      </div>
    </div>
  );
};
