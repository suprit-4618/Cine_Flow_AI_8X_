# CineFlow AI — Product Architecture & Specification Plan

## 1. Executive Summary & Core Philosophy

**CineFlow AI** is a professional-grade generative AI creative studio tailored for directors, filmmakers, and digital storytellers. It enables creators to conceptualize, direct, and sequence cinematic visuals through an intuitive single-shot studio and an original flagship **3-Shot Storyboard Engine**.

CineFlow AI operates as a high-fidelity client-side prototype. It delivers a rich, responsive interface with simulated generation pipelines, local persistence, deterministic prompt-to-asset semantic matching, and responsive playback across mobile, tablet, and desktop viewports.

---

## 2. Navigation Architecture & Screens

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CineFlow AI Studio Bar                          │
│  [Logo] CineFlow AI   ( Studio )  ( Storyboard )  ( History )  ( Explore )
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ Single-Shot  │           │ 3-Shot       │           │ My History   │
│ Studio       │           │ Storyboard   │           │ & Creations  │
├──────────────┤           ├──────────────┤           ├──────────────┤
│ • Prompt Bar │           │ • Idea Input │           │ • Search/Tag │
│ • Presets    │           │ • Wide / Med │           │ • Favorites  │
│ • Camera 2D  │           │   / Close-up │           │ • Fork Prompt│
│ • Simulation │           │ • Sequence   │           │ • Delete/Sort│
│   Queue      │           │   Player     │           │ • Detail View│
└──────────────┘           └──────────────┘           └──────────────┘
                                   │
                                   ▼ [Optional Phase]
                           ┌──────────────┐
                           │ Explore Feed │
                           ├──────────────┤
                           │ • Curated    │
                           │   Prompt Hub │
                           │ • "Remix" CTA│
                           └──────────────┘
```

### Screen Definitions:
1. **Home / Studio (`/` or tab `studio`):**
   * High-impact cinematic prompt workspace.
   * Model selector (CineMotion v3, RealisMax Alpha, AnimeForge).
   * Aspect Ratio toggle: `16:9` (Widescreen), `9:16` (Vertical/Social), `1:1` (Square).
   * Cinematic Style Presets (Neon Noir, Alpine Vista, Deep Space, Macro Prism, Cinematic Retro).
   * 2D CSS Camera Motion Picker (Static, Pan Right, Tilt Up, Orbit CW, Dolly In, Handheld).
   * Cost & Render Time Estimator (dynamic token calculation).
   * "Prototype mode: generation is simulated" indicator.
   * Generation Queue Drawer / Floating Progress Bar.

2. **3-Shot Storyboard (`/storyboard` or tab `storyboard`):**
   * Original Flagship Feature: Enter 1 overarching story premise $\to$ Generates a coherent 3-shot cinematic beat sheet (`Wide Shot`, `Medium Shot`, `Close-Up Shot`).
   * Per-shot prompt fine-tuning, camera angle override, and single-shot regeneration.
   * Drag/re-order sequence controls.
   * **Master Theater Player:** Seamless sequence playback that auto-advances through Shot 1 $\to$ Shot 2 $\to$ Shot 3 with visual shot markers, pause/play, and loop toggle.
   * "Copy Prompt Recipe" (copies JSON/text recipe) and Shareable URL parameter generation.

3. **My Creations / History (`/history` or tab `history`):**
   * Local library of all generated single shots and 3-shot storyboards.
   * Instant search by prompt text, filter by style/genre tag, and favorites toggle (`★`).
   * Quick action: "Remix / Fork into Studio" to preload parameters back into the editor.
   * Individual delete and "Clear All" with confirmation modal.

4. **Explore Feed (`/explore` or tab `explore`) [Optional / Cut candidate]:**
   * Curated gallery of exemplar cinematic prompts and outputs showcasing what CineFlow AI can produce.
   * "Use Prompt & Settings" button to jumpstart user creations.

---

## 3. Data Model & TypeScript Schemas

```typescript
// ==========================================
// 1. Core Model Definitions
// ==========================================

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type CameraMotion = 'static' | 'pan_right' | 'tilt_up' | 'orbit_cw' | 'dolly_in' | 'handheld';

export type GenreCategory = 'neon_city' | 'alpine_nature' | 'deep_space' | 'macro_abstract';

export type GenerationStatus = 'idle' | 'queued' | 'rendering' | 'done' | 'failed';

export interface ModelPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  baseCost: number; // in credits/tokens
  renderTimeSec: number;
}

export interface StylePreset {
  id: string;
  name: string;
  genre: GenreCategory;
  description: string;
  promptSuffix: string;
  gradientBg: string;
}

// ==========================================
// 2. Asset & Mock Store
// ==========================================

export interface MediaAsset {
  id: string;
  genre: GenreCategory;
  shotType: 'wide' | 'medium' | 'closeup' | 'standalone';
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  svgFallback: string; // inline SVG markup / data URI for 100% offline resilience
  keywords: string[];
  author: string;
  sourceUrl: string;
  license: string;
}

// ==========================================
// 3. Generation & Storyboard Entities
// ==========================================

export interface SingleGeneration {
  id: string;
  prompt: string;
  styleId: string;
  modelId: string;
  aspectRatio: AspectRatio;
  cameraMotion: CameraMotion;
  durationSec: number;
  status: GenerationStatus;
  progress: number; // 0 - 100
  stageText: 'Queued' | 'Rendering' | 'Finishing' | 'Completed' | 'Error';
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
  status: GenerationStatus;
  progress: number;
  resultAssetId?: string;
}

export interface Storyboard {
  id: string;
  title: string;
  masterIdea: string;
  genre: GenreCategory;
  aspectRatio: AspectRatio;
  shots: StoryboardShot[];
  status: GenerationStatus;
  createdAt: string;
  isFavorite: boolean;
}

// ==========================================
// 4. LocalStorage Schema & Versioning
// ==========================================

export const STORAGE_SCHEMA_VERSION = 1;

export interface CineFlowStorageState {
  version: number;
  generations: SingleGeneration[];
  storyboards: Storyboard[];
  favorites: string[]; // array of generation/storyboard IDs
  activeDraft: {
    prompt: string;
    styleId: string;
    modelId: string;
    aspectRatio: AspectRatio;
    cameraMotion: CameraMotion;
  };
}
```

---

## 4. Simulation State Machine & Deterministic Asset Matcher

### State Machine Lifecycle
```
[User Clicks Generate]
        │
        ▼
   ( QUEUED ) ── Duration: 1.5s – 2.5s (UI badge: "Queued in render queue #2")
        │
        ▼
  ( RENDERING ) ── Duration: 4.0s – 6.0s (Progress updates 0% -> 95% at 50ms intervals)
        │
   [Failure Check: 10% Probability]
   ├── (YES 10%) ──► ( FAILED )  [State: 'failed', displays Retry CTA + Diagnostic]
   │
   └── (NO 90%)  ──► ( FINISHING ) ── Duration: 0.8s (Progress: 95% -> 100%)
                           │
                           ▼
                      ( COMPLETED ) [Result matched to asset, persisted to localStorage]
```

### Prompt-Aware Keyword Asset Matcher Algorithm:
1. Normalize prompt string (lowercase, tokenize into keywords).
2. Compute keyword intersection score against `MediaAsset.keywords`.
3. If matches found: pick highest-scoring asset matching the requested `genre` and `shotType`.
4. If no keywords match: select the default archetype asset for the currently chosen `StylePreset.genre`.
5. Every asset contains an instantaneous code-rendered **gradient SVG canvas fallback**, guaranteeing the app never displays a broken image icon even if offline or before external video assets load.

---

## 5. CineFlow Design System (Warm Cinematic Theme)

### Color Palette (WCAG AA Compliant $\ge$ 4.5:1 Contrast)
* **Background (`bg-obsidian`):** `#0B0C10` (Deep obsidian dark)
* **Surface 1 (`bg-surface-dark`):** `#14161E` (Warm charcoal panel)
* **Surface 2 (`bg-surface-raised`):** `#1E222D` (Card & modal background)
* **Surface Hover (`bg-surface-hover`):** `#282D3C` (Interactive hover state)
* **Border Subdued (`border-cine-subtle`):** `#262B3B`
* **Border Highlight (`border-cine-amber`):** `#D97706` / `#F59E0B` (Cinematic amber glow)
* **Accent Primary (`text-amber-gold` / `bg-amber-gold`):** `#F59E0B` (Amber gold primary accent)
* **Accent Glow:** `#D97706` (Deep warm amber)
* **Text High-Contrast (`text-primary`):** `#F8FAFC` (Slate 50 — **14.8:1 contrast on Obsidian**)
* **Text Secondary (`text-muted`):** `#94A3B8` (Slate 400 — **5.8:1 contrast on Obsidian**)
* **Text Tertiary (`text-dim`):** `#64748B` (Slate 500 — used only for non-text borders/icons)
* **Status Success:** `#10B981` (Emerald 500)
* **Status Danger / Error:** `#EF4444` (Rose 500)
* **Status Queued / Info:** `#3B82F6` (Electric Blue 500)

### Typography Scale (Zero External CDN Dependency)
* **Font Family (Headings):** System modern geometric sans (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
* **Font Family (Body & Code):** Clean legible UI sans + Monospace for token/cost badges (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`)
* **Scale:**
  * Display: `32px / 2rem`, font-weight 700, letter-spacing `-0.025em`
  * H1 / Title: `24px / 1.5rem`, font-weight 600
  * H2 / Section: `18px / 1.125rem`, font-weight 600
  * Body Standard: `14px / 0.875rem`, line-height `1.5`
  * Caption / Badge: `12px / 0.75rem`, font-weight 500, uppercase tracking `0.05em`

### Spacing, Radii & Interaction Tokens
* **Touch Targets:** Strictly $\ge 44\text{px} \times 44\text{px}$ on all interactive controls.
* **Border Radii:** `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-full` (pills).
* **Motion & Transitions:**
  * Fast micro-interactions: `150ms ease-out`
  * Camera preview transforms: `300ms cubic-bezier(0.16, 1, 0.3, 1)`
  * Accessible motion: Enforce `@media (prefers-reduced-motion: reduce) { transition: none !important; animation: none !important; }`

---

## 6. Folder Structure & Component Architecture

```
cine_flow_ai/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── CREDITS.md
├── CAPTURE-TEST.md
├── PLAN.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts                 # TypeScript data contracts & schemas
│   ├── context/
│   │   ├── StudioContext.tsx        # Global store for generations, storyboards, active jobs
│   │   └── LocalStorageManager.ts   # Safe try/catch storage wrapper with migrations
│   ├── data/
│   │   ├── presets.ts               # Model tiers, style presets, genre mappings
│   │   ├── sampleAssets.ts          # Matched video/poster assets + inline SVG fallbacks
│   │   └── defaultPrompts.ts        # Starter prompts & inspiration ideas
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # App brand, navigation tabs, prototype badge
│   │   │   └── Footer.tsx           # Status, credits, shortcut legend
│   │   ├── studio/
│   │   │   ├── PromptBox.tsx        # High-res textarea, randomize, enhance pill
│   │   │   ├── StyleSelector.tsx    # Visual style cards with gradient thumbs
│   │   │   ├── ModelPicker.tsx      # Model engine selection & token cost breakdown
│   │   │   ├── AspectRatioPicker.tsx# 16:9, 9:16, 1:1 selector
│   │   │   ├── CameraWidget.tsx     # 2D CSS live camera motion preview
│   │   │   └── GenerateButton.tsx   # Primary CTA with compute estimate badge
│   │   ├── storyboard/
│   │   │   ├── StoryboardCreator.tsx# Narrative idea breakdown form
│   │   │   ├── ShotCard.tsx         # Single shot card (Wide, Medium, Close-up)
│   │   │   ├── MasterPlayer.tsx     # Continuous 3-shot sequence theater player
│   │   │   └── RecipeExporter.tsx   # Copy prompt recipe & URL share builder
│   │   ├── history/
│   │   │   ├── HistoryGrid.tsx      # Searchable, filterable gallery
│   │   │   ├── CreationCard.tsx     # Preview card with playback, remix, favorite
│   │   │   └── DetailModal.tsx      # Full-size inspection & prompt extraction modal
│   │   ├── explore/
│   │   │   └── ExploreFeed.tsx      # Curated showcase cards [Optional]
│   │   └── common/
│   │       ├── PrototypeBadge.tsx   # Transparent disclaimer badge
│   │       ├── ProgressBar.tsx      # Multi-stage progress indicator
│   │       ├── Toast.tsx            # Success/error feedback system
│   │       └── EmptyState.tsx       # Polished zero-data illustrations
```

---

## 7. Build Order, Time Allocation & Cut Strategy

| Phase | Milestone | Est. Time | Deliverables & Verification |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundation & Design System** | 1.5 hrs | Scaffold Vite + React + TS + Tailwind. Configure tokens, layout shell, header, nav tabs, `STORAGE_SCHEMA_VERSION` store, and SVG fallback asset generator. |
| **Phase 2** | **Single-Shot Studio** | 2.5 hrs | Build prompt bar, style presets, aspect ratio picker, model switcher, compute calculator, and the 2D CSS camera motion preview widget. |
| **Phase 3** | **Simulation State Pipeline** | 1.5 hrs | Implement `idle` $\to$ `queued` $\to$ `rendering` $\to$ `done`/`failed` state machine, progress animation, 10% failure retry loop, and semantic keyword matcher. |
| **Phase 4** | **3-Shot Storyboard Engine** | 2.5 hrs | Build story beat decomposer, 3-shot list (Wide/Med/Close), per-shot regeneration, and the Master Theater auto-advance sequence player. |
| **Phase 5** | **Creations History & Storage** | 1.5 hrs | Filterable gallery, prompt remix/forking, favoriting, deletion, and shareable URL query param parser. |
| **Phase 6** | **Explore Feed & Final Polish** | 1.0 hr | Add curated explore cards, test keyboard accessibility & 44px tap targets, run build audit, and finalize `CREDITS.md`. |
| **Total** | | **~10.5 hrs** | |

### Strategic Cut Order (If Time Runs Short):
1. **Cut 1 (First to drop):** Explore Community Feed $\to$ Keep focus on Studio, Storyboard, and History.
2. **Cut 2:** Advanced camera motion speed slider $\to$ Keep fixed 2D preset animations.
3. **Cut 3:** URL query-string share link generation $\to$ Rely on clipboard "Copy Prompt Recipe".
4. **Never Cut (Protected Core):** Studio Prompting, 3-Shot Storyboard sequence player, Simulation Pipeline with retry, History persistence with favoriting.

---

## 8. Asset Sourcing & Fallback Architecture

### 4 Balanced Genre Sets (3-Shot Matched Sequences):
1. **Neon City / Urban Noir:**
   * Shot 1 (Wide): Rain-slicked cyber-city skyline with neon billboards.
   * Shot 2 (Medium): Cyberpunk protagonist walking in rain alleyway.
   * Shot 3 (Close-Up): Neon reflection in protagonist's sunglasses.
2. **Alpine Nature / Wilderness:**
   * Shot 1 (Wide): Majestic snow-covered alpine mountain range at sunrise.
   * Shot 2 (Medium): Pine forest canopy dusted with fresh snow.
   * Shot 3 (Close-Up): Macro frost crystal melting on an evergreen needle.
3. **Deep Space / Desert Odyssey:**
   * Shot 1 (Wide): Alien crimson desert under dual planetary rings.
   * Shot 2 (Medium): Astronaut surveying desolate crimson dunes.
   * Shot 3 (Close-Up): Visor HUD reflection displaying telemetry readings.
4. **Macro / Abstract Prism:**
   * Shot 1 (Wide): Geometric light refractions across obsidian fluid.
   * Shot 2 (Medium): Chromatic aberration ripples pulsing with soundwaves.
   * Shot 3 (Close-Up): Microscopic kaleidoscopic crystal geometry.

### Asset Safety & Licensing Policy:
* All sample video and image links use free-license assets with exact attribution URLs cataloged in `CREDITS.md`.
* **Zero-Failure SVG Fallback Engine:** Every sample asset includes an integrated SVG/Canvas mathematical shader fallback, ensuring zero UI breakage if network requests fail or when running completely offline.

---

## 9. Deliberate Out-of-Scope Declarations (What We Are Not Building)

To ensure maximum craftsmanship and zero bloat within our target timeframe, the following are explicitly out of scope:
1. **No Backend or Real Cloud GPU Inferencing:** Generation is honestly simulated client-side.
2. **No User Authentication / Login Walls:** All state is local, private, and stored in the user's browser via versioned `localStorage`.
3. **No Paid API / Stripe Billing Gates:** Mock token counters are educational and demonstrable without credit card requirements.
4. **No Multi-Track Timeline NLE Video Editor:** Sequence playback is handled via the clean, dedicated auto-advancing **Master Theater Player**.
5. **No Social Comment Threads / Follower Networks:** Focus remains on director-grade creation tools.
