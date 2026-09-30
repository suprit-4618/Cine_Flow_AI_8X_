# Asset Credits & Licensing Acknowledgements

CineFlow AI strictly adheres to open-source and free-license attribution rules. This document catalogs all media assets, their verified source URLs, and licensing terms.

---

## 1. Video Asset Catalog (`/public/samples/`)

All 12 video clips are sourced from Mixkit and verified for sequence coherence across 4 genres in 3-shot sequences (Wide Establishing, Medium Subject, Close-Up Detail).

### Genre 1: Neon City / Urban Noir
| Shot Type | Filename | WebP Poster | Confirmed Mixkit Source Page & Real Title | License | Size | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wide** | `neon-wide.mp4` | `neon-wide.webp` | [Tour high above a city at dusk](https://mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/) | Mixkit Stock Video Free License | 0.42 MB | 8.01s |
| **Medium** | `neon-medium.mp4` | `neon-medium.webp` | [Walking a big city walker at night](https://mixkit.co/free-stock-video/walking-a-big-city-walker-at-night-40640/) | Mixkit Stock Video Free License | 0.55 MB | 8.01s |
| **Close-Up** | `neon-closeup.mp4` | `neon-closeup.webp` | [Full moon with a soft haze](https://mixkit.co/free-stock-video/full-moon-with-a-soft-haze-4433/) | Mixkit Stock Video Free License | 0.24 MB | 8.00s |

### Genre 2: Alpine Nature / Wilderness
| Shot Type | Filename | WebP Poster | Confirmed Mixkit Source Page & Real Title | License | Size | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wide** | `alpine-wide.mp4` | `alpine-wide.webp` | [Sunset over a snowy winter mountain](https://mixkit.co/free-stock-video/sunset-over-a-snowy-winter-mountain-28844/) | Mixkit Stock Video Free License | 0.99 MB | 8.01s |
| **Medium** | `alpine-medium.mp4` | `alpine-medium.webp` | [Snow falling in a pine forest](https://mixkit.co/free-stock-video/snow-falling-in-a-pine-forest-3352/) | Mixkit Stock Video Free License | 1.11 MB | 8.00s |
| **Close-Up** | `alpine-closeup.mp4` | `alpine-closeup.webp` | [Fog on the heights of the snowy mountains](https://mixkit.co/free-stock-video/fog-on-the-heights-of-the-snowy-mountains-4396/) | Mixkit Stock Video Free License | 1.25 MB | 8.00s |

### Genre 3: Deep Space / Desert Odyssey
| Shot Type | Filename | WebP Poster | Confirmed Mixkit Source Page & Real Title | License | Size | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wide** | `space-wide.mp4` | `space-wide.webp` | [Video of the Earth slowly spinning on it's axis](https://mixkit.co/free-stock-video/video-of-the-earth-slowly-spinning-on-its-axis-29351/) | Mixkit Stock Video Free License | 0.44 MB | 8.00s |
| **Medium** | `space-medium.mp4` | `space-medium.webp` | [Starry night in the desert](https://mixkit.co/free-stock-video/starry-night-in-the-desert-46119/) | Mixkit Stock Video Free License | 0.95 MB | 8.00s |
| **Close-Up** | `space-closeup.mp4` | `space-closeup.webp` | [Worm hole seen inside](https://mixkit.co/free-stock-video/worm-hole-seen-inside-18791/) | Mixkit Stock Video Free License | 1.61 MB | 8.00s |

### Genre 4: Macro Prism / Abstract
| Shot Type | Filename | WebP Poster | Confirmed Mixkit Source Page & Real Title | License | Size | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wide** | `macro-wide.mp4` | `macro-wide.webp` | [Overhead view of a rocky coast and waves crashing](https://mixkit.co/free-stock-video/overhead-view-of-a-rocky-coast-and-waves-crashing-51502/) | Mixkit Stock Video Free License | 1.92 MB | 8.01s |
| **Medium** | `macro-medium.mp4` | `macro-medium.webp` | [Stars in space background](https://mixkit.co/free-stock-video/stars-in-space-background-1610/) | Mixkit Stock Video Free License | 1.33 MB | 8.00s |
| **Close-Up** | `macro-closeup.mp4` | `macro-closeup.webp` | [Vertical video of blazing flames over a black backdrop](https://mixkit.co/free-stock-video/vertical-video-of-blazing-flames-over-a-black-backdrop-52284/) | Mixkit Stock Video Free License | 1.39 MB | 8.00s |

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
  To comply strictly with the prohibition against redistributing raw standalone stock video binaries, `.mp4` video files are excluded via `.gitignore` while poster frames (`*.webp`) and SVG vector graphics are bundled in the repository. An automated Python download/compression script is provided in `process_assets.py` for local development and CLI deployment.

---

## 3. Inline Code-Generated Graphics
* **Procedural SVG Fallback Graphics:** All vector gradients, framing grids, and camera viewfinders are generated dynamically in code ([`src/data/assets.ts`](file:///d:/hackathon/cine_flow_ai/src/data/assets.ts)) to provide 100% offline resilience and instant rendering.

---

## 4. Third-Party Libraries & Fonts
* **Icons:** [Lucide Icons](https://lucide.dev/) (ISC License)
* **Build System & Framework:** [Vite](https://vitejs.dev/) (MIT License), [React](https://react.dev/) (MIT License), [Tailwind CSS](https://tailwindcss.com/) (MIT License)
* **Typography:** Native System Font Stack (`system-ui, -apple-system, sans-serif`) — zero external web fonts or CDN requests.
