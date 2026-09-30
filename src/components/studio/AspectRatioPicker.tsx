import React from 'react';
import { ASPECT_RATIOS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import { AspectRatio } from '../../types';
import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';

export const AspectRatioPicker: React.FC = () => {
  const { draft, updateDraft } = useStudio();

  const getIcon = (ratio: AspectRatio) => {
    switch (ratio) {
      case '16:9':
        return <RectangleHorizontal className="w-4 h-4" />;
      case '9:16':
        return <RectangleVertical className="w-4 h-4" />;
      case '1:1':
        return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ASPECT_RATIOS.map((item) => {
          const isSelected = draft.aspectRatio === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => updateDraft({ aspectRatio: item.value })}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all min-h-[58px] ${
                isSelected
                  ? 'border-cine-amber bg-surface-raised text-cine-amber shadow-amber-sm'
                  : 'border-cine-border bg-surface-dark text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <span className={`mb-1 ${isSelected ? 'text-cine-amber' : 'text-text-dim'}`}>
                {getIcon(item.value)}
              </span>
              <span className="font-semibold">{item.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
