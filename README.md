# CineFlow AI — Cinematic Generative Video Studio

> **CineFlow AI** is a director-grade AI generative creative studio built with React, TypeScript, Vite, and TailwindCSS. It features an original **3-Shot Storyboard Engine** that transforms conceptual premises into synchronized multi-angle cinematic sequences.

---

## 🚀 Prototype Disclaimer

**Notice: Generation is simulated.**  
CineFlow AI operates entirely client-side for rapid prototyping, zero cloud billing friction, and instantaneous deterministic demonstrations. All generation states (`Queued` $\to$ `Rendering` $\to$ `Finishing` $\to$ `Completed`) use a simulated queue pipeline powered by curated, high-fidelity royalty-free video stock assets and procedural SVG fallbacks.

---

## ✨ Core Features

1. **Cinematic Studio:** Single-shot prompt crafting with custom 2D camera motion simulations (Pan, Tilt, Orbit, Dolly, Handheld Shake), 6 style presets, and 4 specialized model tiers.
2. **3-Shot Storyboard Engine (Original Feature):** Deconstruct a narrative idea into a synchronized 3-shot sequence (`Wide Establishing`, `Medium Subject`, `Close-Up Detail`) with individual shot regeneration and a continuous master theater player.
3. **Creations History Vault:** Client-side persistence using versioned `localStorage` with search, style filtering, favoriting, and prompt forking/remixing.
4. **Accessible & Responsive Design System:** WCAG AA compliant contrast ($\ge 4.5:1$), visible high-contrast focus rings, skip-to-content links, $\ge 44\text{px}$ touch targets, and `prefers-reduced-motion` support.

---

## 🛠️ Technology Stack

* **Framework:** React 18 + Vite + TypeScript
* **Styling:** TailwindCSS with bespoke Obsidian/Amber Gold cinematic design system
* **Icons:** `lucide-react`
* **Routing:** `react-router-dom`
* **Storage:** Versioned `localStorage` with safe try/catch error handling

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## 📜 Asset Attribution & License

All visual media assets utilized in this prototype are royalty-free public stock media licensed under Mixkit and Pexels free licenses. Complete attribution URLs and license specifications are documented in [`CREDITS.md`](./CREDITS.md).
