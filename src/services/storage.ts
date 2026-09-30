import { CineFlowStorageState, SingleGeneration, Storyboard, STORAGE_SCHEMA_VERSION } from '../types';

const STORAGE_KEY = 'cineflow_ai_state_v1';

// Initial default state
const DEFAULT_STATE: CineFlowStorageState = {
  version: STORAGE_SCHEMA_VERSION,
  generationCount: 0,
  generations: [],
  storyboards: [],
  favorites: [],
  activeDraft: {
    prompt: '',
    styleId: 'neon-noir',
    modelId: 'cinemotion-v3',
    aspectRatio: '16:9',
    cameraMotion: 'static',
  },
};

// In-memory fallback if localStorage is blocked or unavailable
let memoryFallbackState: CineFlowStorageState = { ...DEFAULT_STATE };
let isStorageBlocked = false;

export const StorageService = {
  isBlocked(): boolean {
    return isStorageBlocked;
  },

  loadState(): CineFlowStorageState {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        isStorageBlocked = true;
        return memoryFallbackState;
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULT_STATE;
      }
      const parsed = JSON.parse(raw) as CineFlowStorageState;
      if (parsed && parsed.version === STORAGE_SCHEMA_VERSION) {
        isStorageBlocked = false;
        return parsed;
      }
      // Schema migration if version mismatch
      return {
        ...DEFAULT_STATE,
        ...parsed,
        version: STORAGE_SCHEMA_VERSION,
      };
    } catch (e) {
      console.warn('[CineFlow Storage] LocalStorage is blocked or inaccessible. Using in-memory store.', e);
      isStorageBlocked = true;
      return memoryFallbackState;
    }
  },

  saveState(state: CineFlowStorageState): boolean {
    memoryFallbackState = state;
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        isStorageBlocked = true;
        return false;
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      isStorageBlocked = false;
      return true;
    } catch (e) {
      console.warn('[CineFlow Storage] Failed writing to LocalStorage. Keeping in memory.', e);
      isStorageBlocked = true;
      return false;
    }
  },

  incrementGenerationCount(): number {
    const current = this.loadState();
    const newCount = (current.generationCount || 0) + 1;
    this.saveState({
      ...current,
      generationCount: newCount,
    });
    return newCount;
  },

  saveGeneration(generation: SingleGeneration): void {
    const current = this.loadState();
    const existingIndex = current.generations.findIndex(g => g.id === generation.id);
    let updatedGenerations: SingleGeneration[];

    if (existingIndex >= 0) {
      updatedGenerations = [...current.generations];
      updatedGenerations[existingIndex] = generation;
    } else {
      updatedGenerations = [generation, ...current.generations];
    }

    this.saveState({
      ...current,
      generations: updatedGenerations,
    });
  },

  deleteGeneration(id: string): void {
    const current = this.loadState();
    this.saveState({
      ...current,
      generations: current.generations.filter(g => g.id !== id),
      favorites: current.favorites.filter(favId => favId !== id),
    });
  },

  toggleFavorite(id: string): boolean {
    const current = this.loadState();
    const isFav = current.favorites.includes(id);
    const updatedFavorites = isFav
      ? current.favorites.filter(favId => favId !== id)
      : [...current.favorites, id];

    const updatedGenerations = current.generations.map(g =>
      g.id === id ? { ...g, isFavorite: !isFav } : g
    );

    const updatedStoryboards = current.storyboards.map(s =>
      s.id === id ? { ...s, isFavorite: !isFav } : s
    );

    this.saveState({
      ...current,
      favorites: updatedFavorites,
      generations: updatedGenerations,
      storyboards: updatedStoryboards,
    });

    return !isFav;
  },

  saveStoryboard(storyboard: Storyboard): void {
    const current = this.loadState();
    const existingIndex = current.storyboards.findIndex(s => s.id === storyboard.id);
    let updatedStoryboards: Storyboard[];

    if (existingIndex >= 0) {
      updatedStoryboards = [...current.storyboards];
      updatedStoryboards[existingIndex] = storyboard;
    } else {
      updatedStoryboards = [storyboard, ...current.storyboards];
    }

    this.saveState({
      ...current,
      storyboards: updatedStoryboards,
    });
  },

  deleteStoryboard(id: string): void {
    const current = this.loadState();
    this.saveState({
      ...current,
      storyboards: current.storyboards.filter(s => s.id !== id),
      favorites: current.favorites.filter(favId => favId !== id),
    });
  },

  clearAll(): void {
    this.saveState({
      ...DEFAULT_STATE,
    });
  }
};
