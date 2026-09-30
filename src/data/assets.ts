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
    title: 'Rain-Slicked Metropolis Skyline',
    videoUrl: '/samples/neon-wide.mp4',
    posterUrl: '/samples/neon-wide.webp',
    svgFallback: createSvgFallback('Rain-Slicked Metropolis Skyline', 'Wide Establishing', '#0f172a', '#3b0764', '#172554'),
    keywords: ['city', 'neon', 'skyline', 'cyberpunk', 'urban', 'night', 'rain', 'metropolis', 'futuristic', 'car', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/futuristic-city-with-flying-cars-at-night-42861/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-neon-medium',
    genre: 'neon_city',
    shotType: 'medium',
    title: 'Cyberpunk Wanderer in Alleyway',
    videoUrl: '/samples/neon-medium.mp4',
    posterUrl: '/samples/neon-medium.webp',
    svgFallback: createSvgFallback('Cyberpunk Wanderer in Alleyway', 'Medium Subject', '#1e1b4b', '#4c1d95', '#09090b'),
    keywords: ['character', 'walking', 'alley', 'cyberpunk', 'person', 'figure', 'neon', 'street', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/man-walking-in-a-neon-lit-hallway-42864/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-neon-closeup',
    genre: 'neon_city',
    shotType: 'closeup',
    title: 'Cyber Technology HUD Interface',
    videoUrl: '/samples/neon-closeup.mp4',
    posterUrl: '/samples/neon-closeup.webp',
    svgFallback: createSvgFallback('Cyber Technology HUD Interface', 'Close-Up Detail', '#311042', '#701a75', '#0b0c10'),
    keywords: ['sunglasses', 'reflection', 'eyes', 'face', 'cyberpunk', 'glasses', 'glitch', 'hud', 'computer', 'keyboard', 'hands', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/hands-of-a-man-working-on-a-computer-at-night-42866/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 2: ALPINE NATURE / WILDERNESS (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-alpine-wide',
    genre: 'alpine_nature',
    shotType: 'wide',
    title: 'Sunrise Over Snow-Capped Peaks',
    videoUrl: '/samples/alpine-wide.mp4',
    posterUrl: '/samples/alpine-wide.webp',
    svgFallback: createSvgFallback('Sunrise Over Snow-Capped Peaks', 'Wide Establishing', '#082f49', '#0369a1', '#0f172a'),
    keywords: ['mountains', 'snow', 'alpine', 'nature', 'aerial', 'drone', 'peaks', 'sunrise', 'landscape', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/aerial-view-of-snow-covered-mountains-42901/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-alpine-medium',
    genre: 'alpine_nature',
    shotType: 'medium',
    title: 'Pine Forest in Winter Fog',
    videoUrl: '/samples/alpine-medium.mp4',
    posterUrl: '/samples/alpine-medium.webp',
    svgFallback: createSvgFallback('Pine Forest in Winter Fog', 'Medium Subject', '#064e3b', '#065f46', '#022c22'),
    keywords: ['trees', 'forest', 'pine', 'winter', 'fog', 'woods', 'nature', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/trees-in-a-snowy-forest-42898/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-alpine-closeup',
    genre: 'alpine_nature',
    shotType: 'closeup',
    title: 'Frost Crystal on Pine Needle',
    videoUrl: '/samples/alpine-closeup.mp4',
    posterUrl: '/samples/alpine-closeup.webp',
    svgFallback: createSvgFallback('Frost Crystal on Pine Needle', 'Close-Up Detail', '#134e4a', '#115e59', '#042f2e'),
    keywords: ['ice', 'crystal', 'frost', 'leaf', 'needle', 'water', 'macro', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/drops-of-water-on-a-leaf-in-slow-motion-42912/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 3: DEEP SPACE / DESERT ODYSSEY (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-space-wide',
    genre: 'deep_space',
    shotType: 'wide',
    title: 'Crimson Dunes Under Planetary Rings',
    videoUrl: '/samples/space-wide.mp4',
    posterUrl: '/samples/space-wide.webp',
    svgFallback: createSvgFallback('Crimson Dunes Under Planetary Rings', 'Wide Establishing', '#450a0a', '#7f1d1d', '#18181b'),
    keywords: ['space', 'desert', 'planet', 'rings', 'alien', 'mars', 'dunes', 'crimson', 'sci-fi', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/view-of-planet-earth-from-space-42888/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-space-medium',
    genre: 'deep_space',
    shotType: 'medium',
    title: 'Astronaut Surveying Horizon',
    videoUrl: '/samples/space-medium.mp4',
    posterUrl: '/samples/space-medium.webp',
    svgFallback: createSvgFallback('Astronaut Surveying Horizon', 'Medium Subject', '#78350f', '#92400e', '#0b0c10'),
    keywords: ['astronaut', 'explorer', 'silhouette', 'space suit', 'surveying', 'horizon', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/silhouette-of-a-person-looking-at-the-sky-42882/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-space-closeup',
    genre: 'deep_space',
    shotType: 'closeup',
    title: 'Space Helmet Visor Telemetry HUD',
    videoUrl: '/samples/space-closeup.mp4',
    posterUrl: '/samples/space-closeup.webp',
    svgFallback: createSvgFallback('Space Helmet Visor Telemetry HUD', 'Close-Up Detail', '#713f12', '#b45309', '#020617'),
    keywords: ['hud', 'visor', 'helmet', 'lasers', 'telemetry', 'reflection', 'glowing', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/flashing-laser-beams-in-the-dark-42878/',
    license: 'Mixkit Stock Video Free License',
  },

  // =========================================================================
  // GENRE 4: MACRO / ABSTRACT PRISM (Matched 3-Shot Set)
  // =========================================================================
  {
    id: 'asset-macro-wide',
    genre: 'macro_abstract',
    shotType: 'wide',
    title: 'Prismatic Fluid Waves in Motion',
    videoUrl: '/samples/macro-wide.mp4',
    posterUrl: '/samples/macro-wide.webp',
    svgFallback: createSvgFallback('Prismatic Fluid Waves in Motion', 'Wide Establishing', '#2e1065', '#581c87', '#172554'),
    keywords: ['abstract', 'prism', 'ink', 'fluid', 'waves', 'color', 'swirl', 'spectrum', 'wide', 'establishing'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/colorful-ink-swirls-in-water-42930/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-macro-medium',
    genre: 'macro_abstract',
    shotType: 'medium',
    title: 'Chromatic Light Refraction Ripple',
    videoUrl: '/samples/macro-medium.mp4',
    posterUrl: '/samples/macro-medium.webp',
    svgFallback: createSvgFallback('Chromatic Light Refraction Ripple', 'Medium Subject', '#042f2e', '#0f766e', '#1e1b4b'),
    keywords: ['light', 'refraction', 'streaks', 'prism', 'chromatic', 'glow', 'medium', 'subject'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/light-streaks-moving-in-slow-motion-42934/',
    license: 'Mixkit Stock Video Free License',
  },
  {
    id: 'asset-macro-closeup',
    genre: 'macro_abstract',
    shotType: 'closeup',
    title: 'Kaleidoscopic Crystal Geometry',
    videoUrl: '/samples/macro-closeup.mp4',
    posterUrl: '/samples/macro-closeup.webp',
    svgFallback: createSvgFallback('Kaleidoscopic Crystal Geometry', 'Close-Up Detail', '#3b0764', '#86198f', '#030712'),
    keywords: ['crystal', 'geometry', 'kaleidoscope', 'lines', 'particles', 'macro', 'close-up', 'detail', 'closeup'],
    author: 'Mixkit Free Stock Video',
    sourceUrl: 'https://mixkit.co/free-stock-video/glowing-lines-in-kaleidoscope-style-42938/',
    license: 'Mixkit Stock Video Free License',
  },
];

/**
 * Finds the most relevant asset based on prompt keyword matching, style genre, and shot type.
 */
export function matchAssetForPrompt(prompt: string, genre: string, shotType: 'wide' | 'medium' | 'closeup' | 'standalone' = 'wide'): MediaAsset {
  const normalizedPrompt = prompt.toLowerCase();
  const words = normalizedPrompt.split(/\W+/).filter(w => w.length > 2);

  // Filter assets by shot type if possible, or fallback to any
  const candidates = SAMPLE_ASSETS.filter(a => a.shotType === shotType || shotType === 'standalone');
  const pool = candidates.length > 0 ? candidates : SAMPLE_ASSETS;

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
