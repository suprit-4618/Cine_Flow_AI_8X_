import React from 'react';
import { STYLE_PRESETS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import { Check } from 'lucide-react';

export const StyleSelector: React.FC = () => {
  const { draft, updateDraft } = useStudio();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <span>Start from a look</span>
          <span className="text-xs text-text-dim font-normal">({STYLE_PRESETS.length} looks)</span>
        </label>
        <span className="text-xs text-text-dim">Sets style words & aesthetic mood</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = draft.styleId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateDraft({ styleId: preset.id })}
              className={`group relative p-3 rounded-xl text-left transition-all min-h-[72px] flex flex-col justify-between overflow-hidden border ${
                isSelected
                  ? 'border-cine-amber ring-1 ring-cine-amber bg-surface-raised shadow-amber-sm'
                  : 'border-cine-border bg-surface-dark hover:border-cine-border/80 hover:bg-surface-hover'
              }`}
            >
              {/* Subtle Gradient Backing */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${preset.gradientBg} opacity-40 group-hover:opacity-60 transition-opacity`}
              />

              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-surface-dark/90 text-text-muted border border-cine-border/60">
                  {preset.tag}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-cine-amber text-obsidian flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="relative z-10 mt-2">
                <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-cine-amber' : 'text-text-primary'}`}>
                  {preset.name}
                </h4>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
