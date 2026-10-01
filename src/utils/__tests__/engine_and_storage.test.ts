import { describe, it, expect, beforeEach, vi } from 'vitest';
import { matchAssetForPrompt } from '../../data/assets';
import { StorageService } from '../../services/storage';
import { GenerationEngine, GenerationRequest } from '../../services/generationService';
import { SingleGeneration } from '../../types';

describe('1. Deterministic Asset Matching Engine', () => {
  it('should match neon city asset for cyberpunk keywords', () => {
    const prompt = 'Rain-slicked cyberpunk metropolis with neon skyline and flying cars';
    const asset1 = matchAssetForPrompt(prompt, 'neon_city', 'wide');
    const asset2 = matchAssetForPrompt(prompt, 'neon_city', 'wide');

    expect(asset1.genre).toBe('neon_city');
    expect(asset1.id).toBe('asset-neon-wide');
    // Determinism test
    expect(asset1.id).toBe(asset2.id);
  });

  it('should match alpine nature asset for snowy mountain keywords', () => {
    const prompt = 'Sunset over majestic snowy alpine mountain peaks and pine trees';
    const asset = matchAssetForPrompt(prompt, 'alpine_nature', 'wide');

    expect(asset.genre).toBe('alpine_nature');
    expect(asset.id).toBe('asset-alpine-wide');
  });

  it('should match deep space asset for planetary orbit keywords', () => {
    const prompt = 'Earth spinning slowly in space orbit with glowing planetary horizon';
    const asset = matchAssetForPrompt(prompt, 'deep_space', 'wide');

    expect(asset.genre).toBe('deep_space');
    expect(asset.id).toBe('asset-space-wide');
  });

  it('should match macro abstract asset for ocean waves keywords', () => {
    const prompt = 'Dramatic rocky coast with crashing ocean waves aerial view';
    const asset = matchAssetForPrompt(prompt, 'macro_abstract', 'wide');

    expect(asset.genre).toBe('macro_abstract');
    expect(asset.id).toBe('asset-macro-wide');
  });

  it('should gracefully fallback to genre asset when no keywords match', () => {
    const prompt = 'Unrelated mysterious abstract concept text xyz123';
    const asset = matchAssetForPrompt(prompt, 'neon_city', 'wide');

    expect(asset.genre).toBe('neon_city');
    expect(asset.id).toBeDefined();
  });
});

describe('2. Storage Service & Fallback Resilience', () => {
  beforeEach(() => {
    StorageService.clearAll();
  });

  it('should initialize with default state and schema version 1', () => {
    const state = StorageService.loadState();
    expect(state.version).toBe(1);
    expect(state.generations).toEqual([]);
    expect(state.storyboards).toEqual([]);
    expect(state.favorites).toEqual([]);
    expect(state.generationCount).toBe(0);
  });

  it('should save and retrieve single generation records', () => {
    const mockGen: SingleGeneration = {
      id: 'gen-test-1',
      prompt: 'A test neon street',
      styleId: 'neon-noir',
      modelId: 'cinemotion-v3',
      aspectRatio: '16:9',
      cameraMotion: 'pan_right',
      durationSec: 5,
      status: 'done',
      progress: 100,
      stageText: 'Completed',
      resultAssetId: 'asset-neon-wide',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    StorageService.saveGeneration(mockGen);
    const state = StorageService.loadState();
    expect(state.generations.length).toBe(1);
    expect(state.generations[0].id).toBe('gen-test-1');
    expect(state.generations[0].prompt).toBe('A test neon street');
  });

  it('should toggle favorite status across generations and favorites index', () => {
    const mockGen: SingleGeneration = {
      id: 'gen-test-fav',
      prompt: 'Favorite prompt',
      styleId: 'neon-noir',
      modelId: 'cinemotion-v3',
      aspectRatio: '16:9',
      cameraMotion: 'static',
      durationSec: 5,
      status: 'done',
      progress: 100,
      stageText: 'Completed',
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    StorageService.saveGeneration(mockGen);
    const isNowFav = StorageService.toggleFavorite('gen-test-fav');
    expect(isNowFav).toBe(true);

    let state = StorageService.loadState();
    expect(state.favorites).toContain('gen-test-fav');
    expect(state.generations[0].isFavorite).toBe(true);

    const isUnfav = StorageService.toggleFavorite('gen-test-fav');
    expect(isUnfav).toBe(false);

    state = StorageService.loadState();
    expect(state.favorites).not.toContain('gen-test-fav');
    expect(state.generations[0].isFavorite).toBe(false);
  });

  it('should delete generation and remove from favorites index', () => {
    const mockGen: SingleGeneration = {
      id: 'gen-to-delete',
      prompt: 'Delete me',
      styleId: 'neon-noir',
      modelId: 'cinemotion-v3',
      aspectRatio: '16:9',
      cameraMotion: 'static',
      durationSec: 5,
      status: 'done',
      progress: 100,
      stageText: 'Completed',
      createdAt: new Date().toISOString(),
      isFavorite: true,
    };

    StorageService.saveGeneration(mockGen);
    StorageService.toggleFavorite('gen-to-delete');
    StorageService.deleteGeneration('gen-to-delete');

    const state = StorageService.loadState();
    expect(state.generations.find(g => g.id === 'gen-to-delete')).toBeUndefined();
    expect(state.favorites).not.toContain('gen-to-delete');
  });
});

describe('3. Generation Engine Simulation & State Machine', () => {
  it('should create valid formatted job IDs', () => {
    const id1 = GenerationEngine.createJobId();
    const id2 = GenerationEngine.createJobId();
    expect(id1).toMatch(/^gen-/);
    expect(id2).toMatch(/^gen-/);
    expect(id1).not.toBe(id2);
  });

  it('should allow cancelling an in-flight simulated job', () => {
    const req: GenerationRequest = {
      prompt: 'Cancel test scene',
      styleId: 'neon-noir',
      modelId: 'cinemotion-v3',
      aspectRatio: '16:9',
      cameraMotion: 'pan_right',
      durationSec: 5,
    };

    const onProgress = vi.fn();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { jobId, cancel } = GenerationEngine.simulateGeneration(req, {
      onProgress,
      onSuccess,
      onError,
    });

    expect(jobId).toBeDefined();
    expect(typeof cancel).toBe('function');
    expect(onProgress).toHaveBeenCalledWith(0, 'Queued', 0);

    // Cancel immediately
    cancel();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
