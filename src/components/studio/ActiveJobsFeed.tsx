import React from 'react';
import { ActiveJob } from '../../services/generationService';
import { useStudio } from '../../context/StudioContext';
import { X, RotateCcw, AlertTriangle, Clock } from 'lucide-react';
import { STYLE_PRESETS } from '../../data/presets';

interface ActiveJobsFeedProps {
  jobs: ActiveJob[];
}

export const ActiveJobsFeed: React.FC<ActiveJobsFeedProps> = ({ jobs }) => {
  const { cancelJob, retryJob } = useStudio();

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="space-y-3" role="region" aria-label="Active Generation Queue">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cine-amber animate-ping" />
          <span>Render Pipeline Active ({jobs.length})</span>
        </h3>
        <span className="text-xs text-text-dim">Rate-limited queue</span>
      </div>

      <div className="space-y-2.5">
        {jobs.map((job) => {
          const gen = job.generation;
          const isError = gen.status === 'failed';
          const style = STYLE_PRESETS.find(s => s.id === gen.styleId);
          const formattedElapsed = `${String(Math.floor(job.elapsedSec / 60)).padStart(2, '0')}:${String(
            job.elapsedSec % 60
          ).padStart(2, '0')}`;

          return (
            <div
              key={job.id}
              className={`p-4 rounded-xl border transition-all ${
                isError
                  ? 'border-status-danger/40 bg-status-danger/10'
                  : 'border-cine-amber/40 bg-surface-dark shadow-amber-sm'
              }`}
            >
              {/* Job Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isError
                          ? 'bg-status-danger text-white'
                          : 'bg-cine-amber text-obsidian'
                      }`}
                    >
                      {gen.stageText} {gen.status === 'rendering' ? `${gen.progress}%` : ''}
                    </span>
                    {style && (
                      <span className="text-[11px] text-text-muted">
                        {style.name} • {gen.aspectRatio} • {gen.durationSec}s
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-primary mt-1.5 truncate font-medium">
                    "{gen.prompt}"
                  </p>
                </div>

                {/* Actions: Cancel or Retry */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-mono text-text-dim flex items-center gap-1 mr-2">
                    <Clock className="w-3 h-3" />
                    <span>{formattedElapsed}</span>
                  </span>

                  {isError ? (
                    <button
                      type="button"
                      onClick={() => retryJob(gen)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cine-amber text-obsidian hover:bg-amber-400 transition-colors min-h-[36px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cancelJob(job.id)}
                      className="p-1.5 rounded-lg text-text-dim hover:text-text-primary hover:bg-surface-raised transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Cancel render"
                      aria-label="Cancel render"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar or Error Display */}
              {isError ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-status-danger">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{gen.errorMessage || 'Live generation request error occurred.'}</span>
                </div>
              ) : (
                <div className="mt-3 space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-cine-amber transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(5, gen.progress)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-dim font-mono">
                    <span>
                      {gen.status === 'queued' ? 'Awaiting turn in queue...' : 'Synthesizing live image...'}
                    </span>
                    <span>{gen.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
