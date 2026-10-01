import { MediaAsset } from '../types';

/**
 * Creates an inline SVG data URI with beautiful gradient visuals and grid overlay
 * to guarantee 100% offline resilience and zero broken images.
 */
function createSvgFallback(title: string, shotType: string, color1: string, color2: string, color3: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="50%" stop-color="${color2}" />
        <stop offset="100%" stop-color="${color3}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="1280" height="720" fill="url(#grad)" />
    <rect width="1280" height="720" fill="url(#glow)" />
    <rect width="1280" height="720" fill="url(#grid)" />
    <g transform="translate(640, 360)">
      <circle r="90" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="8 6" opacity="0.6" />
      <circle r="40" fill="rgba(11,12,16,0.6)" stroke="#F59E0B" stroke-width="1.5" />
      <polygon points="-12,-18 20,0 -12,18" fill="#F59E0B" />
    </g>
    <rect x="40" y="40" width="220" height="36" rx="6" fill="rgba(11,12,16,0.8)" stroke="#262B3B" stroke-width="1" />
    <text x="56" y="63" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="1">CINEFLOW AI</text>
    <rect x="40" y="610" width="460" height="70" rx="8" fill="rgba(11,12,16,0.85)" stroke="#262B3B" stroke-width="1" />
    <text x="60" y="642" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="600">${title}</text>
    <text x="60" y="666" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">${shotType} • 24 FPS • 720p HD Master</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_ASSETS: MediaAsset[] = [
  // =========================================================================
  // GENRE 1: NEON CITY / URBAN NOIR (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-neon-wide',
    genre: 'neon_city',
    shotType: 'wide',
    title: 'Tour high above a city at dusk',
    videoUrl: '/samples/neon-wide.mp4',
    posterUrl: '/samples/neon-wide.webp',
    svgFallback: createSvgFallback('Tour high above a city at dusk', 'Wide Establishing', '#0f172a', '#3b0764', '#172554'),
    keywords: ['city', 'neon', 'skyline', 'cyberpunk', 'urban', 'night', 'dusk', 'metropolis', 'futuristic', 'tour', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-neon-medium',
    genre: 'neon_city',
    shotType: 'medium',
    title: 'Walking a big city walker at night',
    videoUrl: '/samples/neon-medium.mp4',
    posterUrl: '/samples/neon-medium.webp',
    svgFallback: createSvgFallback('Walking a big city walker at night', 'Medium Subject', '#1e1b4b', '#4c1d95', '#09090b'),
    keywords: ['character', 'walking', 'walker', 'cyberpunk', 'person', 'figure', 'neon', 'street', 'night', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/walking-a-big-city-walker-at-night-40640/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-neon-closeup',
    genre: 'neon_city',
    shotType: 'closeup',
    title: 'Full moon with a soft haze',
    videoUrl: '/samples/neon-closeup.mp4',
    posterUrl: '/samples/neon-closeup.webp',
    svgFallback: createSvgFallback('Full moon with a soft haze', 'Close-Up Detail', '#311042', '#701a75', '#0b0c10'),
    keywords: ['moon', 'haze', 'sky', 'night', 'clouds', 'glowing', 'cyberpunk', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/full-moon-with-a-soft-haze-4433/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 2: ALPINE NATURE / WILDERNESS (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-alpine-wide',
    genre: 'alpine_nature',
    shotType: 'wide',
    title: 'Sunset over a snowy winter mountain',
    videoUrl: '/samples/alpine-wide.mp4',
    posterUrl: '/samples/alpine-wide.webp',
    svgFallback: createSvgFallback('Sunset over a snowy winter mountain', 'Wide Establishing', '#082f49', '#0369a1', '#0f172a'),
    keywords: ['mountains', 'snow', 'alpine', 'nature', 'aerial', 'sunset', 'peaks', 'winter', 'landscape', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/sunset-over-a-snowy-winter-mountain-28844/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-alpine-medium',
    genre: 'alpine_nature',
    shotType: 'medium',
    title: 'Snow falling in a pine forest',
    videoUrl: '/samples/alpine-medium.mp4',
    posterUrl: '/samples/alpine-medium.webp',
    svgFallback: createSvgFallback('Snow falling in a pine forest', 'Medium Subject', '#064e3b', '#065f46', '#022c22'),
    keywords: ['trees', 'forest', 'pine', 'winter', 'snow', 'woods', 'nature', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/snow-falling-in-a-pine-forest-3352/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-alpine-closeup',
    genre: 'alpine_nature',
    shotType: 'closeup',
    title: 'Fog on the heights of the snowy mountains',
    videoUrl: '/samples/alpine-closeup.mp4',
    posterUrl: '/samples/alpine-closeup.webp',
    svgFallback: createSvgFallback('Fog on the heights of the snowy mountains', 'Close-Up Detail', '#134e4a', '#115e59', '#042f2e'),
    keywords: ['fog', 'mist', 'heights', 'snow', 'mountain', 'macro', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/fog-on-the-heights-of-the-snowy-mountains-4396/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 3: DEEP SPACE / DESERT ODYSSEY (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-space-wide',
    genre: 'deep_space',
    shotType: 'wide',
    title: "Video of the Earth slowly spinning on it's axis",
    videoUrl: '/samples/space-wide.mp4',
    posterUrl: '/samples/space-wide.webp',
    svgFallback: createSvgFallback("Video of the Earth slowly spinning on it's axis", 'Wide Establishing', '#450a0a', '#7f1d1d', '#18181b'),
    keywords: ['space', 'earth', 'planet', 'axis', 'orbit', 'globe', 'sci-fi', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/video-of-the-earth-slowly-spinning-on-its-axis-29351/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-space-medium',
    genre: 'deep_space',
    shotType: 'medium',
    title: 'Starry night in the desert',
    videoUrl: '/samples/space-medium.mp4',
    posterUrl: '/samples/space-medium.webp',
    svgFallback: createSvgFallback('Starry night in the desert', 'Medium Subject', '#78350f', '#92400e', '#0b0c10'),
    keywords: ['desert', 'stars', 'night', 'sky', 'sand', 'explorer', 'horizon', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/starry-night-in-the-desert-46119/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-space-closeup',
    genre: 'deep_space',
    shotType: 'closeup',
    title: 'Worm hole seen inside',
    videoUrl: '/samples/space-closeup.mp4',
    posterUrl: '/samples/space-closeup.webp',
    svgFallback: createSvgFallback('Worm hole seen inside', 'Close-Up Detail', '#713f12', '#b45309', '#020617'),
    keywords: ['wormhole', 'tunnel', 'lasers', 'hyperspace', 'energy', 'glowing', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/worm-hole-seen-inside-18791/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 4: MACRO / ABSTRACT PRISM (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-macro-wide',
    genre: 'macro_abstract',
    shotType: 'wide',
    title: 'Overhead view of a rocky coast and waves crashing',
    videoUrl: '/samples/macro-wide.mp4',
    posterUrl: '/samples/macro-wide.webp',
    svgFallback: createSvgFallback('Overhead view of a rocky coast and waves crashing', 'Wide Establishing', '#2e1065', '#581c87', '#172554'),
    keywords: ['abstract', 'coast', 'ocean', 'waves', 'water', 'crashing', 'aerial', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/overhead-view-of-a-rocky-coast-and-waves-crashing-51502/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-macro-medium',
    genre: 'macro_abstract',
    shotType: 'medium',
    title: 'Stars in space background',
    videoUrl: '/samples/macro-medium.mp4',
    posterUrl: '/samples/macro-medium.webp',
    svgFallback: createSvgFallback('Stars in space background', 'Medium Subject', '#042f2e', '#0f766e', '#1e1b4b'),
    keywords: ['stars', 'light', 'refraction', 'streaks', 'particles', 'space', 'glow', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/stars-in-space-background-1610/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-macro-closeup',
    genre: 'macro_abstract',
    shotType: 'closeup',
    title: 'Vertical video of blazing flames over a black backdrop',
    videoUrl: '/samples/macro-closeup.mp4',
    posterUrl: '/samples/macro-closeup.webp',
    svgFallback: createSvgFallback('Vertical video of blazing flames over a black backdrop', 'Close-Up Detail', '#3b0764', '#86198f', '#030712'),
    keywords: ['flames', 'fire', 'blazing', 'energy', 'heat', 'macro', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/vertical-video-of-blazing-flames-over-a-black-backdrop-52284/',
    license: 'Mixkit Stock Video Free License',
  },
];

/**
 * Finds the most relevant asset based on prompt keyword matching, style genre, and shot type.
 */
export function matchAssetForPrompt(prompt: string, genre: string, shotType: 'wide' | 'medium' | 'closeup' | 'standalone' = 'wide'): MediaAsset {
  const normalizedPrompt = prompt.toLowerCase();
  const words = normalizedPrompt.split(/\W+/).filter(w => w.length > 2);

  // First filter by genre to guarantee set consistency
  const genreAssets = SAMPLE_ASSETS.filter(a => a.genre === genre);
  const basePool = genreAssets.length > 0 ? genreAssets : SAMPLE_ASSETS;

  // Filter assets by shot type if possible, or fallback to base genre pool
  const candidates = basePool.filter(a => a.shotType === shotType || shotType === 'standalone');
  const pool = candidates.length > 0 ? candidates : basePool;

  let bestMatch: MediaAsset | null = null;
  let highestScore = -1;

  for (const asset of pool) {
    let score = 0;
    // Boost matching genre
    if (asset.genre === genre) {
      score += 5;
    }
    // Match keywords
    for (const kw of asset.keywords) {
      if (normalizedPrompt.includes(kw)) {
        score += 3;
      }
      for (const word of words) {
        if (kw === word) {
          score += 4;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = asset;
    }
  }

  // Fallback to first asset in pool or first sample asset
  return bestMatch || pool[0] || SAMPLE_ASSETS[0];
}
