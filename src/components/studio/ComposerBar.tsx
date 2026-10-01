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
  onDockResize?: (height: number) => void;
}

export const ComposerBar: React.FC<ComposerBarProps> = ({
  textareaRef,
  onGenerate,
  isGenerating,
  onDockResize,
}) => {
  const { draft, updateDraft } = useStudio();
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const popoverContainerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const currentStyle = STYLE_PRESETS.find(s => s.id === draft.styleId) || STYLE_PRESETS[0];
  const currentModel = MOCK_MODELS.find(m => m.id === draft.modelId) || MOCK_MODELS[0];
  const currentCamera = CAMERA_MOTIONS.find(c => c.value === draft.cameraMotion) || CAMERA_MOTIONS[0];

  const isPromptEmpty = !draft.prompt.trim();

  // ResizeObserver to measure exact dock card height
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const height = entry.contentRect.height;
        onDockResize?.(height);
        document.documentElement.style.setProperty('--studio-dock-height', `${height}px`);
      }
    });

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [onDockResize]);

  // Adjust for visualViewport on mobile when keyboard opens
  const [viewportBottomOffset, setViewportBottomOffset] = useState<number>(0);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleVisualResize = () => {
      if (!window.visualViewport) return;
      const offset = window.innerHeight - window.visualViewport.height;
      setViewportBottomOffset(Math.max(0, offset));
    };

    window.visualViewport.addEventListener('resize', handleVisualResize);
    window.visualViewport.addEventListener('scroll', handleVisualResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualResize);
      window.visualViewport?.removeEventListener('scroll', handleVisualResize);
    };
  }, []);

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
      style={{
        bottom: viewportBottomOffset > 0 
          ? `${viewportBottomOffset}px` 
          : undefined,
      }}
      className="fixed left-0 right-0 bottom-16 sm:bottom-0 z-40 pointer-events-none px-4 pb-0 sm:pb-[calc(16px+env(safe-area-inset-bottom))]"
    >
      {/* Background Gradient to smoothly fade feed cards under dock */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian via-obsidian/90 to-transparent pointer-events-none -z-10" 
      />

      {/* Floating Centered Dock Card (max-w-[760px]) */}
      <div
        ref={cardRef}
        className="pointer-events-auto max-w-[760px] mx-auto w-full rounded-[20px] bg-surface-dark border border-cine-border shadow-2xl shadow-black/80 relative"
      >
        <div 
          ref={popoverContainerRef}
          className="p-3.5 sm:p-4 relative"
        >
          {/* Popover Flyouts Container */}
          {openPopover && (
            <div 
              role="dialog"
              aria-modal="true"
              className="absolute bottom-full left-0 right-0 sm:left-0 sm:right-auto sm:w-[460px] mb-3 p-4 rounded-2xl bg-surface-raised border border-cine-border shadow-2xl animate-fadeIn z-50 max-h-[380px] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cine-border mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {openPopover === 'style' && 'Visual Look'}
                  {openPopover === 'model' && 'Model Engine'}
                  {openPopover === 'ratio' && 'Aspect Ratio'}
                  {openPopover === 'duration' && 'Duration'}
                  {openPopover === 'camera' && 'Camera Motion'}
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
                <div className="grid grid-cols-2 gap-2.5">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        updateDraft({ styleId: style.id });
                        setOpenPopover(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[82px] relative overflow-hidden group ${
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
                    </button>
                  ))}
                </div>
              )}

              {/* Model Popover Content */}
              {openPopover === 'model' && (
                <div className="space-y-2">
                  {MOCK_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        updateDraft({ modelId: model.id });
                        setOpenPopover(null);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        draft.modelId === model.id
                          ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                          : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">{model.name}</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-raised border border-cine-border text-accent">
                            {model.renderTimeSec}s
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{model.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Aspect Ratio Popover Content */}
              {openPopover === 'ratio' && (
                <div className="grid grid-cols-3 gap-2.5">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => {
                        updateDraft({ aspectRatio: ratio.value });
                        setOpenPopover(null);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        draft.aspectRatio === ratio.value
                          ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                          : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <div className="w-7 h-7 rounded border border-current flex items-center justify-center text-xs font-mono font-bold">
                        {ratio.value}
                      </div>
                      <span className="text-xs font-bold">{ratio.label.split(' ')[1] || ratio.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Duration Popover Content */}
              {openPopover === 'duration' && (
                <div className="grid grid-cols-3 gap-2.5">
                  {[3, 5, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        updateDraft({ durationSec: sec });
                        setOpenPopover(null);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        draft.durationSec === sec
                          ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                          : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <span className="text-lg font-mono font-bold text-text-primary">{sec}s</span>
                      <span className="text-[10px] text-text-muted">
                        {sec === 3 ? 'Short' : sec === 5 ? 'Standard' : 'Extended'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Camera Motion Popover Content */}
              {openPopover === 'camera' && (
                <div className="space-y-3">
                  {/* 2D CSS Viewfinder Preview */}
                  <div className="relative aspect-video w-full rounded-xl bg-surface-obsidian border border-cine-border overflow-hidden flex items-center justify-center">
                    <div className={`w-full h-full p-3 flex flex-col items-center justify-center transition-transform ${getCameraAnimationClass(draft.cameraMotion)}`}>
                      <div className="p-2.5 rounded-xl bg-surface-raised/90 border border-cine-border flex items-center gap-2 shadow-lg">
                        <div className="text-accent">{getCameraIcon(draft.cameraMotion)}</div>
                        <span className="text-xs font-bold text-text-primary">{currentCamera.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {CAMERA_MOTIONS.map((motion) => (
                      <button
                        key={motion.value}
                        type="button"
                        onClick={() => {
                          updateDraft({ cameraMotion: motion.value });
                          setOpenPopover(null);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          draft.cameraMotion === motion.value
                            ? 'border-accent bg-accent/10 ring-1 ring-accent text-text-primary'
                            : 'border-cine-border bg-surface-dark hover:bg-surface-hover text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <div className="text-accent">{getCameraIcon(motion.value)}</div>
                        <span className="text-xs font-bold truncate">{motion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compact Composer Content: Textarea (2-6 rows) + Bottom Controls Row */}
          <div className="space-y-2.5 flex flex-col">
            {/* Prompt Textarea: starts at 2 rows, expands up to 6 rows max, then scrolls */}
            <div className="overflow-y-auto max-h-[140px] min-h-[52px]">
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
                className="w-full bg-transparent text-base sm:text-[17px] text-text-primary placeholder:text-text-dim focus:outline-none resize-none leading-relaxed px-1"
              />
            </div>

            {/* Bottom Row: Pills on Left, 'Simulated' + Generate on Right */}
            <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-cine-border/50">
              {/* Parameter Pills: Single Row that scrolls sideways on narrow screens */}
              <div className="flex items-center gap-2 overflow-x-auto flex-nowrap no-scrollbar py-0.5 flex-1 min-w-0">
                {/* Style Look Pill */}
                <button
                  ref={(el) => (triggerRefs.current['style'] = el)}
                  type="button"
                  aria-expanded={openPopover === 'style'}
                  onClick={() => togglePopover('style')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    openPopover === 'style'
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-cine-border bg-surface-raised hover:bg-surface-hover text-text-secondary hover:text-text-primary'
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    openPopover === 'model'
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-cine-border bg-surface-raised hover:bg-surface-hover text-text-secondary hover:text-text-primary'
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    openPopover === 'ratio'
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-cine-border bg-surface-raised hover:bg-surface-hover text-text-secondary hover:text-text-primary'
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    openPopover === 'duration'
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-cine-border bg-surface-raised hover:bg-surface-hover text-text-secondary hover:text-text-primary'
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    openPopover === 'camera'
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-cine-border bg-surface-raised hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-accent" />
                  <span>Camera: <strong>{currentCamera.label}</strong></span>
                  <ChevronDown className="w-3 h-3 text-text-muted" />
                </button>
              </div>

              {/* Right Side: "Simulated" + Solid Orange Generate button with Dark Text */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[11px] text-text-dim hidden sm:inline select-none">Simulated</span>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isPromptEmpty || isGenerating}
                  className={`px-5 sm:px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm min-h-[38px] ${
                    isPromptEmpty || isGenerating
                      ? 'bg-surface-raised border border-cine-border text-text-muted opacity-80 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent-hover text-[#0E0F12] active:scale-95 shadow-amber-sm'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Rendering...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

