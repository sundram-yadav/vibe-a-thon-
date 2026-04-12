# 🏭 Sundram Yadav — The Living Plant

> *My life is a chemical plant. Every milestone is a processing unit. Every struggle is a reaction.*

**[Vibe-a-thon 2025 | The Coding Club | IIT Dharwad]**

---

## 🎯 Concept

A cinematic, fully interactive portfolio where **my life is visualized as a chemical plant**. Each major milestone (school, NCC, JEE, IIT, hackathons) becomes a **processing unit** — reactors, distillation towers, separators, heat exchangers. The connections between them are **reaction equations** with motivational quotes.

The entire journey from **Class 8 NCC induction in Ayodhya → IIT Dharwad Semester 2 hackathons** is mapped as a live Process Flow Diagram.

---

## 🚀 Getting Started

```bash
cd vibe-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Components Replicated (from Drive)

| Drive Component | Replicated As | Where |
|---|---|---|
| **Home page scroll / Homepage** | Cinematic intro screen + scroll-triggered reveals | `IntroScreen.tsx`, `PlantPortfolio.tsx` |
| **Hover buttons** | Unit cards with 3D hover lift + glow effect | `.unit-card` CSS + `PlantSVG.tsx` |
| **Loader** | Animated plant steam particles + pulsing live indicator | `FloatingParticles.tsx`, `PlantSVG.tsx` |
| **Toggle / Carousel** | Click-to-reveal modal with staggered achievement animations | `UnitModal.tsx` |
| **Ripple / Peak animation** | Animated SVG pipe flow with moving dash-offset | `PlantSVG.tsx` |
| **Parallax animation** | CSS grid background + floating saffron particles | `globals.css`, `FloatingParticles.tsx` |
| **Scroll and pop up** | Achievement items animate in with slide+fade on modal open | `UnitModal.tsx` |

---

## 🏗️ Plant Units (My Life Milestones)

1. **Pre-Reaction Vessel** — Class 8, NCC Induction (~2019)
2. **Separation Column A** — Class 10, St. Xavier's 91%, NCC A Certificate (2021)
3. **High-Pressure Reactor** — Class 12, JEE Prep, Board 90% (2023)
4. **Feed Stream** — IIT Dharwad Admission, Chemical & Biochemical Engineering (2023)
5. **Distillation Tower α** — Semester 1, CGPA 8+, SleeplessCodingSaga 3.0 Rank 1 (2023–24)
6. **Multi-Effect Evaporator β** — Semester 2, NSS + 6 Hackathons + Coding Club (2024–25)

---

## ⚗️ Reaction Equations (Between Units)

```
Discipline + Time → A Certificate + 91%
Curiosity + JEE Motivation → ΔH = -∞ (Exothermic)
Effort² + Ayodhya Pride → IIT Rank
New Environment + Hunger → CGPA 8+ + Rank 1
1st Win + Confidence → ∑(Hackathons) → Growth
```

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SVG animations** (custom, no library)
- **CSS keyframe animations** (particles, scanlines, steam, flow)
- **Google Fonts**: Caveat (chalkboard), Special Elite (display), Share Tech Mono

---

## 🎨 Design Decisions

- **Saffron (#FF6B00)** — From Ayodhya, my roots
- **Dark industrial background** — Chemical plant aesthetic
- **Chalkboard fonts** — Engineering notebook vibes
- **Isometric SVG plant diagram** — The centerpiece
- **Cinematic intro** — Establishes the narrative before anything is clickable

---

## 🤖 AI Usage

See `AI_USAGE.md` for full prompt log.

Key AI contributions:
- Architecture brainstorming: "Life as a chemical plant" concept refinement
- SVG unit shape generation for each equipment type
- CSS animation keyframes for steam, flow, particles
- Chalkboard equation styling
- Modal stagger animation timing

---

## 👤 About Me

**Sundram Yadav** | Chemical & Biochemical Engineering | IIT Dharwad | Batch 2023  
From **Ayodhya, Uttar Pradesh** 🕌  
GitHub: [@sundram-yadav](https://github.com/sundram-yadav)

*"The plant is still running. Yield: improving."*
