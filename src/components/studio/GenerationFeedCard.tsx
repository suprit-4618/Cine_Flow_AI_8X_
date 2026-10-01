import React from 'react';
import { SingleGeneration } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';
import { RotateCcw, X, AlertCircle } from 'lucide-react';

interface GenerationFeedCardProps {
  generation: SingleGeneration;
  elapsedSec?: number;
  onCancel?: () => void;
  onRetry?: (gen: SingleGeneration) => void;
  onSelectResult?: (gen: SingleGeneration) => void;
}

export const GenerationFeedCard: React.FC<GenerationFeedCardProps> = ({
  generation,
  elapsedSec = 0,
  onCancel,
  onRetry,
  onSelectResult,
}) => {
  const asset = SAMPLE_ASSETS.find(a => a.id === generation.resultAssetId) || SAMPLE_ASSETS[0];
  const style = STYLE_PRESETS.find(s => s.id === generation.styleId);
  const camera = CAMERA_MOTIONS.find(c => c.value === generation.cameraMotion);

  const isRendering = generation.status === 'queued' || generation.status === 'rendering';
  const isFailed = generation.status === 'failed';
  const isDone = generation.status === 'done';

  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border overflow-hidden shadow-xl flex flex-col justify-between animate-fadeIn">
      {/* Media Viewport or Render Skeleton */}
      <div 
        onClick={() => isDone && onSelectResult?.(generation)}
        className={`relative aspect-video w-full bg-surface-obsidian overflow-hidden ${isDone ? 'cursor-pointer' : ''}`}
      >
        {isDone && asset ? (
          <img
            src={asset.posterUrl || asset.svgFallback}
            alt={generation.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 relative">
            {/* Animated Skeleton Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-raised to-surface-dark animate-pulse opacity-60" />

            {isFailed ? (
              <div className="relative z-10 space-y-2">
                <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-red-400 max-w-[200px]">
                  {generation.errorMessage || 'Generation interrupted'}
                </p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={() => onRetry(generation)}
                    className="px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary flex items-center gap-1.5 mx-auto transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-accent" />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="relative z-10 w-full max-w-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    <span className="text-text-primary font-semibold">{generation.stageText || 'Rendering'}</span>
                  </span>
                  <span className="font-mono">{elapsedSec}s</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden border border-cine-border/80">
                  <div
                    className="h-full bg-accent transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(8, generation.progress)}%` }}
                  />
                </div>

                {onCancel && isRendering && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-[11px] text-text-muted hover:text-text-primary pt-1 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {isDone ? (
            <span className="px-2.5 py-1 rounded-lg bg-surface-obsidian/90 backdrop-blur border border-cine-border text-xs font-semibold text-accent">
              Ready
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[11px] font-semibold text-text-muted">
              {generation.stageText}
            </span>
          )}
          {style && (
            <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/85 backdrop-blur border border-cine-border text-[11px] text-text-muted">
              {style.name}
            </span>
          )}
        </div>

        {/* Camera Pill Overlay */}
        {camera && isDone && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[10px] font-mono text-accent">
              {camera.label}
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-1">
        <p className="text-sm font-medium text-text-primary line-clamp-2 leading-relaxed">
          "{generation.prompt}"
        </p>
      </div>
    </div>
  );
};
