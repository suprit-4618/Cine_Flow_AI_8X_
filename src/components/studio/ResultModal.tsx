import React, { useEffect, useRef, useState } from 'react';
import { SingleGeneration } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';
import { X, Copy, Check, Download, RotateCcw, Camera, Clock } from 'lucide-react';

interface ResultModalProps {
  generation: SingleGeneration | null;
  onClose: () => void;
  onReusePrompt: (gen: SingleGeneration) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  generation,
  onClose,
  onReusePrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (generation) {
      document.addEventListener('keydown', handleKeyDown);
      closeBtnRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [generation, onClose]);

  if (!generation) return null;

  const asset = SAMPLE_ASSETS.find(a => a.id === generation.resultAssetId) || SAMPLE_ASSETS[0];
  const style = STYLE_PRESETS.find(s => s.id === generation.styleId);
  const camera = CAMERA_MOTIONS.find(c => c.value === generation.cameraMotion);

  const handleCopyRecipe = () => {
    const recipe = `🎬 CineFlow AI Recipe:\nPrompt: "${generation.prompt}"\nStyle: ${style?.name || 'Custom'}\nCamera: ${camera?.label || 'Static'}\nModel: ${generation.modelId}\nAspect: ${generation.aspectRatio} | Duration: ${generation.durationSec}s`;
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (asset?.videoUrl) {
      const a = document.createElement('a');
      a.href = asset.videoUrl;
      a.download = `cineflow-${generation.id}.mp4`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-obsidian/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-dark border border-cine-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-cine-border flex items-center justify-between gap-4 sticky top-0 bg-surface-dark/95 backdrop-blur z-20">
          <div>
            <h2 id="result-modal-title" className="text-base sm:text-lg font-bold text-text-primary">
              Generated Video
            </h2>
            <span className="text-xs text-text-muted">
              {style?.name || 'Custom'} • {generation.durationSec}s • {generation.aspectRatio}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Media Player */}
          <div className="rounded-2xl overflow-hidden border border-cine-border bg-surface-obsidian aspect-video w-full relative">
            {asset.videoUrl ? (
              <video
                src={asset.videoUrl}
                poster={asset.posterUrl || asset.svgFallback}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <img
                src={asset.posterUrl || asset.svgFallback}
                alt={generation.prompt}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Prompt Section */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Prompt
              </span>
              <p className="text-sm sm:text-base font-medium text-text-primary leading-relaxed bg-surface-raised/50 p-4 rounded-2xl border border-cine-border mt-1.5">
                "{generation.prompt}"
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Look</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">{style?.name || 'Custom'}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Aspect Ratio</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">{generation.aspectRatio}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Camera</span>
                <p className="text-xs font-bold text-accent mt-0.5 flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{camera?.label || 'Static'}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Duration</span>
                <p className="text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" />
                  <span>{generation.durationSec}s</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-cine-border bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyRecipe}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cine-emerald" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
              <span>{copied ? 'Copied Recipe!' : 'Copy Recipe'}</span>
            </button>

            {asset.videoUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                <span>Download</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onReusePrompt(generation);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02] min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reuse in Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
