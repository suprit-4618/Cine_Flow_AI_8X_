import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  RotateCw, 
  ChevronUp, 
  ChevronDown, 
  GripVertical, 
  Camera, 
  Clock, 
  AlertCircle,
  Hash
} from 'lucide-react';
import { StoryboardShot, CameraMotion, AspectRatio, GenreCategory } from '../../types';
import { getAssetForShot } from '../../utils/storyboardHelper';

interface ShotCardProps {
  shot: StoryboardShot;
  index: number;
  totalShots: number;
  aspectRatio: AspectRatio;
  expectedGenre: GenreCategory;
  onUpdatePrompt: (shotId: string, newPrompt: string) => void;
  onToggleLock: (shotId: string) => void;
  onChangeCamera: (shotId: string, motion: CameraMotion) => void;
  onChangeDuration: (shotId: string, durationSec: number) => void;
  onRegenerateShot: (shotId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isGenerating: boolean;
}

const CAMERA_OPTIONS: { id: CameraMotion; label: string }[] = [
  { id: 'static', label: 'Static Lock' },
  { id: 'pan_right', label: 'Pan Right' },
  { id: 'tilt_up', label: 'Tilt Up' },
  { id: 'dolly_in', label: 'Dolly In' },
  { id: 'orbit_cw', label: 'Orbit CW' },
  { id: 'handheld', label: 'Handheld' },
];

const DURATION_OPTIONS = [3, 5, 8];

export const ShotCard: React.FC<ShotCardProps> = ({
  shot,
  index,
  totalShots,
  aspectRatio,
  expectedGenre,
  onUpdatePrompt,
  onToggleLock,
  onChangeCamera,
  onChangeDuration,
  onRegenerateShot,
  onMoveUp,
  onMoveDown,
  isGenerating,
}) => {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(shot.prompt);
  const [imageError, setImageError] = useState(false);

  // Check reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const asset = getAssetForShot(shot, expectedGenre);

  const getCameraAnimationClass = () => {
    if (prefersReducedMotion) return '';
    switch (shot.cameraMotion) {
      case 'pan_right': return 'animate-camera-pan';
      case 'tilt_up': return 'animate-camera-tilt';
      case 'orbit_cw': return 'animate-camera-orbit';
      case 'dolly_in': return 'animate-camera-dolly';
      case 'zoom_in': return 'animate-camera-zoom';
      case 'handheld': return 'animate-camera-handheld';
      default: return '';
    }
  };

  const handleSavePrompt = () => {
    onUpdatePrompt(shot.id, editedPrompt);
    setIsEditingPrompt(false);
  };

  const handleCancelPrompt = () => {
    setEditedPrompt(shot.prompt);
    setIsEditingPrompt(false);
  };

  const aspectClass = 
    aspectRatio === '9:16' ? 'aspect-[9/16]' :
    aspectRatio === '1:1' ? 'aspect-square' :
    'aspect-video';

  const displayImageSrc = (!imageError && shot.imageUrl)
    ? shot.imageUrl
    : (asset.posterUrl || asset.svgFallback);

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group ${
        shot.locked
          ? 'bg-surface-dark border-cine-amber/40 shadow-amber-sm'
          : 'bg-surface-dark border-cine-border hover:border-cine-border/80 shadow-md'
      }`}
    >
      {/* Card Header / Reorder & Lock Bar */}
      <div className="p-3.5 sm:p-4 bg-surface-raised/80 border-b border-cine-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Reorder grip & up/down buttons */}
          <div className="flex items-center gap-0.5 text-text-muted">
            <span className="cursor-grab text-text-muted/60 hover:text-text-primary p-1" title="Drag to reorder">
              <GripVertical className="w-4 h-4" />
            </span>
            <button
              type="button"
              disabled={index === 0 || isGenerating}
              onClick={() => onMoveUp(index)}
              aria-label="Move shot up"
              className="p-1 rounded hover:bg-surface-dark text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalShots - 1 || isGenerating}
              onClick={() => onMoveDown(index)}
              aria-label="Move shot down"
              className="p-1 rounded hover:bg-surface-dark text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Shot Number & Type Badge */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cine-amber/20 text-cine-amber text-xs font-bold flex items-center justify-center border border-cine-amber/40">
              {index + 1}
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-text-primary leading-none">
                {shot.shotType}
              </h3>
              <span className="text-[10px] text-text-muted">Angle #{index + 1}</span>
            </div>
          </div>
        </div>

        {/* Lock / Unlock Toggle */}
        <button
          type="button"
          onClick={() => onToggleLock(shot.id)}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
            shot.locked
              ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
              : 'bg-surface-dark border-cine-border text-text-muted hover:text-text-primary hover:border-cine-border/80'
          }`}
          title={shot.locked ? 'Locked: Protected from Regenerate All' : 'Unlocked: Will regenerate on batch run'}
        >
          {shot.locked ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Locked</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Lock</span>
            </>
          )}
        </button>
      </div>

      {/* Media Viewport Container with object-fit: cover and looping CSS camera motion */}
      <div className={`w-full relative bg-surface-obsidian overflow-hidden ${aspectClass}`}>
        {shot.status === 'done' ? (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <img
              src={displayImageSrc}
              alt={shot.prompt}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${getCameraAnimationClass()}`}
              style={{ 
                objectFit: 'cover',
                animationDuration: `${shot.durationSec || 5}s`
              }}
            />

            {/* Overlay Status Badge */}
            <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1.5 pointer-events-none">
              {shot.isFallback ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-950/90 backdrop-blur border border-cine-amber/60 text-[10px] font-bold text-cine-amber flex items-center gap-1 shadow-md">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sample shown: live generation unavailable</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-surface-obsidian/90 backdrop-blur border border-cine-border text-[10px] font-bold text-cine-amber flex items-center gap-1 shadow-md">
                  <span>Image with camera motion</span>
                </span>
              )}
            </div>
          </div>
        ) : shot.status === 'rendering' || shot.status === 'queued' ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface-obsidian/90 relative">
            <img 
              src={displayImageSrc} 
              alt="Rendering frame"
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm" 
              style={{ objectFit: 'cover' }}
            />
            <div className="relative z-10 text-center space-y-3 max-w-[200px]">
              <div className="w-9 h-9 mx-auto rounded-full border-2 border-cine-amber border-t-transparent animate-spin" />
              <div>
                <p className="text-xs font-bold text-cine-amber">{shot.stageText || 'Rendering'}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{shot.progress}% complete</p>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden border border-cine-border">
                <div 
                  className="h-full bg-gradient-to-r from-cine-amber to-amber-400 transition-all duration-300"
                  style={{ width: `${shot.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : shot.status === 'failed' ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface-obsidian text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-cine-rose" />
            <p className="text-xs font-bold text-cine-rose">Generation Failed</p>
            <p className="text-[11px] text-text-muted">{shot.errorMessage || 'Please click Retry.'}</p>
            <button
              type="button"
              onClick={() => onRegenerateShot(shot.id)}
              className="px-3 py-1 rounded bg-cine-amber text-surface-obsidian font-bold text-xs hover:bg-cine-amber-hover"
            >
              Retry Shot
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={displayImageSrc}
              alt={shot.shotType}
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <span className="text-xs text-text-muted bg-surface-obsidian/80 px-2.5 py-1 rounded-md border border-cine-border">
                Click Generate Sequence
              </span>
            </div>
          </div>
        )}

        {/* Camera, Seed & Duration Overlay Badges */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 pointer-events-none">
          {shot.seed !== undefined && (
            <div className="flex items-center gap-0.5 bg-surface-obsidian/85 backdrop-blur-md px-1.5 py-0.5 rounded border border-cine-border text-[9px] text-text-muted font-mono">
              <Hash className="w-2.5 h-2.5 text-cine-amber" />
              <span>{shot.seed}</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-surface-obsidian/85 backdrop-blur-md px-2 py-0.5 rounded border border-cine-border text-[10px] text-cine-amber font-mono">
            <Camera className="w-3 h-3" />
            <span>{shot.cameraMotion.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-obsidian/85 backdrop-blur-md px-2 py-0.5 rounded border border-cine-border text-[10px] text-text-secondary font-mono">
            <Clock className="w-3 h-3 text-cine-amber" />
            <span>{shot.durationSec || 5}s</span>
          </div>
        </div>
      </div>

      {/* Prompt & Controls Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Shot Prompt</span>
            {!isEditingPrompt && (
              <button
                type="button"
                onClick={() => {
                  setEditedPrompt(shot.prompt);
                  setIsEditingPrompt(true);
                }}
                className="text-[11px] text-cine-amber hover:underline font-medium"
              >
                Edit Prompt
              </button>
            )}
          </div>

          {isEditingPrompt ? (
            <div className="space-y-2 animate-fadeIn">
              <textarea
                rows={3}
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full p-2 bg-surface-raised border border-cine-amber/60 rounded-lg text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-cine-amber resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelPrompt}
                  className="px-2.5 py-1 rounded text-[11px] text-text-muted hover:text-text-primary hover:bg-surface-raised"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrompt}
                  className="px-3 py-1 rounded bg-cine-amber text-surface-obsidian text-[11px] font-bold hover:bg-cine-amber-hover"
                >
                  Save Prompt
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-muted line-clamp-3 leading-relaxed bg-surface-raised/40 p-2.5 rounded-lg border border-cine-border/50">
              {shot.prompt}
            </p>
          )}
        </div>

        {/* Camera Selector & Duration Settings */}
        <div className="pt-2 border-t border-cine-border/60 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`camera-select-${shot.id}`} className="text-[11px] font-semibold text-text-muted">
              Camera Motion:
            </label>
            <select
              id={`camera-select-${shot.id}`}
              value={shot.cameraMotion}
              onChange={(e) => onChangeCamera(shot.id, e.target.value as CameraMotion)}
              className="px-2 py-1 rounded-lg bg-surface-raised border border-cine-border text-xs text-text-primary focus:outline-none focus:border-cine-amber cursor-pointer"
            >
              {CAMERA_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-text-muted">
              Shot Duration:
            </span>
            <div className="flex items-center gap-1">
              {DURATION_OPTIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => onChangeDuration(shot.id, dur)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                    (shot.durationSec || 5) === dur
                      ? 'bg-cine-amber/20 border-cine-amber text-cine-amber'
                      : 'bg-surface-raised border-cine-border text-text-muted hover:text-text-primary'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Regenerate Single Shot Button */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isGenerating || shot.status === 'rendering'}
              onClick={() => onRegenerateShot(shot.id)}
              className="w-full py-2 px-3 rounded-xl bg-surface-raised hover:bg-surface-raised/80 border border-cine-border hover:border-cine-amber/60 text-text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-3.5 h-3.5 text-cine-amber ${shot.status === 'rendering' ? 'animate-spin' : ''}`} />
              <span>{shot.status === 'done' ? 'Regenerate Shot' : 'Generate Shot'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
