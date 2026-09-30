import React from 'react';
import { Film } from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const StoryboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              3-Shot Storyboard Engine
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cine-amber/20 text-cine-amber border border-cine-amber/40">
              Signature Feature
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Break down a single narrative idea into Wide, Medium, and Close-up shots with seamless continuous sequence playback.
          </p>
        </div>
        <PrototypeBadge variant="prominent" />
      </div>

      {/* Storyboard Content Placeholder */}
      <div className="p-8 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center mb-4 text-cine-amber shadow-amber-sm">
          <Film className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">3-Shot Sequencing Workspace</h2>
        <p className="text-sm text-text-muted max-w-md mt-2">
          Storyboard beat generator, per-shot regeneration, and Master Theater auto-advancing player ready to wire in Phase 4.
        </p>
      </div>
    </div>
  );
};
