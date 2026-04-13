'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { plantUnits, reactions, PlantUnit } from './plantData';
import UnitModal from './UnitModal';
import PlantSVG from './PlantSVG';
import IntroScreen from './IntroScreen';
import FloatingParticles from './FloatingParticles';
import dynamic from 'next/dynamic';

// Lazy-load 3D scene (Three.js doesn't SSR)
const ReactorScene3D = dynamic(() => import('./ReactorScene3D'), { ssr: false });

// ─── Ripple hook ──────────────────────────────────────────────────────────────
function useRipple() {
  const triggerRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.classList.remove('rippling');
    void el.offsetWidth; // reflow
    el.classList.add('rippling');
    const onEnd = () => { el.classList.remove('rippling'); el.removeEventListener('animationend', onEnd); };
    el.addEventListener('animationend', onEnd);
  }, []);
  return triggerRipple;
}

// ─── Scroll Reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Parallax hook ────────────────────────────────────────────────────────────
function useParallax() {
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      document.querySelectorAll<HTMLElement>('.parallax-slow').forEach((el) => {
        el.style.transform = `translateY(${sy * 0.08}px)`;
      });
      document.querySelectorAll<HTMLElement>('.parallax-fast').forEach((el) => {
        el.style.transform = `translateY(${sy * -0.05}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export default function PlantPortfolio() {
  const [selectedUnit, setSelectedUnit] = useState<PlantUnit | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [plantVisible, setPlantVisible] = useState(false);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(true);
  const triggerRipple = useRipple();
  useScrollReveal();
  useParallax();

  // Prevent background scrolling when modal is open or intro is showing
  useEffect(() => {
    if (selectedUnit || showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedUnit, showIntro]);


  const handleIntroComplete = () => {
    setShowIntro(false);
    setTimeout(() => setPlantVisible(true), 300);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--plant-dark)' }}>
      <FloatingParticles />

      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', width: '100%', height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.15), transparent)',
          animation: 'scanline 8s linear infinite',
        }} />
      </div>

      {/* Intro Screen */}
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      {/* Main Content */}
      <div
        className="relative"
        style={{
          opacity: plantVisible ? 1 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 2,
        }}
      >
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4" style={{
          background: 'linear-gradient(180deg, rgba(8,8,16,0.95) 0%, transparent 100%)',
          backdropFilter: 'blur(4px)',
        }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl md:text-2xl" style={{ color: 'var(--saffron)', letterSpacing: '0.1em' }}>
                SUNDRAM YADAV
              </h1>
              <p className="font-chalk text-sm" style={{ color: 'var(--chalk-dim)' }}>
                Chemical & Biochemical Eng · IIT Dharwad · Ayodhya, UP
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6 font-mono text-xs" style={{ color: 'var(--chalk-dim)' }}>
              <span style={{ color: 'var(--saffron)' }}>◉</span> PLANT OPERATIONAL
              <span className="opacity-50">|</span>
              <span>UNITS: {plantUnits.length}</span>
              <span className="opacity-50">|</span>
              <span>REACTIONS: {reactions.length}</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-10">
          <div className="text-center mb-12 animate-fadeInUp parallax-fast">
            <p className="font-mono text-xs mb-4 tracking-widest" style={{ color: 'var(--saffron)' }}>
              ◈ PROCESS FLOW DIAGRAM — LIFE v2.026 ◈
            </p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6" style={{
              color: 'var(--chalk)',
              lineHeight: 1.1,
            }}>
              My Life is a{' '}
              <span className="text-glow" style={{ color: 'var(--saffron)' }}>
                Chemical Plant
              </span>
            </h2>
            <p className="font-chalk text-xl md:text-2xl max-w-2xl mx-auto" style={{ color: 'var(--chalk-dim)', lineHeight: 1.6 }}>
              Every milestone is a processing unit. Every struggle is a reaction.
              The output? Still being refined. Click a vessel to explore.
            </p>
          </div>

          {/* Toggle 3D / SVG */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setShow3D(true)}
              className="glow-btn font-mono text-xs px-4 py-2 rounded-lg"
              style={{
                background: show3D ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.05)',
                border: `1px solid ${show3D ? 'rgba(255,107,0,0.7)' : 'rgba(255,107,0,0.2)'}`,
                color: show3D ? 'var(--saffron)' : 'var(--chalk-dim)',
                cursor: 'pointer',
              }}
            >
              ⬡ 3D VIEW
            </button>
            <button
              onClick={() => setShow3D(false)}
              className="glow-btn font-mono text-xs px-4 py-2 rounded-lg"
              style={{
                background: !show3D ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.05)',
                border: `1px solid ${!show3D ? 'rgba(255,107,0,0.7)' : 'rgba(255,107,0,0.2)'}`,
                color: !show3D ? 'var(--saffron)' : 'var(--chalk-dim)',
                cursor: 'pointer',
              }}
            >
              ◎ DIAGRAM VIEW
            </button>
          </div>

          {/* 3D Reactor Scene */}
          {show3D && (
            <div className="w-full max-w-5xl shimmer-scan" style={{ position: 'relative' }}>
              <ReactorScene3D units={plantUnits} onUnitClick={setSelectedUnit} />
            </div>
          )}

          {/* SVG Diagram (classic) */}
          {!show3D && (
            <PlantSVG
              units={plantUnits}
              reactions={reactions}
              onUnitClick={setSelectedUnit}
              hoveredUnit={hoveredUnit}
              onUnitHover={setHoveredUnit}
            />
          )}


        </section>

        {/* About Section with Photo */}
        <section className="py-20 px-4 md:px-8" style={{ borderTop: '1px solid rgba(255,107,0,0.15)' }}>
          <div className="max-w-5xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl text-center mb-16 scroll-reveal" style={{ color: 'var(--saffron)' }}>
              The Engineer Behind The Plant
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Photo */}
              <div className="relative flex-shrink-0 scroll-reveal">
                <div style={{
                  width: 240,
                  height: 300,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,107,0,0.6)',
                  boxShadow: '0 0 40px rgba(255,107,0,0.25), 0 0 80px rgba(255,107,0,0.1)',
                  position: 'relative',
                }}>
                  <img
                    src="/sundram.png"
                    alt="Sundram Yadav"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
                    background: 'linear-gradient(to top, rgba(8,8,16,0.7), transparent)',
                  }} />
                </div>
                <div style={{
                  position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(8,8,16,0.95)', border: '1px solid rgba(255,107,0,0.5)',
                  borderRadius: '20px', padding: '6px 16px', whiteSpace: 'nowrap',
                  boxShadow: '0 0 20px rgba(255,107,0,0.2)',
                }}>
                  <p className="font-mono text-xs" style={{ color: 'var(--saffron)' }}>◉ IIT DHARWAD · 2025</p>
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 max-w-lg scroll-reveal delay-2">
                <p className="font-mono text-xs mb-2 tracking-widest" style={{ color: 'var(--saffron)' }}>
                  ◈ ENGINEER PROFILE
                </p>
                <h4 className="font-display text-3xl mb-4" style={{ color: 'var(--chalk)' }}>
                  Sundram Yadav
                </h4>
                <p className="font-chalk text-lg leading-relaxed mb-6" style={{ color: 'var(--chalk-dim)' }}>
                  From Ayodhya, UP — a city of ancient legacy — to IIT Dharwad batch of 2025.
                  Chemical & Biochemical Engineering student with a deep love for software,
                  AI systems, and building things that matter.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'ORIGIN', value: 'Ayodhya, UP', accent: '◈' },
                    { label: 'INSTITUTE', value: 'IIT Dharwad', accent: '◈' },
                    { label: 'BRANCH', value: 'Chem. & Biochem. Eng.', accent: '◈' },
                    { label: 'BATCH', value: '2025', accent: '◈' },
                    { label: 'HACKATHONS', value: '5+ events', accent: '◈' },
                    { label: 'PROJECTS', value: '10+ participated', accent: '◈' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg" style={{
                      background: 'rgba(255,107,0,0.05)',
                      border: '1px solid rgba(255,107,0,0.15)',
                    }}>
                      <span className="font-mono" style={{ color: 'var(--saffron)', fontSize: '0.75rem', flexShrink: 0 }}>{item.accent}</span>
                      <div>
                        <p className="font-mono" style={{ fontSize: '9px', color: 'rgba(245,240,232,0.4)' }}>{item.label}</p>
                        <p className="font-chalk text-sm" style={{ color: 'var(--chalk)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Social Links */}
                <div className="flex flex-wrap gap-2">
                  <a href="https://github.com/sundram-yadav" target="_blank" rel="noopener noreferrer"
                    className="glow-btn font-mono text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.35)', color: 'var(--saffron)' }}>
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/sundram-yadav-755a0a386" target="_blank" rel="noopener noreferrer"
                    className="glow-btn font-mono text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(10,102,194,0.12)', border: '1px solid rgba(10,102,194,0.35)', color: '#4A9FE0' }}>
                    LinkedIn
                  </a>
                  <a href="mailto:sundramyadav751@gmail.com"
                    className="glow-btn font-mono text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', color: '#00D4AA' }}>
                    Email
                  </a>
                  <span className="font-mono text-xs px-3 py-2 rounded-lg" style={{
                    background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)', color: '#00D4AA',
                  }}>
                    ◉ Open to Opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl text-center mb-16 scroll-reveal" style={{ color: 'var(--saffron)' }}>
              Reaction Log
            </h3>
            <div className="relative">
              {/* Vertical pipe */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{
                background: 'linear-gradient(180deg, transparent, var(--saffron), var(--saffron-light), var(--saffron), transparent)',
                transform: 'translateX(-50%)',
              }} />

              {reactions.map((reaction, i) => {
                const fromUnit = plantUnits.find(u => u.id === reaction.from);
                const toUnit = plantUnits.find(u => u.id === reaction.to);
                return (
                  <div key={i} className={`relative mb-16 flex items-start scroll-reveal delay-${Math.min(i + 1, 5)}`} style={{
                    flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  }}>
                    <div className="w-1/2 px-8" style={{ textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                      <div className="chalkboard p-4 rounded-lg inline-block" style={{
                        borderColor: `rgba(255, 107, 0, 0.4)`,
                        animationDelay: `${i * 0.1}s`,
                      }}>
                        <p className="font-mono text-xs mb-2" style={{ color: 'var(--saffron)' }}>
                          {fromUnit?.subtitle} → {toUnit?.subtitle}
                        </p>
                        <p className="reaction-eq text-lg mb-3" style={{ color: 'var(--chalk)' }}>
                          {reaction.equation}
                        </p>
                        <p className="font-chalk text-sm italic" style={{ color: 'var(--chalk-dim)' }}>
                          "{reaction.quote}"
                        </p>
                      </div>
                    </div>
                    {/* Center dot */}
                    <div className="absolute left-1/2 top-4 w-4 h-4 rounded-full transform -translate-x-1/2 saffron-glow"
                      style={{ background: 'var(--saffron)', zIndex: 2 }} />
                    <div className="w-1/2" />
                  </div>
                );
              })}

              {/* Current reaction */}
              <div className="relative flex justify-center scroll-reveal">
                <div className="absolute left-1/2 top-4 w-4 h-4 rounded-full transform -translate-x-1/2"
                  style={{ background: '#00FF88', boxShadow: '0 0 20px #00FF88', zIndex: 2, animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                <div className="chalkboard p-6 rounded-lg text-center max-w-md" style={{ borderColor: 'rgba(0, 255, 136, 0.4)' }}>
                  <p className="font-mono text-xs mb-2" style={{ color: '#00FF88' }}>● LIVE REACTION — APRIL 2026</p>
                  <p className="reaction-eq text-xl mb-2" style={{ color: 'var(--chalk)' }}>
                    Ayodhya + Navodaya + IIT → Sundram 2.0
                  </p>
                  <p className="font-chalk text-sm" style={{ color: 'var(--chalk-dim)' }}>
                    "From a small city with a big dream — the reaction is exothermic, and far from complete."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Units Grid */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl text-center mb-4 scroll-reveal" style={{ color: 'var(--saffron)' }}>
              Processing Units
            </h3>
            <p className="font-chalk text-lg text-center mb-16 scroll-reveal delay-1" style={{ color: 'var(--chalk-dim)' }}>
              Click any unit for full specs, story & projects
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantUnits.map((unit, i) => (
                <button
                  key={unit.id}
                  className={`unit-card ripple-btn chalkboard rounded-xl p-6 text-left cursor-pointer scroll-reveal delay-${Math.min(i + 1, 5)}`}
                  style={{
                    borderColor: unit.color,
                    animationDelay: `${i * 0.1}s`,
                  }}
                  onClick={(e) => { triggerRipple(e); setSelectedUnit(unit); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{unit.icon}</span>
                    <span className="font-mono text-xs px-2 py-1 rounded" style={{
                      background: `${unit.color}22`,
                      color: unit.color,
                      border: `1px solid ${unit.color}44`,
                    }}>
                      {unit.period}
                    </span>
                  </div>
                  <h4 className="font-display text-lg mb-1" style={{ color: unit.color }}>
                    {unit.title}
                  </h4>
                  <p className="font-mono text-xs mb-4" style={{ color: 'var(--chalk-dim)' }}>
                    {unit.subtitle}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'TEMP', value: unit.temperature },
                      { label: 'PRES', value: unit.pressure },
                      { label: 'YIELD', value: unit.yield?.split(':')[1]?.trim() || '∞' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="font-mono text-xs" style={{ color: 'var(--chalk-dim)', fontSize: '9px' }}>{stat.label}</p>
                        <p className="font-mono text-xs font-bold" style={{ color: unit.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="progress-bar rounded-full" style={{
                    background: `linear-gradient(90deg, ${unit.color}, ${unit.glowColor})`,
                  }} />
                  {/* Project count badge */}
                  {unit.projects && unit.projects.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-mono" style={{ color: unit.color, fontSize: '10px' }}>◆</span>
                      <span className="font-mono" style={{ fontSize: '9px', color: 'var(--chalk-dim)' }}>
                        {unit.projects.length} PROJECT{unit.projects.length > 1 ? 'S' : ''} INSIDE
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 text-center border-t" style={{ borderColor: 'rgba(255,107,0,0.2)' }}>
          <p className="font-display text-2xl mb-1" style={{ color: 'var(--saffron)' }}>
            Sundram Yadav
          </p>
          <p className="font-chalk text-base mb-6" style={{ color: 'var(--chalk-dim)' }}>
            Chemical & Biochemical Engineering · IIT Dharwad · Batch 2025 · Ayodhya, UP
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-mono text-xs mb-4" style={{ color: 'var(--chalk-dim)' }}>
            <a href="https://github.com/sundram-yadav" target="_blank" rel="noopener noreferrer"
              className="glow-btn px-3 py-1.5 rounded" style={{ color: 'var(--saffron)', border: '1px solid rgba(255,107,0,0.3)' }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/sundram-yadav-755a0a386" target="_blank" rel="noopener noreferrer"
              className="glow-btn px-3 py-1.5 rounded" style={{ color: '#4A9FE0', border: '1px solid rgba(10,102,194,0.3)' }}>
              LinkedIn
            </a>
            <a href="mailto:sundramyadav751@gmail.com"
              className="glow-btn px-3 py-1.5 rounded" style={{ color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)' }}>
              sundramyadav751@gmail.com
            </a>
          </div>
          <p className="font-chalk text-sm" style={{ color: 'rgba(255,107,0,0.4)' }}>
            "The plant is still running. Yield: improving."
          </p>
        </footer>
      </div>

      {/* Unit Detail Modal */}
      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </div>
  );
}
