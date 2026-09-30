import { StoryboardShot, StylePreset, GenreCategory, CameraMotion, MediaAsset } from '../types';
import { SAMPLE_ASSETS } from '../data/assets';

export interface IdeaSuggestion {
  id: string;
  title: string;
  idea: string;
  styleId: string;
  genre: GenreCategory;
}

export const STORYBOARD_SUGGESTIONS: IdeaSuggestion[] = [
  {
    id: 'sug-neon-heist',
    title: 'Neon Cyberpunk Runner',
    idea: 'A cybernetic courier fleeing across rain-slicked neon skyscrapers in a futuristic metropolis',
    styleId: 'neon-noir',
    genre: 'neon_city',
  },
  {
    id: 'sug-alpine-summit',
    title: 'Alpine Summit Expedition',
    idea: 'A mountaineer traversing snow-swept alpine ridges and frozen pine forests during a golden sunrise',
    styleId: 'alpine-dawn',
    genre: 'alpine_nature',
  },
  {
    id: 'sug-deep-space',
    title: 'Deep Space Orbital Drift',
    idea: 'A lonely planetary probe surveying glowing orbital rings and ancient desert craters',
    styleId: 'cosmic-horizon',
    genre: 'deep_space',
  },
  {
    id: 'sug-macro-prism',
    title: 'Prismatic Fluid Symphony',
    idea: 'Vibrant chromatic ink currents blooming and refracting prismatic laser beams in fluid suspension',
    styleId: 'prismatic-macro',
    genre: 'macro_abstract',
  },
];

/**
 * Maps any genre category to the available sample pool.
 */
export function getAssetsForGenre(genre: GenreCategory): MediaAsset[] {
  const exact = SAMPLE_ASSETS.filter(a => a.genre === genre);
  if (exact.length > 0) return exact;

  // Fallback for custom genre aliases
  if (genre === 'cyber_dawn') {
    return SAMPLE_ASSETS.filter(a => a.genre === 'neon_city');
  }
  if (genre === 'solaris_prime') {
    return SAMPLE_ASSETS.filter(a => a.genre === 'deep_space');
  }
  return SAMPLE_ASSETS.filter(a => a.genre === 'neon_city');
}

/**
 * Rotates to the next distinct asset within the SAME genre look.
 * Guarantees that regenerating a shot NEVER returns the same output twice in a row (Fix 1 & 2).
 */
export function rotateAssetForShot(
  currentAssetId: string | undefined, 
  genre: GenreCategory, 
  preferredShotType?: 'Wide Establishing' | 'Medium Subject' | 'Close-Up Detail' | 'wide' | 'medium' | 'closeup'
): MediaAsset {
  const genreAssets = getAssetsForGenre(genre);

  // If we have multiple assets in this genre
  const otherAssets = genreAssets.filter(a => a.id !== currentAssetId);
  const pool = otherAssets.length > 0 ? otherAssets : genreAssets;

  // If there's an asset in the pool matching the preferred shotType, try that first if not current
  if (preferredShotType) {
    const typeKey = preferredShotType.toLowerCase().includes('wide') ? 'wide' :
                    preferredShotType.toLowerCase().includes('medium') ? 'medium' :
                    preferredShotType.toLowerCase().includes('close') ? 'closeup' : undefined;
    if (typeKey) {
      const typeMatch = pool.find(a => a.shotType === typeKey && a.id !== currentAssetId);
      if (typeMatch) return typeMatch;
    }
  }

  // Find index of current asset in genre pool to pick the next one cyclically
  const currentIndex = genreAssets.findIndex(a => a.id === currentAssetId);
  const nextIndex = (currentIndex + 1) % genreAssets.length;
  return genreAssets[nextIndex] || pool[0];
}

/**
 * Finds the media asset associated with a storyboard shot, strictly guaranteeing
 * it belongs to the storyboard's selected genre look (Fix 2).
 */
export function getAssetForShot(shot: StoryboardShot, expectedGenre?: GenreCategory): MediaAsset {
  const genreAssets = expectedGenre ? getAssetsForGenre(expectedGenre) : SAMPLE_ASSETS;

  if (shot.resultAssetId) {
    // If expectedGenre is provided, ensure asset belongs to expected genre
    const found = genreAssets.find(a => a.id === shot.resultAssetId);
    if (found) return found;
  }

  // Fallback by shot type within genre
  const typeMap: Record<string, 'wide' | 'medium' | 'closeup'> = {
    'Wide Establishing': 'wide',
    'Medium Subject': 'medium',
    'Close-Up Detail': 'closeup',
  };
  const targetType = typeMap[shot.shotType] || 'wide';
  return genreAssets.find(a => a.shotType === targetType) || genreAssets[0];
}

/**
 * Deconstructs a high-level narrative idea into three distinct, cinematic shot prompts.
 */
export function deconstructIdeaIntoShots(idea: string, style: StylePreset): StoryboardShot[] {
  const cleanIdea = idea.trim() || 'Cinematic visual sequence';
  const genreAssets = getAssetsForGenre(style.genre);
  
  const shot1Prompt = `Cinematic wide establishing shot of ${cleanIdea}, capturing the grand atmospheric landscape and spatial environment, in ${style.description.toLowerCase()}, 8k raw footage, photorealistic lighting`;
  const shot2Prompt = `Cinematic medium tracking shot of ${cleanIdea}, focusing on the dynamic motion, spatial subject interaction, and central scene elements, in ${style.description.toLowerCase()}, volumetric depth`;
  const shot3Prompt = `Cinematic macro close-up shot capturing intricate textures, glowing fine details and emotional resonance of ${cleanIdea}, in ${style.description.toLowerCase()}, shallow depth of field, anamorphic bokeh`;

  const wideAsset = genreAssets.find(a => a.shotType === 'wide') || genreAssets[0];
  const mediumAsset = genreAssets.find(a => a.shotType === 'medium') || genreAssets[1] || genreAssets[0];
  const closeupAsset = genreAssets.find(a => a.shotType === 'closeup') || genreAssets[2] || genreAssets[0];

  return [
    {
      id: `shot-${Date.now()}-1`,
      shotNumber: 1,
      shotType: 'Wide Establishing',
      prompt: shot1Prompt,
      cameraMotion: 'pan_right' as CameraMotion,
      durationSec: 5,
      status: 'idle',
      progress: 0,
      stageText: 'Queued',
      resultAssetId: wideAsset.id,
      locked: false,
    },
    {
      id: `shot-${Date.now()}-2`,
      shotNumber: 2,
      shotType: 'Medium Subject',
      prompt: shot2Prompt,
      cameraMotion: 'dolly_in' as CameraMotion,
      durationSec: 5,
      status: 'idle',
      progress: 0,
      stageText: 'Queued',
      resultAssetId: mediumAsset.id,
      locked: false,
    },
    {
      id: `shot-${Date.now()}-3`,
      shotNumber: 3,
      shotType: 'Close-Up Detail',
      prompt: shot3Prompt,
      cameraMotion: 'handheld' as CameraMotion,
      durationSec: 5,
      status: 'idle',
      progress: 0,
      stageText: 'Queued',
      resultAssetId: closeupAsset.id,
      locked: false,
    },
  ];
}

/**
 * Formats a 3-shot storyboard into a sharable recipe text block.
 */
export function formatStoryboardRecipe(title: string, idea: string, styleName: string, shots: StoryboardShot[]): string {
  let recipe = `🎬 CineFlow AI — 3-Shot Storyboard Recipe\n`;
  recipe += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  recipe += `Title: ${title || 'Untitled Sequence'}\n`;
  recipe += `Master Idea: "${idea}"\n`;
  recipe += `Style Preset: ${styleName}\n\n`;

  shots.forEach((shot, index) => {
    recipe += `[Shot ${index + 1}: ${shot.shotType}]\n`;
    recipe += `Camera: ${shot.cameraMotion.replace('_', ' ').toUpperCase()} | Duration: ${shot.durationSec}s\n`;
    recipe += `Prompt: ${shot.prompt}\n\n`;
  });

  recipe += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  recipe += `Crafted with CineFlow AI (https://cineflow.ai)`;
  return recipe;
}
