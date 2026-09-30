import React from 'react';
import { CAMERA_MOTIONS } from '../../data/presets';
import { useStudio } from '../../context/StudioContext';
import { Camera, ArrowRight, ArrowUp, RotateCw, Maximize2, Activity } from 'lucide-react';
import { CameraMotion } from '../../types';

export const CameraWidget: React.FC = () => {
  const { draft, updateDraft } = useStudio();
  const activeMotion = CAMERA_MOTIONS.find(m => m.value === draft.cameraMotion) || CAMERA_MOTIONS[0];

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
      case 'handheld':
        return <Activity className="w-3.5 h-3.5" />;
      default:
        return <Camera className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-surface-dark border border-cine-border">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Camera className="w-4 h-4 text-cine-amber" />
          <span>Camera Motion (2D Preview)</span>
        </label>
        <span className="text-[11px] font-mono text-cine-amber bg-cine-amber/10 px-2 py-0.5 rounded border border-cine-amber/30">
          {activeMotion.label}
        </span>
      </div>

      {/* 2D CSS Live Viewfinder Simulation Card */}
      <div className="relative aspect-video w-full rounded-xl bg-obsidian border border-cine-border overflow-hidden flex items-center justify-center group">
        {/* Animated Target Scene Element */}
        <div
          className={`w-full h-full p-4 flex flex-col items-center justify-center transition-transform duration-300 ${activeMotion.animationClass}`}
        >
          {/* Viewfinder Rule-of-Thirds Grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
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
          <div className="relative z-10 flex flex-col items-center gap-1.5 p-3 rounded-lg bg-surface-raised/80 backdrop-blur border border-cine-border/80 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-cine-amber/20 text-cine-amber flex items-center justify-center border border-cine-amber/40">
              {getIcon(draft.cameraMotion)}
            </div>
            <span className="text-[11px] font-semibold text-text-primary">{activeMotion.label}</span>
          </div>
        </div>

        {/* Viewfinder Corner Framing Marks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cine-amber opacity-70" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cine-amber opacity-70" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cine-amber opacity-70" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cine-amber opacity-70" />

        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-text-muted bg-obsidian/70 px-2 py-0.5 rounded backdrop-blur border border-cine-border/50">
          <span>2D TRANSFORM SIMULATION</span>
          <span>{activeMotion.desc}</span>
        </div>
      </div>

      {/* Preset Motion Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {CAMERA_MOTIONS.map((motion) => {
          const isSelected = draft.cameraMotion === motion.value;
          return (
            <button
              key={motion.value}
              type="button"
              onClick={() => updateDraft({ cameraMotion: motion.value })}
              className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-colors min-h-[38px] ${
                isSelected
                  ? 'border-cine-amber bg-surface-raised text-cine-amber shadow-amber-sm'
                  : 'border-cine-border bg-surface-raised/50 text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <span className={isSelected ? 'text-cine-amber' : 'text-text-dim'}>
                {getIcon(motion.value)}
              </span>
              <span className="truncate">{motion.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
