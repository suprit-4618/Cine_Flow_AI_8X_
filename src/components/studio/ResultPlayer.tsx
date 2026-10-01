import React, { useState, useEffect } from 'react';
import { SingleGeneration } from '../../types';
import { SAMPLE_ASSETS } from '../../data/assets';
import { STYLE_PRESETS, CAMERA_MOTIONS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import {
  Download,
  RotateCcw,
  Sparkles,
  Star,
  Copy,
  Check,
  Camera,
  AlertCircle,
  Hash,
} from 'lucide-react';

interface ResultPlayerProps {
  generation: SingleGeneration;
}

export const ResultPlayer: React.FC<ResultPlayerProps> = ({ generation }) => {
  const { reusePrompt, makeVariations, toggleFavorite } = useStudio();
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check user preference for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const asset =
    SAMPLE_ASSETS.find(a => a.id === generation.resultAssetId) || SAMPLE_ASSETS[0];
  const style = STYLE_PRESETS.find(s => s.id === generation.styleId);
  const camera = CAMERA_MOTIONS.find(c => c.value === generation.cameraMotion);

  const getCameraAnimationClass = () => {
    if (prefersReducedMotion) return '';
    switch (generation.cameraMotion) {
      case 'pan_right': return 'animate-camera-pan';
      case 'tilt_up': return 'animate-camera-tilt';
      case 'orbit_cw': return 'animate-camera-orbit';
      case 'dolly_in': return 'animate-camera-dolly';
      case 'zoom_in': return 'animate-camera-zoom';
      case 'handheld': return 'animate-camera-handheld';
      default: return '';
    }
  };

  // Reset image error state on generation change
  useEffect(() => {
    setImageError(false);
  }, [generation.id]);

  const handleCopyRecipe = () => {
    const recipe = `🎬 CineFlow AI Recipe:\nPrompt: "${generation.prompt}"\nStyle: ${style?.name || 'Default'}\nModel: ${generation.modelId}\nAspect Ratio: ${generation.aspectRatio}\nCamera: ${camera?.label || 'Static'}\nSeed: ${generation.seed || 'random'}\nDuration: ${generation.durationSec}s`;
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const downloadUrl = (!imageError && generation.imageUrl) 
      ? generation.imageUrl 
      : (asset.posterUrl || asset.svgFallback);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `cineflow-${generation.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAspectRatioClass = () => {
    switch (generation.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-sm mx-auto';
      case '1:1':
        return 'aspect-square max-w-md mx-auto';
      default:
        return 'aspect-video w-full';
    }
  };

  const displayImageSrc = (!imageError && generation.imageUrl)
    ? generation.imageUrl
    : (asset.posterUrl || asset.svgFallback);

  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border overflow-hidden shadow-xl animate-fadeIn">
      {/* Media Viewport: Generated Still with Looping CSS Camera Motion */}
      <div className={`relative bg-surface-obsidian overflow-hidden ${getAspectRatioClass()}`}>
        <div className="w-full h-full overflow-hidden flex items-center justify-center relative">
          <img
            src={displayImageSrc}
            alt={generation.prompt}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ${getCameraAnimationClass()}`}
            style={{ 
              objectFit: 'cover',
              animationDuration: `${generation.durationSec || 5}s`
            }}
          />
        </div>

        {/* Video / Still Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
          {generation.isFallback ? (
            <span className="px-2.5 py-1 rounded-md bg-amber-950/90 backdrop-blur border border-cine-amber/60 text-[11px] font-bold text-cine-amber flex items-center gap-1 shadow-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sample shown: live generation unavailable</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[11px] font-bold text-cine-amber shadow-lg">
              Image with camera motion
            </span>
          )}

          <span className="px-2 py-1 rounded-md bg-surface-obsidian/85 backdrop-blur border border-cine-border text-[11px] font-medium text-text-muted">
            {generation.aspectRatio}
          </span>

          {camera && camera.value !== 'static' && (
            <span className="px-2 py-1 rounded-md bg-surface-obsidian/85 backdrop-blur border border-cine-border text-[11px] font-mono text-cine-amber flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{camera.label}</span>
            </span>
          )}
        </div>

        {/* Favorite Quick Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(generation.id)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur transition-all min-h-[38px] min-w-[38px] flex items-center justify-center border ${
            generation.isFavorite
              ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
              : 'bg-surface-obsidian/70 border-cine-border text-text-muted hover:text-text-primary'
          }`}
          title={generation.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Toggle Favorite"
        >
          <Star className={`w-4 h-4 ${generation.isFavorite ? 'fill-cine-amber text-cine-amber' : ''}`} />
        </button>
      </div>

      {/* Details & Actions Footer */}
      <div className="p-5 space-y-4">
        {/* Prompt Header */}
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-text-muted mb-1 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="text-text-dim">ID: {generation.id.substring(0, 10)}</span>
              {generation.seed !== undefined && (
                <span className="text-cine-amber flex items-center gap-0.5">
                  <Hash className="w-3 h-3" />
                  <span>{generation.seed}</span>
                </span>
              )}
            </span>
            <span>{new Date(generation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="text-sm font-medium text-text-primary leading-relaxed">
            "{generation.prompt}"
          </p>
        </div>

        {/* Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted pt-2 border-t border-cine-border/50">
          {style && (
            <span className="px-2.5 py-1 rounded-lg bg-surface-raised border border-cine-border text-text-primary font-medium">
              Style: {style.name}
            </span>
          )}
          {camera && (
            <span className="px-2.5 py-1 rounded-lg bg-surface-raised border border-cine-border text-text-primary font-medium flex items-center gap-1">
              <Camera className="w-3 h-3 text-cine-amber" />
              <span>{camera.label}</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-surface-raised border border-cine-border text-text-muted">
            {generation.durationSec}s Motion Loop
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-raised border border-cine-border text-text-muted font-mono">
            {generation.modelId}
          </span>
        </div>

        {/* Action Button Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cine-border/50">
          {/* Reuse Prompt */}
          <button
            type="button"
            onClick={() => reusePrompt(generation)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border text-xs font-semibold text-text-primary transition-colors min-h-[44px]"
            title="Load this prompt and settings back into the studio editor"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cine-amber" />
            <span>Reuse Prompt</span>
          </button>

          {/* Make Variations */}
          <button
            type="button"
            onClick={() => makeVariations(generation)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border text-xs font-semibold text-text-primary transition-colors min-h-[44px]"
            title="Create variations with new camera angles"
          >
            <Sparkles className="w-3.5 h-3.5 text-cine-amber" />
            <span>Variations</span>
          </button>

          {/* Copy Prompt Recipe */}
          <button
            type="button"
            onClick={handleCopyRecipe}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border text-xs font-semibold text-text-primary transition-colors min-h-[44px]"
            title="Copy prompt recipe parameters to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cine-emerald" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            <span>{copied ? 'Copied!' : 'Copy Recipe'}</span>
          </button>

          {/* Download Generated Image */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border text-xs font-semibold text-text-primary transition-colors min-h-[44px]"
            title="Download image still"
          >
            <Download className="w-3.5 h-3.5 text-text-muted" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
