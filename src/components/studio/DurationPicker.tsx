import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Clock } from 'lucide-react';

const DURATION_OPTIONS = [
  { sec: 3, label: '3s Clip', costMultiplier: 0.8 },
  { sec: 5, label: '5s Standard', costMultiplier: 1.0 },
  { sec: 8, label: '8s Extended', costMultiplier: 1.5 },
];

export const DurationPicker: React.FC = () => {
  const { draft, updateDraft } = useStudio();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cine-amber" />
          <span>Duration</span>
        </label>
        <span className="text-[11px] text-text-dim">24 FPS</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DURATION_OPTIONS.map((opt) => {
          const isSelected = draft.durationSec === opt.sec;
          return (
            <button
              key={opt.sec}
              type="button"
              onClick={() => updateDraft({ durationSec: opt.sec })}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all min-h-[58px] ${
                isSelected
                  ? 'border-cine-amber bg-surface-raised text-cine-amber shadow-amber-sm'
                  : 'border-cine-border bg-surface-dark text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <span className="font-bold text-sm">{opt.sec}s</span>
              <span className="text-[10px] text-text-dim mt-0.5">{opt.label.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
