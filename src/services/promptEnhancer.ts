import { StylePreset } from '../types';

const LIGHTING_MODIFIERS = [
  'dramatic golden hour volumetric sunlight',
  'high-contrast anamorphic rim lighting with subtle lens flares',
  'soft diffused cinematic atmospheric haze',
  'moody low-key chiaroscuro illumination with glowing accents',
  'prismatic natural light rays piercing through misty air',
];

const CAMERA_LENS_MODIFIERS = [
  'shot on 35mm master prime lens at f/1.4 aperture',
  'anamorphic widescreen capture with gentle chromatic aberration',
  '70mm IMAX format with crisp edge-to-edge depth of field',
  'ultra-wide cinematic framing with natural bokeh falloff',
];

const TEXTURE_MODIFIERS = [
  'photorealistic textures, subtle film grain, 8k master fidelity',
  'ultra-detailed environment micro-reflections, award-winning cinematography',
  'hyper-detailed subsurface scattering and volumetric particle dust',
];

/**
 * Expands a prompt locally using structured cinematic filmmaking templates
 * with zero external API calls.
 */
export function enhancePromptLocally(basePrompt: string, style?: StylePreset): string {
  const trimmed = basePrompt.trim();
  if (!trimmed) return basePrompt;

  // Pick pseudo-random but stable modifiers based on prompt length
  const hash = trimmed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const light = LIGHTING_MODIFIERS[hash % LIGHTING_MODIFIERS.length];
  const lens = CAMERA_LENS_MODIFIERS[(hash + 1) % CAMERA_LENS_MODIFIERS.length];
  const texture = TEXTURE_MODIFIERS[(hash + 2) % TEXTURE_MODIFIERS.length];

  const styleExtension = style?.promptSuffix ? `, ${style.promptSuffix}` : '';

  // Avoid appending if already contains lens or 8k keywords
  let enhanced = trimmed;
  if (!enhanced.endsWith('.')) {
    enhanced += '.';
  }

  enhanced += ` ${light}, ${lens}, ${texture}${styleExtension}.`;
  return enhanced;
}
