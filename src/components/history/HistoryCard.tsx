import React, { useState } from 'react';
import { 
  Star, 
  Trash2, 
  RotateCcw, 
  Layers, 
  Film, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { SingleGeneration, Storyboard } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS } from '../../data/presets';
import { getAssetForShot } from '../../utils/storyboardHelper';

interface HistoryCardProps {
  item: SingleGeneration | Storyboard;
  onSelect: (item: SingleGeneration | Storyboard) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (item: SingleGeneration | Storyboard) => void;
  onReusePrompt: (item: SingleGeneration | Storyboard) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onSelect,
  onToggleFavorite,
  onDelete,
  onReusePrompt,
}) => {
  const [imageError, setImageError] = useState(false);
  const isStoryboard = 'shots' in item;

  // Single Generation
  const singleGen = !isStoryboard ? (item as SingleGeneration) : null;
  const singleAsset = singleGen 
    ? (SAMPLE_ASSETS.find(a => a.id === singleGen.resultAssetId) || SAMPLE_ASSETS[0])
    : null;
  const singleStyle = singleGen 
    ? STYLE_PRESETS.find(s => s.id === singleGen.styleId)
    : null;

  // Storyboard
  const storyboard = isStoryboard ? (item as Storyboard) : null;
  const sbStyle = storyboard 
    ? (STYLE_PRESETS.find(s => s.id === storyboard.stylePresetId) || STYLE_PRESETS[0])
    : null;
  const firstShot = storyboard?.shots[0];
  const firstShotAsset = firstShot 
    ? getAssetForShot(firstShot, storyboard.genre)
    : SAMPLE_ASSETS[0];

  const aspectClass = 
    item.aspectRatio === '9:16' ? 'aspect-[9/16]' :
    item.aspectRatio === '1:1' ? 'aspect-square' :
    'aspect-video';

  const singleImageSrc = (!imageError && singleGen?.imageUrl)
    ? singleGen.imageUrl
    : (singleAsset?.posterUrl || singleAsset?.svgFallback);

  const storyboardFirstImageSrc = (!imageError && firstShot?.imageUrl)
    ? firstShot.imageUrl
    : (firstShotAsset.posterUrl || firstShotAsset.svgFallback);

  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border hover:border-cine-amber/50 transition-all duration-300 overflow-hidden shadow-lg flex flex-col justify-between group hover:shadow-amber-sm">
      {/* Media Thumbnail Viewport */}
      <div 
        onClick={() => onSelect(item)}
        className={`w-full relative bg-surface-obsidian overflow-hidden cursor-pointer ${aspectClass}`}
      >
        {isStoryboard && storyboard ? (
          <div className="w-full h-full relative">
            <img
              src={storyboardFirstImageSrc}
              alt={storyboard.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectFit: 'cover' }}
            />
            {/* Storyboard 3-Shots Strip Preview */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-surface-obsidian via-surface-obsidian/70 to-transparent flex items-center gap-1.5">
              {storyboard.shots.map((shot, idx) => {
                const a = getAssetForShot(shot, storyboard.genre);
                const shotSrc = shot.imageUrl || a.posterUrl || a.svgFallback;
                return (
                  <div key={shot.id} className="flex-1 h-8 rounded-md overflow-hidden border border-white/20 relative">
                    <img 
                      src={shotSrc} 
                      alt={`Shot ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-white bg-black/60 px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : singleGen ? (
          <div className="w-full h-full relative">
            <img
              src={singleImageSrc}
              alt={singleGen.prompt}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : null}

        {/* Type Badge & Ratio Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/85 backdrop-blur-md border border-cine-border text-[10px] font-bold text-cine-amber flex items-center gap-1">
            {isStoryboard ? <Layers className="w-3 h-3" /> : <Film className="w-3 h-3" />}
            <span>{isStoryboard ? '3-Shot Storyboard' : 'Single Shot'}</span>
          </span>
          {singleGen?.isFallback && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-950/90 border border-cine-amber/60 text-[9px] font-bold text-cine-amber flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>Sample</span>
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-md bg-surface-obsidian/80 backdrop-blur-md border border-cine-border text-[10px] text-text-muted">
            {item.aspectRatio}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all border ${
            item.isFavorite
              ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
              : 'bg-surface-obsidian/75 border-cine-border text-text-muted hover:text-text-primary'
          }`}
          title={item.isFavorite ? 'Favorited' : 'Add to favorites'}
        >
          <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-cine-amber text-cine-amber' : ''}`} />
        </button>
      </div>

      {/* Card Body & Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Style & Camera Pills */}
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span className="font-semibold text-text-secondary truncate max-w-[140px]">
              {isStoryboard ? sbStyle?.name : singleStyle?.name || 'Custom'}
            </span>
            <div className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-cine-amber" />
              <span>{isStoryboard ? `${storyboard?.shots.reduce((a, s) => a + (s.durationSec || 5), 0)}s` : `${singleGen?.durationSec}s`}</span>
            </div>
          </div>

          {/* Prompt Snippet */}
          <p 
            onClick={() => onSelect(item)}
            className="text-xs text-text-primary line-clamp-2 leading-relaxed cursor-pointer hover:text-cine-amber transition-colors"
          >
            "{isStoryboard ? storyboard?.masterIdea : singleGen?.prompt}"
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-cine-border/60 flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-muted font-mono">
            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Reuse Prompt */}
            <button
              type="button"
              onClick={() => onReusePrompt(item)}
              className="p-1.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-cine-border text-text-muted hover:text-cine-amber transition-colors"
              title="Reuse prompt in creator"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Delete with Undo */}
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-lg bg-surface-raised hover:bg-cine-rose/20 border border-cine-border hover:border-cine-rose/40 text-text-muted hover:text-cine-rose transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
