import React, { useEffect, useState } from 'react';
import { Undo2, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  durationMs = 5000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onDismiss]);

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 animate-slideUp">
      <div className="bg-surface-obsidian/95 backdrop-blur-md border border-cine-amber/40 shadow-2xl rounded-2xl p-4 flex flex-col gap-2 min-w-[280px] sm:min-w-[340px] overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cine-amber animate-pulse" />
            <p className="text-xs font-semibold text-text-primary">{message}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onUndo}
              className="px-3 py-1.5 rounded-lg bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian text-xs font-bold flex items-center gap-1.5 transition-colors shadow-amber-sm"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss toast"
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress timer bar */}
        <div className="w-full h-1 bg-surface-raised rounded-full overflow-hidden">
          <div
            className="h-full bg-cine-amber transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
