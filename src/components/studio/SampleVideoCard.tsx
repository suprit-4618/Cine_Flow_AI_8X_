import React, { useState, useEffect, useRef } from 'react';
import { MediaAsset } from '../../types';
import { STYLE_PRESETS } from '../../data/presets';
import { Play } from 'lucide-react';

interface SampleVideoCardProps {
  asset: MediaAsset;
  onSelectPrompt: (prompt: string, styleId: string) => void;
}

export const SampleVideoCard: React.FC<SampleVideoCardProps> = ({
  asset,
  onSelectPrompt,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const style = STYLE_PRESETS.find(s => s.genre === asset.genre) || STYLE_PRESETS[0];

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver for viewport-based playback
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      {
        threshold: [0, 0.5, 1.0],
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const shouldPlay = (isIntersecting || isHovered) && !prefersReducedMotion && !hasVideoError;

  useEffect(() => {
    if (!videoRef.current) return;
    if (shouldPlay) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy until user gesture
      });
    } else {
      videoRef.current.pause();
    }
  }, [shouldPlay]);

  const promptText = `${asset.title}, ${style.promptSuffix}`;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectPrompt(promptText, style.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectPrompt(promptText, style.id);
        }
      }}
      className="group relative rounded-2xl bg-surface-dark border border-cine-border hover:border-accent transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Use sample look: ${asset.title} (${style.name})`}
    >
      {/* Media Viewport */}
      <div className="relative aspect-video w-full bg-surface-obsidian overflow-hidden">
        {asset.videoUrl && !hasVideoError && !prefersReducedMotion ? (
          <video
            ref={videoRef}
            src={asset.videoUrl}
            poster={asset.posterUrl || asset.svgFallback}
            muted
            loop
            playsInline
            preload="none"
            onError={() => setHasVideoError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img
            src={asset.posterUrl || asset.svgFallback}
            alt={asset.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: 'cover' }}
          />
        )}

        {/* Play indicator when paused */}
        {!shouldPlay && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none group-hover:bg-black/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-obsidian/85 backdrop-blur border border-cine-border flex items-center justify-center text-text-primary group-hover:text-accent group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Style Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-surface-obsidian/90 backdrop-blur border border-cine-border text-xs font-semibold text-text-primary">
            {style.name}
          </span>
        </div>

        {/* Shot Type Badge */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/85 backdrop-blur border border-cine-border text-[11px] font-medium text-text-muted capitalize">
            {asset.shotType}
          </span>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {asset.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
          "{promptText}"
        </p>
      </div>
    </div>
  );
};
