import { ModelPreset, StylePreset, CameraMotion, AspectRatio } from '../types';

export const MOCK_MODELS: ModelPreset[] = [
  {
    id: 'cinemotion-v3',
    name: 'CineMotion v3',
    badge: 'Flagship',
    description: 'Ultra-fluid 60fps cinematic coherence with anamorphic lens simulation.',
    baseCost: 15,
    renderTimeSec: 5,
  },
  {
    id: 'realismax-alpha',
    name: 'RealisMax Alpha',
    badge: 'Photoreal',
    description: 'Hyper-detailed physical lighting, natural subsurface skin scatter and volumetric fog.',
    baseCost: 20,
    renderTimeSec: 6,
  },
  {
    id: 'chromapulse-pro',
    name: 'ChromaPulse Pro',
    badge: 'Stylized',
    description: 'High-contrast neon saturation, chromatic aberration, and artistic flair.',
    baseCost: 12,
    renderTimeSec: 4,
  },
  {
    id: 'voidvector-hyper',
    name: 'VoidVector Hyper',
    badge: 'Fast Draft',
    description: 'Rapid spatial generation tuned for fast concept visualization and storyboard ideation.',
    baseCost: 8,
    renderTimeSec: 3,
  },
];

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'neon-noir',
    name: 'Neon Noir',
    genre: 'neon_city',
    description: 'Rain-drenched cyber metropolis with amber & cyan neon reflections.',
    promptSuffix: 'cyberpunk neon city at night, rain-slicked asphalt, anamorphic amber rim lighting, 8k cinematic depth',
    gradientBg: 'from-amber-600/30 via-purple-900/30 to-slate-950',
    tag: 'Cyberpunk',
  },
  {
    id: 'alpine-vista',
    name: 'Alpine Vista',
    genre: 'alpine_nature',
    description: 'Towering snow-capped mountain ranges, morning mist, and golden sunbeams.',
    promptSuffix: 'majestic snow-covered mountains, cinematic aerial drone view, golden hour sunlight, pristine alpine pines',
    gradientBg: 'from-cyan-700/30 via-slate-800/30 to-slate-950',
    tag: 'Nature',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    genre: 'deep_space',
    description: 'Crimson desert terrain under planetary rings and cosmic nebula sky.',
    promptSuffix: 'alien crimson desert planet, majestic glowing planetary rings in sky, cinematic sci-fi odyssey, 70mm film',
    gradientBg: 'from-red-600/30 via-indigo-950/40 to-slate-950',
    tag: 'Sci-Fi',
  },
  {
    id: 'macro-prism',
    name: 'Macro Prism',
    genre: 'macro_abstract',
    description: 'Microscopic crystalline light refractions and fluid chromatic waves.',
    promptSuffix: 'macro close-up light refraction through prism, kaleidoscopic crystal geometry, vibrant spectrum, ultra bokeh',
    gradientBg: 'from-amber-500/30 via-emerald-800/30 to-slate-950',
    tag: 'Abstract',
  },
  {
    id: 'cyber-dawn',
    name: 'Cyber Dawn',
    genre: 'cyber_dawn',
    description: 'Futuristic solar architecture with gleaming glass and warm sunrise haze.',
    promptSuffix: 'futuristic solarpunk cityscape at sunrise, golden light through towering glass architecture, lens flares',
    gradientBg: 'from-orange-600/30 via-amber-900/30 to-slate-950',
    tag: 'Futurism',
  },
  {
    id: 'solaris-prime',
    name: 'Solaris Prime',
    genre: 'solaris_prime',
    description: 'Extraterrestrial volcanic obsidian plains with burning plasma skies.',
    promptSuffix: 'obsidian desert under blazing solar flare, surreal sci-fi atmosphere, dramatic deep shadows, cinematic masterwork',
    gradientBg: 'from-yellow-600/30 via-red-950/40 to-slate-950',
    tag: 'Cinema',
  },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; ratioClass: string; desc: string }[] = [
  { value: '16:9', label: '16:9 Landscape', ratioClass: 'aspect-video', desc: 'Cinematic Widescreen' },
  { value: '9:16', label: '9:16 Portrait', ratioClass: 'aspect-[9/16]', desc: 'Social & Mobile' },
  { value: '1:1', label: '1:1 Square', ratioClass: 'aspect-square', desc: 'Balanced Frame' },
];

export const CAMERA_MOTIONS: { value: CameraMotion; label: string; iconName: string; animationClass: string; desc: string; transformStyle: string }[] = [
  { 
    value: 'static', 
    label: 'Static Lock', 
    iconName: 'Camera', 
    animationClass: '', 
    desc: 'Fixed tripod composition with zero motion',
    transformStyle: 'none'
  },
  { 
    value: 'pan_right', 
    label: 'Pan Right', 
    iconName: 'ArrowRight', 
    animationClass: 'animate-pan-right', 
    desc: 'Smooth lateral horizontal camera track',
    transformStyle: 'translateX(8px)'
  },
  { 
    value: 'tilt_up', 
    label: 'Tilt Up', 
    iconName: 'ArrowUp', 
    animationClass: 'animate-tilt-up', 
    desc: 'Vertical upward crane / tilt perspective',
    transformStyle: 'translateY(-8px)'
  },
  { 
    value: 'orbit_cw', 
    label: 'Orbit CW', 
    iconName: 'RotateCw', 
    animationClass: 'animate-orbit-cw', 
    desc: 'Arcing orbital circular movement around subject',
    transformStyle: 'rotate(4deg) scale(1.04)'
  },
  { 
    value: 'dolly_in', 
    label: 'Dolly In', 
    iconName: 'Maximize2', 
    animationClass: 'animate-dolly-in', 
    desc: 'Physical forward push into the scene focus',
    transformStyle: 'scale(1.08)'
  },
  { 
    value: 'zoom_in', 
    label: 'Zoom In', 
    iconName: 'ZoomIn', 
    animationClass: 'animate-zoom-in', 
    desc: 'Optical telephoto magnification sweep',
    transformStyle: 'scale(1.12)'
  },
  { 
    value: 'handheld', 
    label: 'Handheld', 
    iconName: 'Activity', 
    animationClass: 'animate-handheld', 
    desc: 'Subtle organic documentary micro-shake',
    transformStyle: 'translate(2px, -2px) rotate(0.8deg)'
  },
];
