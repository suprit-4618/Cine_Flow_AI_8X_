# CineFlow AI — Cinematic Generative Video Studio

> **CineFlow AI** is a director-grade AI generative creative studio built with React, TypeScript, Vite, and TailwindCSS. It features an original **3-Shot Storyboard Engine** that transforms conceptual premises into synchronized multi-angle cinematic sequences, plus custom 2D camera motion controls and an **Explore Showcase**.

---

## 🚀 Prototype Disclaimer

**Notice: Generation is simulated.**  
CineFlow AI operates entirely client-side for rapid prototyping, zero cloud billing friction, and instantaneous deterministic demonstrations. All generation states (`Queued` $\to$ `Rendering` $\to$ `Finishing` $\to$ `Completed`) use a simulated queue pipeline powered by curated, high-fidelity royalty-free video stock assets and procedural SVG fallbacks.

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

# 4. Fetch and optimize video sample clips (Downloads 12 MP4 clips into /public/samples/)
python process_assets.py

# 5. Start development server
npm run dev

# 6. Build production bundle
npm run build
```

> **Note on Assets:** The repository includes committed lightweight WebP posters (`/public/samples/*.webp`) and dynamic vector SVG fallbacks so the app renders immediately even before downloading the `.mp4` video clips.

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
