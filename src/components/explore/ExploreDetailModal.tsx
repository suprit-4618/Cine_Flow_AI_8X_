import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Compass, 
  Camera, 
  Clock 
} from 'lucide-react';
import { ExploreItem } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';

interface ExploreDetailModalProps {
  item: ExploreItem | null;
  onClose: () => void;
  onRemixStudio: (item: ExploreItem) => void;
  onRemixStoryboard: (item: ExploreItem) => void;
}

export const ExploreDetailModal: React.FC<ExploreDetailModalProps> = ({
  item,
  onClose,
  onRemixStudio,
  onRemixStoryboard,
}) => {
  const [copied, setCopied] = React.useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      document.addEventListener('keydown', handleKeyDown);
      closeBtnRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const asset = SAMPLE_ASSETS.find(a => a.id === item.assetId) || SAMPLE_ASSETS[0];
  const style = STYLE_PRESETS.find(s => s.id === item.styleId);
  const camera = CAMERA_MOTIONS.find(c => c.value === item.cameraMotion);

  const handleCopyRecipe = () => {
    const recipe = `🎬 CineFlow AI Recipe:\nPrompt: "${item.prompt}"\nStyle: ${style?.name || 'Custom'}\nCamera: ${camera?.label || 'Static'}\nModel: ${item.modelId}\nAspect: ${item.aspectRatio} | Duration: ${item.durationSec}s`;
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (asset?.videoUrl) {
      const a = document.createElement('a');
      a.href = asset.videoUrl;
      a.download = `cineflow-${item.id}.mp4`;
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
      aria-labelledby="explore-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-obsidian/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-dark border border-cine-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-cine-border flex items-center justify-between gap-4 sticky top-0 bg-surface-dark/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cine-amber/20 border border-cine-amber/40 flex items-center justify-center text-cine-amber">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <h2 id="explore-modal-title" className="text-base sm:text-lg font-bold text-text-primary">
                {item.title}
              </h2>
              <span className="text-xs text-text-muted">
                Curated Community Showcase Prompt
              </span>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-text-muted hover:text-text-primary transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Media Player */}
          <div className="rounded-xl overflow-hidden border border-cine-border bg-surface-obsidian aspect-video w-full relative">
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
                alt={item.title}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Prompt Section */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Full Director Prompt
              </span>
              <p className="text-sm sm:text-base font-medium text-text-primary leading-relaxed bg-surface-raised/50 p-3.5 rounded-xl border border-cine-border mt-1.5">
                "{item.prompt}"
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Style Look</span>
                <p className="text-xs font-bold text-text-primary mt-0.5 truncate">
                  {style?.name || 'Custom'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Aspect Ratio</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">
                  {item.aspectRatio}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Camera Movement</span>
                <p className="text-xs font-bold text-cine-amber mt-0.5 truncate flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{camera?.label || 'Static'}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Duration</span>
                <p className="text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cine-amber" />
                  <span>{item.durationSec}s Shot</span>
                </p>
              </div>
            </div>

            {/* Tag Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-surface-raised border border-cine-border text-xs font-medium text-text-muted"
                >
                  #{tag}
                </span>
              ))}
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

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onRemixStoryboard(item);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary hover:text-cine-amber flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Layers className="w-3.5 h-3.5 text-cine-amber" />
              <span>Storyboard Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRemixStudio(item);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian text-xs font-bold flex items-center justify-center gap-1.5 shadow-amber-sm transition-transform hover:scale-[1.02] min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remix in Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
