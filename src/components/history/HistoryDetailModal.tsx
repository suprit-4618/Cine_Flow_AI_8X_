import React, { useEffect, useRef } from 'react';
import { 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Star, 
  Film, 
  Layers 
} from 'lucide-react';
import { SingleGeneration, Storyboard } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';
import { SequencePlayer } from '../storyboard/SequencePlayer';

interface HistoryDetailModalProps {
  item: SingleGeneration | Storyboard | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (item: SingleGeneration | Storyboard) => void;
  onReusePrompt: (item: SingleGeneration | Storyboard) => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
  onReusePrompt,
}) => {
  const [copied, setCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Accessible Esc key listener & focus trapping
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

  const isStoryboard = 'shots' in item;

  // Single Generation details
  const singleGen = !isStoryboard ? (item as SingleGeneration) : null;
  const singleAsset = singleGen 
    ? (SAMPLE_ASSETS.find(a => a.id === singleGen.resultAssetId) || SAMPLE_ASSETS[0])
    : null;
  const singleStyle = singleGen 
    ? STYLE_PRESETS.find(s => s.id === singleGen.styleId)
    : null;
  const singleCamera = singleGen 
    ? CAMERA_MOTIONS.find(c => c.value === singleGen.cameraMotion)
    : null;

  // Storyboard details
  const storyboard = isStoryboard ? (item as Storyboard) : null;
  const sbStyle = storyboard 
    ? (STYLE_PRESETS.find(s => s.id === storyboard.stylePresetId) || STYLE_PRESETS[0])
    : null;

  const handleCopyRecipe = () => {
    if (singleGen) {
      const recipe = `🎬 CineFlow AI Recipe:\nPrompt: "${singleGen.prompt}"\nStyle: ${singleStyle?.name || 'Custom'}\nCamera: ${singleCamera?.label || 'Static'}\nAspect: ${singleGen.aspectRatio} | Duration: ${singleGen.durationSec}s`;
      navigator.clipboard.writeText(recipe);
    } else if (storyboard) {
      let sbRecipe = `🎬 CineFlow 3-Shot Storyboard Recipe:\nIdea: "${storyboard.masterIdea}"\nStyle: ${sbStyle?.name}\n\n`;
      storyboard.shots.forEach((s, idx) => {
        sbRecipe += `[Shot ${idx + 1}: ${s.shotType}] Camera: ${s.cameraMotion} | Duration: ${s.durationSec}s\nPrompt: ${s.prompt}\n\n`;
      });
      navigator.clipboard.writeText(sbRecipe);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (singleAsset?.videoUrl) {
      const a = document.createElement('a');
      a.href = singleAsset.videoUrl;
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
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-obsidian/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-surface-dark border border-cine-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-cine-border flex items-center justify-between gap-4 sticky top-0 bg-surface-dark/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cine-amber/20 border border-cine-amber/40 flex items-center justify-center text-cine-amber">
              {isStoryboard ? <Layers className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            </span>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-text-primary">
                {isStoryboard ? '3-Shot Storyboard Detail' : 'Single Shot Detail'}
              </h2>
              <span className="text-xs text-text-muted">
                Created {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-xl border transition-colors ${
                item.isFavorite
                  ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                  : 'bg-surface-raised border-cine-border text-text-muted hover:text-text-primary'
              }`}
              title={item.isFavorite ? 'Remove favorite' : 'Add favorite'}
              aria-label="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-cine-amber text-cine-amber' : ''}`} />
            </button>

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
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Media Viewport */}
          {isStoryboard && storyboard && sbStyle ? (
            <div className="rounded-xl overflow-hidden border border-cine-border bg-surface-obsidian">
              <SequencePlayer
                shots={storyboard.shots}
                masterIdea={storyboard.masterIdea}
                stylePreset={sbStyle}
                aspectRatio={storyboard.aspectRatio}
              />
            </div>
          ) : singleGen && singleAsset ? (
            <div className="rounded-xl overflow-hidden border border-cine-border bg-surface-obsidian aspect-video w-full relative">
              {singleAsset.videoUrl ? (
                <video
                  src={singleAsset.videoUrl}
                  poster={singleAsset.posterUrl || singleAsset.svgFallback}
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
                  src={singleAsset.posterUrl || singleAsset.svgFallback}
                  alt={singleAsset.title}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          ) : null}

          {/* Prompt & Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {isStoryboard ? 'Master Storyboard Premise' : 'Generation Prompt'}
              </span>
              <p className="text-sm sm:text-base font-medium text-text-primary leading-relaxed bg-surface-raised/50 p-3.5 rounded-xl border border-cine-border mt-1.5">
                "{isStoryboard ? storyboard?.masterIdea : singleGen?.prompt}"
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Style Look</span>
                <p className="text-xs font-bold text-text-primary mt-0.5 truncate">
                  {isStoryboard ? sbStyle?.name : singleStyle?.name}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Aspect Ratio</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">
                  {item.aspectRatio}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Camera Setup</span>
                <p className="text-xs font-bold text-cine-amber mt-0.5 truncate">
                  {isStoryboard ? '3-Angle Dynamic' : singleCamera?.label || 'Static'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-cine-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Duration</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">
                  {isStoryboard ? `${storyboard?.shots.reduce((acc, s) => acc + (s.durationSec || 5), 0)}s Reel` : `${singleGen?.durationSec}s Master`}
                </p>
              </div>
            </div>

            {/* Storyboard Shots Breakdown */}
            {isStoryboard && storyboard && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Shot Breakdown ({storyboard.shots.length} Angles)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {storyboard.shots.map((shot, idx) => (
                    <div key={shot.id} className="p-3 rounded-xl bg-surface-raised border border-cine-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cine-amber">Shot {idx + 1}: {shot.shotType.split(' ')[0]}</span>
                        <span className="text-[10px] font-mono text-text-muted">{shot.cameraMotion}</span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        "{shot.prompt}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-cine-border bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={() => {
              onDelete(item);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-cine-rose/30 hover:border-cine-rose bg-cine-rose/10 text-cine-rose text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Creation</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyRecipe}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cine-emerald" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
              <span>{copied ? 'Copied!' : 'Copy Recipe'}</span>
            </button>

            {singleAsset?.videoUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-text-primary flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                <span>Download</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onReusePrompt(item);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian text-xs font-bold flex items-center justify-center gap-1.5 shadow-amber-sm transition-transform hover:scale-[1.02]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isStoryboard ? 'Remix in Storyboard' : 'Reuse in Studio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
