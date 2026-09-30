# Asset Credits & Licensing Acknowledgements

CineFlow AI strictly adheres to open-source and free-license attribution rules. This document catalogs all media assets, their verified source URLs, and licensing terms.

---

## 1. Video Asset Catalog (`/public/samples/`)

All 12 video clips are sourced from Mixkit and verified for sequence coherence across 4 genres in 3-shot sequences (Wide Establishing, Medium Subject, Close-Up Detail).

### Genre 1: Neon City / Urban Noir
| Shot Type | Filename | WebP Poster | Mixkit Source URL | License |
| :--- | :--- | :--- | :--- | :--- |
| **Wide** | `neon-wide.mp4` | `neon-wide.webp` | [Mixkit: Futuristic City With Flying Cars](https://mixkit.co/free-stock-video/futuristic-city-with-flying-cars-at-night-42861/) | Mixkit Stock Video Free License |
| **Medium** | `neon-medium.mp4` | `neon-medium.webp` | [Mixkit: Man Walking In A Neon Lit Hallway](https://mixkit.co/free-stock-video/man-walking-in-a-neon-lit-hallway-42864/) | Mixkit Stock Video Free License |
| **Close-Up** | `neon-closeup.mp4` | `neon-closeup.webp` | [Mixkit: Hands Working On Computer At Night](https://mixkit.co/free-stock-video/hands-of-a-man-working-on-a-computer-at-night-42866/) | Mixkit Stock Video Free License |

### Genre 2: Alpine Nature / Wilderness
| Shot Type | Filename | WebP Poster | Mixkit Source URL | License |
| :--- | :--- | :--- | :--- | :--- |
| **Wide** | `alpine-wide.mp4` | `alpine-wide.webp` | [Mixkit: Aerial View Of Snow-Covered Mountains](https://mixkit.co/free-stock-video/aerial-view-of-snow-covered-mountains-42901/) | Mixkit Stock Video Free License |
| **Medium** | `alpine-medium.mp4` | `alpine-medium.webp` | [Mixkit: Trees In A Snowy Forest](https://mixkit.co/free-stock-video/trees-in-a-snowy-forest-42898/) | Mixkit Stock Video Free License |
| **Close-Up** | `alpine-closeup.mp4` | `alpine-closeup.webp` | [Mixkit: Drops Of Water On A Leaf](https://mixkit.co/free-stock-video/drops-of-water-on-a-leaf-in-slow-motion-42912/) | Mixkit Stock Video Free License |

### Genre 3: Deep Space / Desert Odyssey
| Shot Type | Filename | WebP Poster | Mixkit Source URL | License |
| :--- | :--- | :--- | :--- | :--- |
| **Wide** | `space-wide.mp4` | `space-wide.webp` | [Mixkit: View Of Planet Earth From Space](https://mixkit.co/free-stock-video/view-of-planet-earth-from-space-42888/) | Mixkit Stock Video Free License |
| **Medium** | `space-medium.mp4` | `space-medium.webp` | [Mixkit: Silhouette Of Person Looking At Sky](https://mixkit.co/free-stock-video/silhouette-of-a-person-looking-at-the-sky-42882/) | Mixkit Stock Video Free License |
| **Close-Up** | `space-closeup.mp4` | `space-closeup.webp` | [Mixkit: Flashing Laser Beams In The Dark](https://mixkit.co/free-stock-video/flashing-laser-beams-in-the-dark-42878/) | Mixkit Stock Video Free License |

### Genre 4: Macro Prism / Abstract
| Shot Type | Filename | WebP Poster | Mixkit Source URL | License |
| :--- | :--- | :--- | :--- | :--- |
| **Wide** | `macro-wide.mp4` | `macro-wide.webp` | [Mixkit: Colorful Ink Swirls In Water](https://mixkit.co/free-stock-video/colorful-ink-swirls-in-water-42930/) | Mixkit Stock Video Free License |
| **Medium** | `macro-medium.mp4` | `macro-medium.webp` | [Mixkit: Light Streaks Moving In Slow Motion](https://mixkit.co/free-stock-video/light-streaks-moving-in-slow-motion-42934/) | Mixkit Stock Video Free License |
| **Close-Up** | `macro-closeup.mp4` | `macro-closeup.webp` | [Mixkit: Glowing Lines In Kaleidoscope Style](https://mixkit.co/free-stock-video/glowing-lines-in-kaleidoscope-style-42938/) | Mixkit Stock Video Free License |

---

## 2. License Terms & Verification

### Mixkit Stock Video Free License
- **Permitted Uses:**
  > *"Items under the Mixkit Stock Video Free License can be used in personal and commercial video projects."*
- **Attribution Policy:**
  > *"Attribution is not required, but appreciated."*
- **Redistribution Policy & Repository Rule:**
  > *"What is not permitted: Resell or redistribute the item(s) as standalone stock files, or include the item(s) in a media library, application, or template for download as raw stock footage."*
  
  **Git Repository Compliance:**
  To comply strictly with the prohibition against redistributing raw standalone stock video binaries, `.mp4` video files are excluded via `.gitignore` while poster frames (`*.webp`) and SVG vector graphics are bundled in the repository. A automated python download/compression script is provided in `process_assets.py` for local development.

---

## 3. Inline Code-Generated Graphics
* **Procedural SVG Fallback Graphics:** All vector gradients, framing grids, and camera viewfinders are generated dynamically in code ([`src/data/assets.ts`](file:///d:/hackathon/cine_flow_ai/src/data/assets.ts)) to provide 100% offline resilience and instant rendering.

---

## 4. Third-Party Libraries & Fonts
* **Icons:** [Lucide Icons](https://lucide.dev/) (ISC License)
* **Build System & Framework:** [Vite](https://vitejs.dev/) (MIT License), [React](https://react.dev/) (MIT License), [Tailwind CSS](https://tailwindcss.com/) (MIT License)
* **Typography:** Native System Font Stack (`system-ui, -apple-system, sans-serif`) — zero external web fonts or CDN requests.
