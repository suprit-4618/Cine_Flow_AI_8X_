import React from 'react';
import { Clapperboard, Loader2, Coins } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { MOCK_MODELS } from '../../data/presets';
import { PrototypeBadge } from '../common/PrototypeBadge';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isGenerating, disabled }) => {
  const { draft } = useStudio();
  const selectedModel = MOCK_MODELS.find(m => m.id === draft.modelId) || MOCK_MODELS[0];
  
  // Calculate dynamic token cost based on duration multiplier
  const durationFactor = draft.durationSec === 3 ? 0.8 : draft.durationSec === 8 ? 1.5 : 1.0;
  const calculatedCost = Math.round(selectedModel.baseCost * durationFactor);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-dark border border-cine-border shadow-lg">
      
      {/* Honest Prototype Disclaimer placed right next to generate trigger */}
      <div className="flex items-center gap-2">
        <PrototypeBadge variant="prominent" />
      </div>

      {/* Main Generate Trigger CTA */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end text-xs">
          <span className="font-semibold text-text-primary flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-cine-amber" />
            <span>{calculatedCost} Compute Tokens</span>
          </span>
          <span className="text-text-dim text-[11px]">Est. ~{selectedModel.renderTimeSec}s</span>
        </div>

        <button
          type="button"
          onClick={onClick}
          disabled={disabled || isGenerating}
          className="relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-cine-amber hover:bg-amber-400 active:bg-amber-500 text-obsidian shadow-amber-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-95 min-h-[48px] w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 text-obsidian animate-spin" />
              <span>Synthesizing Scene...</span>
            </>
          ) : (
            <>
              <Clapperboard className="w-4 h-4 text-obsidian" />
              <span>Generate</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-obsidian/20 text-obsidian font-semibold">
                {calculatedCost}T
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
