import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Maximize2, 
  Copy, 
  Check, 
  Film, 
  Layers 
} from 'lucide-react';
import { StoryboardShot, StylePreset, AspectRatio } from '../../types';
import { getAssetForShot, formatStoryboardRecipe } from '../../utils/storyboardHelper';

interface SequencePlayerProps {
  shots: StoryboardShot[];
  masterIdea: string;
  stylePreset: StylePreset;
  aspectRatio: AspectRatio;
  onClose?: () => void;
}

export const SequencePlayer: React.FC<SequencePlayerProps> = ({
  shots,
  masterIdea,
  stylePreset,
  aspectRatio,
}) => {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentShot = shots[activeShotIndex] || shots[0];
  const currentTargetDuration = currentShot?.durationSec || 5;
  const currentAsset = getAssetForShot(currentShot, stylePreset.genre);

  // Auto-advance logic
  const advanceToNextShot = () => {
    if (activeShotIndex < shots.length - 1) {
      setActiveShotIndex(prev => prev + 1);
      setCurrentTime(0);
    } else if (isLooping) {
      setActiveShotIndex(0);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handlePrevShot = () => {
    if (activeShotIndex > 0) {
      setActiveShotIndex(prev => prev - 1);
    } else {
      setActiveShotIndex(shots.length - 1);
    }
    setCurrentTime(0);
  };

  const handleNextShot = () => {
    advanceToNextShot();
  };

  // Video timeupdate tracking trimmed strictly to stated shot duration (Fix 3)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setCurrentTime(t);

      // If video playback reaches or exceeds shot's stated duration, cut immediately to next shot
      if (t >= currentTargetDuration) {
        advanceToNextShot();
      }
    }
  };

  // Video ended -> cut to next shot
  const handleVideoEnded = () => {
    advanceToNextShot();
  };

  // Reset video position and maintain play state when activeShotIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeShotIndex]);

  // Play/Pause toggle effect
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Fallback timer if video is not available
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && (!currentAsset.videoUrl || currentShot.status !== 'done')) {
      const tick = 100; // ms
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + tick / 1000;
          if (next >= currentTargetDuration) {
            advanceToNextShot();
            return 0;
          }
          return next;
        });
      }, tick);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeShotIndex, currentAsset.videoUrl, currentShot.status, currentTargetDuration]);

  const handleCopyRecipe = () => {
    const text = formatStoryboardRecipe(
      masterIdea,
      masterIdea,
      stylePreset.name,
      shots
    );
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2500);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Fix 5: Ensure 9:16 and 1:1 have strict aspect containers and object-fit: cover
  const aspectClass = 
    aspectRatio === '9:16' ? 'w-[280px] sm:w-[320px] aspect-[9/16]' :
    aspectRatio === '1:1' ? 'w-[320px] sm:w-[420px] aspect-square' :
    'w-full max-w-4xl aspect-video';

  return (
    <div className="rounded-2xl bg-surface-dark border border-cine-border overflow-hidden shadow-2xl space-y-0">
      {/* Theater Top Bar */}
      <div className="p-4 bg-surface-obsidian/90 border-b border-cine-border flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cine-amber/20 border border-cine-amber/40 flex items-center justify-center text-cine-amber">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Master Theater Sequence
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cine-amber/20 text-cine-amber border border-cine-amber/40">
                Continuous Reel
              </span>
            </div>
            <p className="text-xs text-text-muted truncate max-w-md">
              "{masterIdea || 'Cinematic 3-Shot Narrative'}" • {stylePreset.name} ({stylePreset.genre})
            </p>
          </div>
        </div>

        {/* Copy Recipe & Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyRecipe}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              copiedRecipe
                ? 'bg-cine-emerald/20 border-cine-emerald text-cine-emerald'
                : 'bg-surface-raised border-cine-border hover:border-cine-amber text-text-primary'
            }`}
          >
            {copiedRecipe ? (
              <>
                <Check className="w-3.5 h-3.5 text-cine-emerald" />
                <span>Recipe Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cine-amber" />
                <span>Copy Recipe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Theater Display Container with object-fit: cover */}
      <div 
        ref={containerRef}
        className="relative bg-surface-obsidian flex items-center justify-center p-3 sm:p-6 min-h-[340px] sm:min-h-[480px]"
      >
        <div className={`relative mx-auto rounded-xl overflow-hidden shadow-2xl border border-cine-border/60 ${aspectClass}`}>
          {currentShot.status === 'done' ? (
            <video
              key={`${currentShot.id}-${currentAsset.id}`}
              ref={videoRef}
              src={currentAsset.videoUrl}
              poster={currentAsset.posterUrl || currentAsset.svgFallback}
              autoPlay={isPlaying}
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-full relative">
              <img
                src={currentAsset.posterUrl || currentAsset.svgFallback}
                alt={currentShot.shotType}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-surface-obsidian/60 backdrop-blur-xs flex items-center justify-center">
                <span className="text-xs text-text-muted bg-surface-obsidian/80 px-3 py-1.5 rounded-lg border border-cine-border">
                  {currentShot.stageText || 'Rendering frame...'}
                </span>
              </div>
            </div>
          )}

          {/* Shot Watermark Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-surface-obsidian/85 backdrop-blur-md px-3 py-1 rounded-lg border border-cine-border text-xs text-text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-cine-amber animate-pulse" />
            <span>Shot {activeShotIndex + 1}/3: {currentShot.shotType}</span>
          </div>

          {/* Camera Motion Overlay */}
          <div className="absolute top-3 right-3 bg-surface-obsidian/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cine-border text-[11px] text-cine-amber font-mono">
            {currentShot.cameraMotion.replace('_', ' ').toUpperCase()}
          </div>

          {/* Prompt & Trimmed Duration Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-text-muted bg-surface-obsidian/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cine-border">
            <span className="truncate max-w-[70%]">"{currentShot.prompt}"</span>
            <span className="font-mono text-text-primary font-bold">
              {Math.min(currentTime, currentTargetDuration).toFixed(1)}s / {currentTargetDuration.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Sequence Timeline & Controls */}
      <div className="p-4 sm:p-5 bg-surface-raised/80 border-t border-cine-border space-y-4">
        {/* 3-Segment Timeline Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cine-amber" />
              Continuous 3-Shot Reel Progress (Trimmed to Shot Durations)
            </span>
            <span className="text-text-muted font-mono">
              Shot {activeShotIndex + 1} of {shots.length} ({currentTargetDuration}s target)
            </span>
          </div>

          {/* 3 Interactive Timeline Segments matched to shot durations */}
          <div className="grid grid-cols-3 gap-2">
            {shots.map((shot, idx) => {
              const isActive = idx === activeShotIndex;
              const isPast = idx < activeShotIndex;
              const duration = shot.durationSec || 5;
              const progressPercent = isActive 
                ? Math.min(100, (currentTime / duration) * 100)
                : isPast ? 100 : 0;

              return (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => {
                    setActiveShotIndex(idx);
                    setCurrentTime(0);
                  }}
                  className={`h-2.5 rounded-full bg-surface-dark border transition-all relative overflow-hidden group cursor-pointer ${
                    isActive ? 'border-cine-amber ring-1 ring-cine-amber/50' : 'border-cine-border'
                  }`}
                  title={`Jump to Shot ${idx + 1}: ${shot.shotType} (${duration}s)`}
                >
                  <div
                    className={`h-full transition-all duration-100 ${
                      isActive ? 'bg-cine-amber' : isPast ? 'bg-cine-amber/60' : 'bg-transparent'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </button>
              );
            })}
          </div>

          {/* Shot Navigation Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {shots.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => {
                  setActiveShotIndex(idx);
                  setCurrentTime(0);
                }}
                className={`py-1.5 px-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${
                  idx === activeShotIndex
                    ? 'bg-cine-amber/15 border-cine-amber text-text-primary font-bold'
                    : 'bg-surface-dark border-cine-border text-text-muted hover:text-text-primary'
                }`}
              >
                <span className="truncate">#{idx + 1} {shot.shotType.split(' ')[0]}</span>
                <span className="text-[10px] text-text-muted font-mono">{shot.durationSec || 5}s</span>
              </button>
            ))}
          </div>
        </div>

        {/* Master Playback Transport Controls (Mute button removed as per Fix 4) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Loop Sequence Toggle */}
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isLooping
                  ? 'bg-cine-amber/20 border-cine-amber text-cine-amber'
                  : 'bg-surface-dark border-cine-border text-text-muted hover:text-text-primary'
              }`}
              title={isLooping ? 'Loop Reel: ON' : 'Loop Reel: OFF'}
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Loop Reel</span>
            </button>
          </div>

          {/* Core Transport Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevShot}
              className="p-2.5 rounded-xl bg-surface-dark border border-cine-border hover:border-cine-amber text-text-primary hover:text-cine-amber transition-colors"
              aria-label="Previous Shot"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-2xl bg-cine-amber hover:bg-cine-amber-hover text-surface-obsidian flex items-center justify-center shadow-amber-md transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause Sequence' : 'Play Sequence'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNextShot}
              className="p-2.5 rounded-xl bg-surface-dark border border-cine-border hover:border-cine-amber text-text-primary hover:text-cine-amber transition-colors"
              aria-label="Next Shot"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen Expansion */}
          <button
            type="button"
            onClick={handleFullscreen}
            className="p-2.5 rounded-xl bg-surface-dark border border-cine-border hover:border-cine-amber text-text-muted hover:text-text-primary transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
