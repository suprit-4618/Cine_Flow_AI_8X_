import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface PrototypeBadgeProps {
  variant?: 'subtle' | 'prominent' | 'compact';
  className?: string;
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({ variant = 'subtle', className = '' }) => {
  if (variant === 'prominent') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-cine-amber/30 text-xs font-medium text-cine-amber shadow-amber-sm ${className}`} role="status">
        <Sparkles className="w-3.5 h-3.5 text-cine-amber animate-pulse-subtle" />
        <span>Live AI Image Generation</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-dark/90 border border-cine-border text-[11px] font-medium text-text-muted ${className}`} role="status">
        <Info className="w-3 h-3 text-cine-amber" />
        <span>Live Image Render</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-raised/80 border border-cine-border text-xs text-text-muted hover:border-cine-amber/40 transition-colors ${className}`} role="status">
      <span className="w-2 h-2 rounded-full bg-cine-amber animate-ping" />
      <span className="text-text-muted">Generation mode: <strong className="text-text-primary font-medium">live AI images</strong></span>
    </div>
  );
};
