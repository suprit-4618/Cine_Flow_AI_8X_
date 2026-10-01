// Core Data Types for CineFlow AI

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type CameraMotion = 'static' | 'pan_right' | 'tilt_up' | 'orbit_cw' | 'dolly_in' | 'zoom_in' | 'handheld';

export type GenreCategory = 
  | 'neon_city' 
  | 'alpine_nature' 
  | 'deep_space' 
  | 'macro_abstract' 
  | 'cyber_dawn' 
  | 'solaris_prime';

export type GenerationStatus = 'idle' | 'queued' | 'rendering' | 'done' | 'failed';

export type StageText = 'Queued' | 'Rendering' | 'Finishing' | 'Completed' | 'Error';

export interface ModelPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  baseCost: number; // compute credits
  renderTimeSec: number;
}

export interface StylePreset {
  id: string;
  name: string;
  genre: GenreCategory;
  description: string;
  promptSuffix: string;
  gradientBg: string;
  tag: string;
}

export interface MediaAsset {
  id: string;
  genre: GenreCategory;
  shotType: 'wide' | 'medium' | 'closeup' | 'standalone';
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  svgFallback: string; // inline SVG data uri / markup for 100% offline fallback
  keywords: string[];
  author: string;
  sourceUrl: string;
  license: string;
}

export interface ExploreItem {
  id: string;
  title: string;
  prompt: string;
  styleId: string;
  genre: GenreCategory;
  modelId: string;
  cameraMotion: CameraMotion;
  aspectRatio: AspectRatio;
  durationSec: number;
  assetId: string;
  tags: string[];
}

export interface SingleGeneration {
  id: string;
  prompt: string;
  styleId: string;
  modelId: string;
  aspectRatio: AspectRatio;
  cameraMotion: CameraMotion;
  durationSec: number;
  mediaType?: 'video' | 'image';
  status: GenerationStatus;
  progress: number; // 0 to 100
  stageText: StageText;
  resultAssetId?: string;
  errorMessage?: string;
  createdAt: string; // ISO UTC
  isFavorite: boolean;
}

export interface StoryboardShot {
  id: string;
  shotNumber: 1 | 2 | 3;
  shotType: 'Wide Establishing' | 'Medium Subject' | 'Close-Up Detail';
  prompt: string;
  cameraMotion: CameraMotion;
  durationSec: number;
  status: GenerationStatus;
  progress: number;
  stageText?: StageText;
  resultAssetId?: string;
  locked?: boolean;
  errorMessage?: string;
}

export interface Storyboard {
  id: string;
  title: string;
  masterIdea: string;
  genre: GenreCategory;
  stylePresetId: string;
  aspectRatio: AspectRatio;
  shots: StoryboardShot[];
  status: GenerationStatus;
  createdAt: string;
  isFavorite: boolean;
}

export const STORAGE_SCHEMA_VERSION = 1;

export interface CineFlowStorageState {
  version: number;
  generationCount: number; // Session counter to guarantee 1st try success
  generations: SingleGeneration[];
  storyboards: Storyboard[];
  favorites: string[];
  activeDraft: {
    prompt: string;
    styleId: string;
    modelId: string;
    aspectRatio: AspectRatio;
    cameraMotion: CameraMotion;
  };
}
