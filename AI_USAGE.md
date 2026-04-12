# AI Usage Document — Vibe-a-thon 2026

**Team:** Sundram Yadav (Solo)  
**Project:** The Living Plant — Life as a Chemical Plant Portfolio  
**Date:** April 12, 2026

---

## AI Tools Used

- **Antigravity (Google Deepmind)** — Primary AI coding agent; architect, code generator, and creative partner throughout the entire build
- **Gemini** — Brainstorming taglines, motivational quotes, creative direction

---

## Components Implemented (from Vibe-a-thon Drive Link)

| Component | Where Used |
|---|---|
| **3js component** | `ReactorScene3D.tsx` — Full 3D WebGL reactor scene with @react-three/fiber |
| **Animated loader** | `IntroScreen.tsx` — Dual spinning ring loader animation |
| **Hover buttons** | `.glow-btn` CSS class — gradient glow on hover across all buttons |
| **Parallax animation** | `useParallax()` hook — hero text scrolls at different depth layers |
| **Ripple effect** | `useRipple()` hook + `.ripple-btn` — click ripple on all unit cards |
| **Scroll and pop up** | `useScrollReveal()` hook + `.scroll-reveal` — intersection observer fade-in on all sections |
| **Shimmer scan** | `.shimmer-scan` — light sweep effect on the 3D canvas container |

---

## Key Prompts Used

### 1. Concept Development
**Prompt:**
> "I want to make a portfolio for a hackathon. I'm a Chemical Engineering student at IIT Dharwad from Ayodhya. My idea is — my life is a chemical plant. Each milestone (NCC, Class 10, 12, JEE, IIT, hackathons) is a processing unit. The connections are reaction equations. Make this into a Next.js web app with 3D-ish SVG plant diagram, saffron color theme, chalkboard fonts, cinematic intro. Here are all my milestones: [provided full biography]"

**What AI did:**
- Mapped each milestone to a chemical equipment type (reactor, tower, separator, etc.)
- Designed the temperature/pressure/yield metaphor for each unit
- Created the Process Flow Diagram architecture

---

### 2. 3D Reactor Scene
**Prompt:**
> "Replace the SVG diagram with an interactive Three.js 3D scene using @react-three/fiber. Each milestone should be a different 3D industrial vessel — cylinder for reactor, torus-knot for evaporator, octahedron for compressor, capsule for separator, sphere for tank, tall cylinder for tower. Add floating animation, glow auras, orbital rings, steam particles, and a slow auto-orbiting camera. Make it clickable to open the unit modal."

**What AI did:**
- Built `ReactorScene3D.tsx` with MeshDistortMaterial, Float, canvas, fog
- Created per-type 3D vessel shapes with distinct silhouettes
- Added steam particle simulation using Three.js BufferGeometry

---

### 3. 6 Vibe-a-thon Effects
**Prompt:**
> "Add these 6 effects from the Vibe-a-thon component list: 1) Ripple effect on card clicks, 2) Scroll reveal with intersection observer, 3) Parallax depth on hero text, 4) Magnetic hover glow on cards, 5) Animated loader ring for intro, 6) Hover button glow with gradient border. Add a toggle between 3D and classic SVG view."

---

### 4. SVG Plant Diagram
**Prompt:**
> "Build a SVG-based isometric chemical plant diagram where each unit is clickable. Use animated dashed lines for pipes showing flow direction. Add steam particle animation for reactors and towers. Units should glow on hover. Make it feel like a real P&ID (Process & Instrumentation Diagram)."

---

### 5. Unit Modal with Projects
**Prompt:**
> "When user clicks a plant unit, show a modal. Inside, add a 'PROJECTS BUILT THIS SEMESTER' section with expandable project cards. Each card shows: name, tech stack pills, description, key highlights, awards, and a GitHub link. Cards expand/collapse on click."

---

### 6. Debugging (hydration mismatch)
**Prompt:**
> "The Three.js component causes hydration mismatch in Next.js 14 because it uses browser APIs. How do I fix this?"

**AI solution:** Wrapped `ReactorScene3D` in `dynamic(() => import('./ReactorScene3D'), { ssr: false })`

---

## Estimated AI Contribution

| Area | AI % |
|---|---|
| Component architecture | 70% |
| 3D scene (Three.js) | 90% |
| SVG shapes & animations | 85% |
| CSS animations & keyframes | 80% |
| Data/content (my life story) | 0% (100% me) |
| Concept & creative direction | 20% (collaborated) |
| Color/font choices | 10% (AI suggested, I chose) |

---

*"The best prompts don't ask AI to think for you. They ask AI to build what you already see in your head."*
