# CineFlow AI — Cinematic Generative Video Studio

> **CineFlow AI** is a director-grade AI generative creative studio web application built with React 18, TypeScript, Vite, and TailwindCSS. It features an original **3-Shot Storyboard Engine** that deconstructs conceptual premises into synchronized multi-angle cinematic sequences, interactive 2D camera motion choreography, and a curated **Explore Showcase**.

---

## 🚀 Prototype Mode & Real vs. Simulated Architecture

CineFlow AI is a high-fidelity front-end prototype designed for rapid evaluation, zero cloud API costs, and instantaneous deterministic demonstrations.

### Real vs. Simulated Capabilities

| Feature / Subsystem | Real Implementation | Simulated Aspect | Rationale |
| :--- | :--- | :--- | :--- |
| **Studio & Storyboard UI** | **100% Real Code** (React 18 + TS + Tailwind) | None | Full responsive layout, state management, and interaction design. |
| **AI Image Generation** | **Real Live Generation** (via free third-party Pollinations.AI service) | Rate limits & queue spacing | Live AI generation based on user prompt, style words, aspect ratio, and seed with client-side rate-limit queue. |
| **Camera Motion Choreography** | **100% Real Client-Side CSS Motion** | 3D WebGL / GPU Video encoding | Looping 2D CSS transforms simulate camera motion (pan, tilt, orbit, dolly, zoom, handheld) over stills, honoring `prefers-reduced-motion`. |
| **Sample Video Clips** | **12 Royalty-Free HD Mixkit Clips + Posters** | Real-time AI Video Generation | Provides instant reference visuals and graceful fallback if live image generation is unavailable or times out. |
| **Media Playback & Auto-Advance** | **100% Real HTML5 Video & Master Player** | None | Continuous multi-shot reel playback with duration trimming and progress markers. |
| **Generation Queue & Lifecycle** | **Real Sequential Rate-Limited Queue** (`Queued` $\to$ `Waiting for your turn` $\to$ `Rendering` $\to$ `Finishing` $\to$ `Done`) | Background workers | Sequential 1-by-1 queue with 45s timeout protection and honest sample fallbacks. |
| **Storage & Creations Vault** | **100% Real Versioned `localStorage`** | Remote Cloud Database | Stores prompt, parameters, seed, and image URLs only (zero image data binaries in storage) with poster fallback. |

---

## ⚖️ What Was Left Out & Why (Deliberate Trade-Offs)

1. **Remote Cloud Diffusion Backend:** We intentionally avoided connecting to live third-party cloud diffusion APIs (such as Runway or Luma). This guarantees zero token costs, instant response times, and 100% deterministic test results for reviewers.
2. **Heavy 3D Viewport Gizmos:** We opted for high-performance 2D CSS transform viewfinders rather than Three.js / WebGL gizmos, keeping the production bundle footprint under 100 kB gzipped.
3. **User Authentication & Cloud Database:** We utilized client-side versioned `localStorage` with safe error boundaries and in-memory fallbacks instead of cloud authentication to ensure zero-setup instant evaluation.

---

## ✨ Core Features

1. **Cinematic Studio (`/`):** Single-shot prompt crafting with custom 2D camera motion simulations (Pan Right, Tilt Up, Orbit CW, Dolly In, Zoom In, Handheld), 6 style presets, and 4 specialized model tiers.
2. **3-Shot Storyboard Engine (`/storyboard` - Original Feature):** Deconstruct a narrative idea into a synchronized 3-shot sequence (`Wide Establishing`, `Medium Subject`, `Close-Up Detail`) with individual shot locking/regeneration, strict look isolation, duration trimming, and a continuous Master Theater player with auto-advance.
3. **Creations History Vault (`/history`):** Client-side persistence using versioned `localStorage` with real-time keyword search, filter chips (`All`, `Video`, `Image`, `Storyboard`, `Favorites`), 5-second undo toast, and an accessible focus-trapped detail modal.
4. **Explore Showcase (`/explore`):** Curated gallery of 12 director prompt recipes across 4 visual styles with one-click "Remix in Studio" and "Direct Storyboard" actions.
5. **Accessible & Responsive Design System:** WCAG AA compliant contrast ($\ge 4.5:1$), visible high-contrast focus rings, skip-to-content links, $\ge 44\text{px}$ touch targets, and `prefers-reduced-motion` compliance.

---

## 🛠️ Technology Stack

* **Framework:** React 18 + Vite + TypeScript
* **Styling:** TailwindCSS with bespoke Obsidian/Amber Gold cinematic design system
* **Icons:** `lucide-react`
* **Routing:** `react-router-dom` (with `vercel.json` SPA catch-all rewrites)
* **Testing:** `vitest` unit test suite (18 unit tests covering storyboard variety, state machine, and storage resilience)
* **Storage:** Versioned `localStorage` with safe try/catch error handling and in-memory fallback

---

## 📦 Getting Started Locally

```bash
# 1. Clone repository
git clone <repository-url>
cd cine_flow_ai

# 2. Install dependencies
npm install

# 3. Run automated unit tests
npm test

# 4. Start development server
npm run dev

# 5. Build production bundle
npm run build
```

---

## 📥 How to Fetch Sample Clips After Cloning

The repository includes committed lightweight WebP posters (`/public/samples/*.webp`) and dynamic vector SVG fallbacks so the app renders immediately upon cloning.

To download and optimize the 12 full 720p HD MP4 video clips into `/public/samples/`:

```bash
# Run the automated Python asset processor (requires Python 3.8+ and ffmpeg)
python process_assets.py
```

This script will:
1. Fetch all 12 verified sample clips from direct Mixkit CDN endpoints.
2. Transcode and optimize each clip with ffmpeg (`1280x720`, 24 FPS, `-an` no audio, H.264 CRF 24).
3. Verify that every file is strictly under 2 MB.

---

## 🌐 Deploying to Vercel

CineFlow AI includes an empty `.vercelignore` file and a `vercel.json` with SPA rewrites so that a direct CLI deployment includes all local MP4 media files in `/public/samples/` and handles deep-link routing seamlessly.

To deploy directly to Vercel:

```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy directly to production
npx vercel --prod
```

---

## 📜 Asset Attribution & License

All visual media assets utilized in this prototype are royalty-free public stock media licensed under Mixkit free licenses. Complete attribution URLs, original page titles, and license clauses are documented in [`CREDITS.md`](./CREDITS.md).
