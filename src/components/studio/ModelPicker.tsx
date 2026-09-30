import React from 'react';
import { MOCK_MODELS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import { Cpu, Clock, Coins } from 'lucide-react';

export const ModelPicker: React.FC = () => {
  const { draft, updateDraft } = useStudio();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cine-amber" />
          <span>Diffusion Model Engine</span>
        </label>
        <span className="text-xs text-text-dim">4 Tier Engines</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {MOCK_MODELS.map((model) => {
          const isSelected = draft.modelId === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => updateDraft({ modelId: model.id })}
              className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 min-h-[90px] ${
                isSelected
                  ? 'border-cine-amber ring-1 ring-cine-amber bg-surface-raised shadow-amber-sm'
                  : 'border-cine-border bg-surface-dark hover:border-cine-border/80 hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-cine-amber' : 'text-text-primary'}`}>
                      {model.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cine-amber/15 text-cine-amber border border-cine-amber/30">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-text-dim border-t border-cine-border/40 pt-2 mt-auto">
                <span className="flex items-center gap-1 text-cine-amber">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{model.baseCost} Tokens</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{model.renderTimeSec}s Est.</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
