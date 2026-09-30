import React from 'react';
import { Clapperboard, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cine-border bg-surface-dark/50 mt-16 pb-20 md:pb-8 text-xs text-text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-cine-amber" />
          <span className="font-semibold text-text-primary">CineFlow AI</span>
          <span className="text-text-dim">•</span>
          <span>Director-Grade Generative Studio</span>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="flex items-center gap-2 text-center text-text-muted">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          <span>Simulation Engine active. Free-license stock assets (Pexels, Pixabay, Mixkit).</span>
        </div>

        {/* Attribution / Credits info */}
        <div className="flex items-center gap-4 text-text-dim">
          <span>v1.0.0</span>
          <span>•</span>
          <span className="text-text-muted">Built for 8x Assignment</span>
        </div>
      </div>
    </footer>
  );
};
