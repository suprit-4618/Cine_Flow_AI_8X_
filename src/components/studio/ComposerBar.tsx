import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { STYLE_PRESETS, MOCK_MODELS, ASPECT_RATIOS, CAMERA_MOTIONS } from '../../data/presets';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Maximize, 
  Clock, 
  Camera, 
  ChevronDown, 
  X,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Maximize2,
  ZoomIn,
  Activity
} from 'lucide-react';
import { CameraMotion } from '../../types';

type OpenPopover = 'style' | 'model' | 'ratio' | 'duration' | 'camera' | null;

interface ComposerBarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ComposerBar: React.FC<ComposerBarProps> = ({
  textareaRef,
  onGenerate,
  isGenerating,
}) => {
  const { draft, updateDraft } = useStudio();
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);
  const popoverContainerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const currentStyle = STYLE_PRESETS.find(s => s.id === draft.styleId) || STYLE_PRESETS[0];
  const currentModel = MOCK_MODELS.find(m => m.id === draft.modelId) || MOCK_MODELS[0];
  const currentCamera = CAMERA_MOTIONS.find(c => c.value === draft.cameraMotion) || CAMERA_MOTIONS[0];

  const isPromptEmpty = !draft.prompt.trim();

  // Close popover on Esc or outside click & restore focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openPopover) {
        const lastTrigger = triggerRefs.current[openPopover];
        setOpenPopover(null);
        lastTrigger?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverContainerRef.current && !popoverContainerRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openPopover]);

  const togglePopover = (name: OpenPopover) => {
    setOpenPopover(prev => (prev === name ? null : name));
  };

  const getCameraIcon = (motion: CameraMotion) => {
    switch (motion) {
      case 'pan_right': return <ArrowRight className="w-3.5 h-3.5" />;
      case 'tilt_up': return <ArrowUp className="w-3.5 h-3.5" />;
      case 'orbit_cw': return <RotateCw className="w-3.5 h-3.5" />;
      case 'dolly_in': return <Maximize2 className="w-3.5 h-3.5" />;
      case 'zoom_in': return <ZoomIn className="w-3.5 h-3.5" />;
      case 'handheld': return <Activity className="w-3.5 h-3.5" />;
      default: return <Camera className="w-3.5 h-3.5" />;
    }
  };

  const getCameraAnimationClass = (motion: CameraMotion) => {
    switch (motion) {
      case 'pan_right': return 'animate-camera-pan';
      case 'tilt_up': return 'animate-camera-tilt';
      case 'orbit_cw': return 'animate-camera-orbit';
      case 'dolly_in': return 'animate-camera-dolly';
      case 'zoom_in': return 'animate-camera-zoom';
      case 'handheld': return 'animate-camera-handheld';
      default: return '';
    }
  };

  return (
    <div 
      ref={popoverContainerRef}
      className="w-full max-w-4xl mx-auto rounded-3xl bg-surface-dark/95 backdrop-blur-xl border border-cine-border shadow-2xl p-4 sm:p-5 relative z-40 space-y-4"
    >
      {/* Popover Flyouts Container */}
      {openPopover && (
        <div 
          role="dialog"
          aria-modal="true"
          className="absolute bottom-full left-4 right-4 sm:left-6 sm:right-6 mb-3 p-4 rounded-2xl bg-surface-raised border border-cine-border shadow-2xl animate-fadeIn z-50 max-h-[380px] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-cine-border mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {openPopover === 'style' && 'Visual Style Look'}
              {openPopover === 'model' && 'Generation Speed & Detail'}
              {openPopover === 'ratio' && 'Aspect Ratio Frame'}
              {openPopover === 'duration' && 'Clip Duration'}
              {openPopover === 'camera' && 'Camera Motion Preset'}
            </h4>
            <button
              type="button"
              onClick={() => setOpenPopover(null)}
              className="p-1 text-text-muted hover:text-text-primary rounded-lg"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Style Popover Content */}
          {openPopover === 'style' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    updateDraft({ styleId: style.id });
                    setOpenPopover(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[86px] relative overflow-hidden group ${
                    draft.styleId === style.id
                      ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                      : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradientBg} opacity-15 pointer-events-none`} />
                  <div className="relative z-10">
                    <span className="text-xs font-bold block">{style.name}</span>
                    <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{style.tag}</span>
                  </div>
                  <span className="text-[10px] text-text-dim relative z-10">{style.genre.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          )}

          {/* Model Popover Content */}
          {openPopover === 'model' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    updateDraft({ modelId: model.id });
                    setOpenPopover(null);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    draft.modelId === model.id
                      ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                      : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text-primary">{model.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-raised border border-cine-border text-accent">
                      {model.renderTimeSec}s
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Aspect Ratio Popover Content */}
          {openPopover === 'ratio' && (
            <div className="grid grid-cols-3 gap-3">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => {
                    updateDraft({ aspectRatio: ratio.value });
                    setOpenPopover(null);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    draft.aspectRatio === ratio.value
                      ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                      : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                  }`}
                >
                  <div className="w-8 h-8 rounded border border-current flex items-center justify-center text-xs font-mono font-bold">
                    {ratio.value}
                  </div>
                  <span className="text-xs font-bold">{ratio.label.split(' ')[1] || ratio.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Duration Popover Content */}
          {openPopover === 'duration' && (
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 8].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    updateDraft({ durationSec: sec });
                    setOpenPopover(null);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    draft.durationSec === sec
                      ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                      : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span className="text-lg font-mono font-bold text-text-primary">{sec}s</span>
                  <span className="text-[11px] text-text-muted">
                    {sec === 3 ? 'Short' : sec === 5 ? 'Standard' : 'Extended'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Camera Motion Popover Content */}
          {openPopover === 'camera' && (
            <div className="space-y-4">
              {/* Live 2D CSS Viewfinder Preview */}
              <div className="relative aspect-video w-full rounded-xl bg-surface-obsidian border border-cine-border overflow-hidden flex items-center justify-center">
                <div className={`w-full h-full p-4 flex flex-col items-center justify-center transition-transform ${getCameraAnimationClass(draft.cameraMotion)}`}>
                  <div className="p-3 rounded-xl bg-surface-raised/90 border border-cine-border flex items-center gap-2 shadow-lg">
                    <div className="text-accent">{getCameraIcon(draft.cameraMotion)}</div>
                    <span className="text-xs font-bold text-text-primary">{currentCamera.label}</span>
                  </div>
                </div>
              </div>

              {/* Camera Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CAMERA_MOTIONS.map((motion) => (
                  <button
                    key={motion.value}
                    type="button"
                    onClick={() => {
                      updateDraft({ cameraMotion: motion.value });
                      setOpenPopover(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      draft.cameraMotion === motion.value
                        ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                        : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <div className="text-accent">{getCameraIcon(motion.value)}</div>
                    <div>
                      <p className="text-xs font-bold truncate">{motion.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Prompt Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={draft.prompt}
          onChange={(e) => updateDraft({ prompt: e.target.value })}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isPromptEmpty && !isGenerating) {
              e.preventDefault();
              onGenerate();
            }
          }}
          placeholder="Describe a cinematic scene, mood, camera framing, and action..."
          rows={2}
          className="w-full bg-transparent text-base sm:text-lg text-text-primary placeholder:text-text-dim focus:outline-none resize-none leading-relaxed"
          style={{ minHeight: '56px' }}
        />
      </div>

      {/* Bottom Parameter Bar: Compact Pills & Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cine-border/60">
        {/* Compact Parameter Triggers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {/* Style Look Pill */}
          <button
            ref={(el) => (triggerRefs.current['style'] = el)}
            type="button"
            aria-expanded={openPopover === 'style'}
            onClick={() => togglePopover('style')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[38px] ${
              openPopover === 'style'
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-cine-border bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>Look: <strong>{currentStyle.name}</strong></span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {/* Model Pill */}
          <button
            ref={(el) => (triggerRefs.current['model'] = el)}
            type="button"
            aria-expanded={openPopover === 'model'}
            onClick={() => togglePopover('model')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[38px] ${
              openPopover === 'model'
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-cine-border bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span>Model: <strong>{currentModel.name}</strong></span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {/* Aspect Ratio Pill */}
          <button
            ref={(el) => (triggerRefs.current['ratio'] = el)}
            type="button"
            aria-expanded={openPopover === 'ratio'}
            onClick={() => togglePopover('ratio')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[38px] ${
              openPopover === 'ratio'
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-cine-border bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}
          >
            <Maximize className="w-3.5 h-3.5 text-accent" />
            <span>Ratio: <strong>{draft.aspectRatio}</strong></span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {/* Duration Pill */}
          <button
            ref={(el) => (triggerRefs.current['duration'] = el)}
            type="button"
            aria-expanded={openPopover === 'duration'}
            onClick={() => togglePopover('duration')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[38px] ${
              openPopover === 'duration'
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-cine-border bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Duration: <strong>{draft.durationSec}s</strong></span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {/* Camera Motion Pill */}
          <button
            ref={(el) => (triggerRefs.current['camera'] = el)}
            type="button"
            aria-expanded={openPopover === 'camera'}
            onClick={() => togglePopover('camera')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[38px] ${
              openPopover === 'camera'
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-cine-border bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-accent" />
            <span>Camera: <strong>{currentCamera.label}</strong></span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-text-dim">Simulated</span>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isPromptEmpty || isGenerating}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all flex items-center gap-2 shadow-lg min-h-[44px] ${
              isPromptEmpty || isGenerating
                ? 'bg-surface-raised text-text-dim border border-cine-border cursor-not-allowed opacity-60'
                : 'bg-accent hover:bg-accent-hover active:scale-95 shadow-amber-sm'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Rendering...' : 'Generate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
