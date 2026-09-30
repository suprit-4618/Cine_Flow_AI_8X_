import React, { useState } from 'react';
import { CAMERA_MOTIONS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import { 
  Camera, 
  ArrowRight, 
  ArrowUp, 
  RotateCw, 
  Maximize2, 
  ZoomIn, 
  Activity 
} from 'lucide-react';
import { CameraMotion } from '../../types';

export const CameraWidget: React.FC = () => {
  const { draft, updateDraft } = useStudio();
  const [hoveredMotion, setHoveredMotion] = useState<CameraMotion | null>(null);

  const activeMotion = CAMERA_MOTIONS.find(m => m.value === draft.cameraMotion) || CAMERA_MOTIONS[0];
  const displayMotion = hoveredMotion 
    ? (CAMERA_MOTIONS.find(m => m.value === hoveredMotion) || activeMotion)
    : activeMotion;

  const getIcon = (motion: CameraMotion) => {
    switch (motion) {
      case 'pan_right':
        return <ArrowRight className="w-3.5 h-3.5" />;
      case 'tilt_up':
        return <ArrowUp className="w-3.5 h-3.5" />;
      case 'orbit_cw':
        return <RotateCw className="w-3.5 h-3.5" />;
      case 'dolly_in':
        return <Maximize2 className="w-3.5 h-3.5" />;
      case 'zoom_in':
        return <ZoomIn className="w-3.5 h-3.5" />;
      case 'handheld':
        return <Activity className="w-3.5 h-3.5" />;
      default:
        return <Camera className="w-3.5 h-3.5" />;
    }
  };

  const getAnimationClass = (motion: CameraMotion) => {
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
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-surface-dark border border-cine-border">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Camera className="w-4 h-4 text-cine-amber" />
          <span>Camera Motion Control</span>
        </label>
        <span className="text-[11px] font-mono text-cine-amber bg-cine-amber/10 px-2 py-0.5 rounded border border-cine-amber/30">
          {displayMotion.label}
        </span>
      </div>

      {/* 2D CSS Live Viewfinder Simulation Card */}
      <div className="relative aspect-video w-full rounded-xl bg-surface-obsidian border border-cine-border overflow-hidden flex items-center justify-center group">
        {/* Animated Target Scene Element with subtle 2D CSS motion */}
        <div
          className={`w-full h-full p-4 flex flex-col items-center justify-center transition-transform duration-300 ${getAnimationClass(displayMotion.value)}`}
        >
          {/* Viewfinder Rule-of-Thirds Grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div />
          </div>

          {/* Focal Subject */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-raised/90 backdrop-blur-md border border-cine-border/80 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-cine-amber/20 text-cine-amber flex items-center justify-center border border-cine-amber/40 shadow-amber-sm">
              {getIcon(displayMotion.value)}
            </div>
            <span className="text-xs font-bold text-text-primary">{displayMotion.label}</span>
          </div>
        </div>

        {/* Viewfinder Corner Framing Marks */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cine-amber opacity-80" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cine-amber opacity-80" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cine-amber opacity-80" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cine-amber opacity-80" />

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-text-muted bg-surface-obsidian/85 px-2.5 py-1 rounded backdrop-blur border border-cine-border/60">
          <span className="font-mono text-cine-amber font-semibold">2D MOTION PREVIEW</span>
          <span className="truncate max-w-[200px]">{displayMotion.desc}</span>
        </div>
      </div>

      {/* Preset Motion Buttons with Animated Thumbnails & Tooltips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {CAMERA_MOTIONS.map((motion) => {
          const isSelected = draft.cameraMotion === motion.value;
          const animClass = getAnimationClass(motion.value);

          return (
            <div key={motion.value} className="relative group/btn">
              <button
                type="button"
                onClick={() => updateDraft({ cameraMotion: motion.value })}
                onMouseEnter={() => setHoveredMotion(motion.value)}
                onMouseLeave={() => setHoveredMotion(null)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-[82px] relative overflow-hidden ${
                  isSelected
                    ? 'border-cine-amber bg-cine-amber/15 text-text-primary shadow-amber-sm ring-1 ring-cine-amber/50'
                    : 'border-cine-border bg-surface-raised/60 hover:bg-surface-raised text-text-muted hover:text-text-primary hover:border-cine-border/90'
                }`}
              >
                {/* Mini Viewport Animation Graphic */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`w-6 h-6 rounded-lg bg-surface-dark border border-cine-border/60 flex items-center justify-center text-cine-amber ${animClass}`}>
                    {getIcon(motion.value)}
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cine-amber animate-pulse" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold leading-tight truncate">
                    {motion.label}
                  </p>
                  <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                    {motion.value === 'static' ? 'Fixed frame' : motion.label.split(' ')[0]}
                  </p>
                </div>
              </button>

              {/* Accessible Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-surface-obsidian/95 backdrop-blur border border-cine-border text-[11px] text-text-primary shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity z-30 text-center">
                <p className="font-semibold text-cine-amber">{motion.label}</p>
                <p className="text-text-muted text-[10px] mt-0.5 leading-snug">{motion.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
