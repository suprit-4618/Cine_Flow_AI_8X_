import React from 'react';
import { History } from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            My Creations
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Local library of generated shots, prompt history, favorites, and saved storyboards.
          </p>
        </div>
        <PrototypeBadge variant="subtle" />
      </div>

      {/* History Content Placeholder */}
      <div className="p-8 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center mb-4 text-cine-amber shadow-amber-sm">
          <History className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Local Creations Vault</h2>
        <p className="text-sm text-text-muted max-w-md mt-2">
          Persistent versioned localStorage vault, search, filter, favoriting, and studio prompt remixing ready for Phase 5.
        </p>
      </div>
    </div>
  );
};
