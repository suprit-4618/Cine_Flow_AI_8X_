import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Camera, 
  Clock, 
  Play
} from 'lucide-react';
import { ExploreItem } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';

interface ExploreCardProps {
  item: ExploreItem;
  onSelect: (item: ExploreItem) => void;
  onRemixStudio: (item: ExploreItem) => void;
  onRemixStoryboard: (item: ExploreItem) => void;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({
  item,
  onSelect,
  onRemixStudio,
  onRemixStoryboard,
}) => {
  const [copied, setCopied] = useState(false);

  const asset = SAMPLE_ASSETS.find(a => a.id === item.assetId) || SAMPLE_ASSETS[0];
  const style = STYLE_PRESETS.find(s => s.id === item.styleId);
  const camera = CAMERA_MOTIONS.find(c => c.value === item.cameraMotion);

  const handleCopyRecipe = (e: React.MouseEvent) => {
    e.stopPropagation();
    const recipe = `🎬 CineFlow AI Recipe:\nPrompt: "${item.prompt}"\nStyle: ${style?.name || 'Custom'}\nCamera: ${camera?.label || 'Static'}\nModel: ${item.modelId}\nAspect: ${item.aspectRatio} | Duration: ${item.durationSec}s`;
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl bg-surface-dark border border-cine-border hover:border-cine-amber/60 transition-all duration-300 overflow-hidden shadow-lg flex flex-col justify-between group hover:shadow-amber-sm"
    >
      {/* Media Thumbnail Viewport */}
      <div 
        onClick={() => onSelect(item)}
        className="w-full relative bg-surface-obsidian aspect-video overflow-hidden cursor-pointer"
      >
        <img
          src={asset.posterUrl || asset.svgFallback}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ objectFit: 'cover' }}
        />

        {/* Play Overlay Indicator */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-surface-obsidian/80 backdrop-blur border border-cine-border/80 flex items-center justify-center text-cine-amber shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          {style && (
            <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[10px] font-bold text-cine-amber">
              {style.name}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-md bg-surface-obsidian/80 backdrop-blur border border-cine-border text-[10px] text-text-muted">
            {item.aspectRatio}
          </span>
        </div>

        {/* Camera Pill Overlay */}
        {camera && (
          <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[10px] font-mono text-cine-amber flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{camera.label}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title & Duration */}
          <div className="flex items-center justify-between gap-2">
            <h3 
              onClick={() => onSelect(item)}
              className="text-sm font-bold text-text-primary group-hover:text-cine-amber transition-colors line-clamp-1 cursor-pointer"
            >
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted shrink-0">
              <Clock className="w-3 h-3 text-cine-amber" />
              <span>{item.durationSec}s</span>
            </div>
          </div>

          {/* Prompt Snippet */}
          <p 
            onClick={() => onSelect(item)}
            className="text-xs text-text-secondary line-clamp-2 leading-relaxed cursor-pointer hover:text-text-primary transition-colors"
          >
            "{item.prompt}"
          </p>

          {/* Tag Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-surface-raised border border-cine-border/80 text-[10px] font-medium text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-3 border-t border-cine-border/70 flex items-center justify-between gap-2">
          {/* Copy Recipe Button */}
          <button
            type="button"
            onClick={handleCopyRecipe}
            className="p-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-text-muted hover:text-text-primary transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Copy prompt recipe to clipboard"
            aria-label="Copy Prompt Recipe"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cine-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRemixStoryboard(item)}
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-semibold text-text-primary hover:text-cine-amber transition-colors flex items-center gap-1.5 min-h-[38px]"
              title="Deconstruct into 3-Shot Storyboard"
            >
              <Layers className="w-3.5 h-3.5 text-cine-amber" />
              <span className="hidden sm:inline">Storyboard</span>
            </button>

            <button
              type="button"
              onClick={() => onRemixStudio(item)}
              className="px-3.5 py-1.5 rounded-xl bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5 shadow-amber-sm min-h-[38px]"
              title="Load parameters into Studio creator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
