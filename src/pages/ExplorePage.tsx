import React from 'react';
import { Compass } from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const ExplorePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Explore Showcase
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-raised border border-cine-border text-text-muted">
              Curated Community Hub
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Discover community-curated cinematic prompts and remix camera configurations.
          </p>
        </div>
        <PrototypeBadge variant="subtle" />
      </div>

      {/* Explore Content Placeholder */}
      <div className="p-8 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center mb-4 text-cine-amber shadow-amber-sm">
          <Compass className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Curated Cinematic Showcase</h2>
        <p className="text-sm text-text-muted max-w-md mt-2">
          Curated master prompt cards with instant "Remix in Studio" actions scheduled for Phase 6.
        </p>
      </div>
    </div>
  );
};
