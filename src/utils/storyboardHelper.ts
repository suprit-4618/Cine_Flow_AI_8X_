import { StoryboardShot, StylePreset, GenreCategory, CameraMotion } from '../types';
import { SAMPLE_ASSETS, matchAssetForPrompt } from '../data/assets';

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
 * Deconstructs a high-level narrative idea into three distinct, cinematic shot prompts.
 */
export function deconstructIdeaIntoShots(idea: string, style: StylePreset): StoryboardShot[] {
  const cleanIdea = idea.trim() || 'Cinematic visual sequence';
  
  const shot1Prompt = `Cinematic wide establishing shot of ${cleanIdea}, capturing the grand atmospheric landscape and spatial environment, in ${style.description.toLowerCase()}, 8k raw footage, photorealistic lighting`;
  const shot2Prompt = `Cinematic medium tracking shot of ${cleanIdea}, focusing on the dynamic motion, spatial subject interaction, and central scene elements, in ${style.description.toLowerCase()}, volumetric depth`;
  const shot3Prompt = `Cinematic macro close-up shot capturing intricate textures, glowing fine details and emotional resonance of ${cleanIdea}, in ${style.description.toLowerCase()}, shallow depth of field, anamorphic bokeh`;

  const wideAsset = matchAssetForPrompt(cleanIdea, style.genre, 'wide');
  const mediumAsset = matchAssetForPrompt(cleanIdea, style.genre, 'medium');
  const closeupAsset = matchAssetForPrompt(cleanIdea, style.genre, 'closeup');

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
 * Finds the media asset associated with a storyboard shot.
 */
export function getAssetForShot(shot: StoryboardShot) {
  if (shot.resultAssetId) {
    const found = SAMPLE_ASSETS.find(a => a.id === shot.resultAssetId);
    if (found) return found;
  }
  const typeMap: Record<string, 'wide' | 'medium' | 'closeup'> = {
    'Wide Establishing': 'wide',
    'Medium Subject': 'medium',
    'Close-Up Detail': 'closeup',
  };
  return SAMPLE_ASSETS.find(a => a.shotType === typeMap[shot.shotType]) || SAMPLE_ASSETS[0];
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
