import { describe, it, expect } from 'vitest';
import { 
  deconstructIdeaIntoShots, 
  rotateAssetForShot, 
  getAssetForShot, 
  getAssetsForGenre,
  formatStoryboardRecipe 
} from '../storyboardHelper';
import { STYLE_PRESETS } from '../../data/presets';
import { GenreCategory } from '../../types';

describe('3-Shot Storyboard Engine — Unit Tests', () => {
  // =========================================================================
  // TEST SUITE 1: Set Consistency & Strict Look (Fix 2)
  // =========================================================================
  describe('Set Consistency & Look Isolation', () => {
    it('should assign initial shots matching the selected style preset genre', () => {
      const neonStyle = STYLE_PRESETS.find(s => s.genre === 'neon_city')!;
      const shots = deconstructIdeaIntoShots('Cyberpunk rain skyline', neonStyle);

      expect(shots).toHaveLength(3);
      expect(shots[0].shotType).toBe('Wide Establishing');
      expect(shots[1].shotType).toBe('Medium Subject');
      expect(shots[2].shotType).toBe('Close-Up Detail');

      // Check all 3 assets belong to neon_city
      shots.forEach(shot => {
        const asset = getAssetForShot(shot, 'neon_city');
        expect(asset.genre).toBe('neon_city');
      });
    });

    it('must NEVER drift to other genres even if prompt text mentions other themes', () => {
      const alpineStyle = STYLE_PRESETS.find(s => s.genre === 'alpine_nature')!;
      const shots = deconstructIdeaIntoShots('A snowy mountain peak', alpineStyle);

      // Simulate a user aggressively editing the prompt with space / cyberpunk keywords
      const editedShot = {
        ...shots[0],
        prompt: 'Neon cybernetic spaceship fighting in deep space galaxy with laser beams',
      };

      // getAssetForShot with expectedGenre='alpine_nature' must stay in alpine_nature
      const asset = getAssetForShot(editedShot, 'alpine_nature');
      expect(asset.genre).toBe('alpine_nature');
      expect(asset.genre).not.toBe('neon_city');
      expect(asset.genre).not.toBe('deep_space');
    });

    it('should correctly isolate all 4 genres without cross-contamination', () => {
      const genres: GenreCategory[] = ['neon_city', 'alpine_nature', 'deep_space', 'macro_abstract'];
      
      genres.forEach(genre => {
        const assets = getAssetsForGenre(genre);
        expect(assets.length).toBeGreaterThanOrEqual(3);
        assets.forEach(a => {
          expect(a.genre).toBe(genre);
        });
      });
    });
  });

  // =========================================================================
  // TEST SUITE 2: Regeneration Variety & Never Same Output Twice (Fix 1)
  // =========================================================================
  describe('Regeneration Variety & Non-Repeating Output', () => {
    it('must rotate through clips in the set and NEVER return the same asset twice in a row', () => {
      const genre: GenreCategory = 'deep_space';
      const initialAssets = getAssetsForGenre(genre);
      let currentAssetId = initialAssets[0].id;

      // Rotate 6 times sequentially
      for (let i = 0; i < 6; i++) {
        const nextAsset = rotateAssetForShot(currentAssetId, genre, 'wide');
        
        // Assert it is NOT the same asset ID as the previous one
        expect(nextAsset.id).not.toBe(currentAssetId);
        expect(nextAsset.genre).toBe(genre);

        // Update currentAssetId for the next rotation
        currentAssetId = nextAsset.id;
      }
    });

    it('should cycle across all available variations within the genre pool', () => {
      const genre: GenreCategory = 'macro_abstract';
      const availableAssets = getAssetsForGenre(genre);
      const seenAssetIds = new Set<string>();

      let currentId = availableAssets[0].id;
      seenAssetIds.add(currentId);

      for (let i = 0; i < availableAssets.length * 2; i++) {
        const nextAsset = rotateAssetForShot(currentId, genre);
        expect(nextAsset.id).not.toBe(currentId);
        expect(nextAsset.genre).toBe(genre);
        seenAssetIds.add(nextAsset.id);
        currentId = nextAsset.id;
      }

      // Assert all assets in the genre pool were visited
      availableAssets.forEach(a => {
        expect(seenAssetIds.has(a.id)).toBe(true);
      });
    });
  });

  // =========================================================================
  // TEST SUITE 3: Stated Durations & Storyboard Recipe Formatting (Fix 3)
  // =========================================================================
  describe('Durations & Recipe Formatting', () => {
    it('should initialize each shot with a default duration and preserve custom durations', () => {
      const style = STYLE_PRESETS[0];
      const shots = deconstructIdeaIntoShots('Explorer in the desert', style);

      expect(shots[0].durationSec).toBe(5);
      expect(shots[1].durationSec).toBe(5);
      expect(shots[2].durationSec).toBe(5);

      // Custom duration
      shots[0].durationSec = 8;
      shots[1].durationSec = 3;
      expect(shots[0].durationSec).toBe(8);
      expect(shots[1].durationSec).toBe(3);
    });

    it('should format a complete 3-shot storyboard recipe for clipboard sharing', () => {
      const style = STYLE_PRESETS[0];
      const shots = deconstructIdeaIntoShots('Cyberpunk chase sequence', style);
      const recipe = formatStoryboardRecipe('Cyberpunk Chase', 'Cyberpunk chase sequence', style.name, shots);

      expect(recipe).toContain('🎬 CineFlow AI — 3-Shot Storyboard Recipe');
      expect(recipe).toContain('[Shot 1: Wide Establishing]');
      expect(recipe).toContain('[Shot 2: Medium Subject]');
      expect(recipe).toContain('[Shot 3: Close-Up Detail]');
      expect(recipe).toContain('Duration: 5s');
    });
  });
});
