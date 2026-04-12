'use client';

import { useState, useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timings = [
      { delay: 500, phase: 1 },
      { delay: 1800, phase: 2 },
      { delay: 3200, phase: 3 },
      { delay: 4500, phase: 4 },
    ];

    const timeouts = timings.map(({ delay, phase }) =>
      setTimeout(() => setPhase(phase), delay)
    );

    const exitTimeout = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 800);
    }, 5800);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'var(--plant-dark)',
        opacity,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Centered content */}
      <div className="relative text-center px-8">
        {/* Phase 0 → 1: Location */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          marginBottom: '16px',
        }}>
          <p className="font-mono text-sm tracking-widest" style={{ color: 'var(--saffron)' }}>
            ◈ AYODHYA, UTTAR PRADESH — INDIA
          </p>
        </div>

        {/* Phase 1 → 2: Name */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          marginBottom: '12px',
        }}>
          <h1 className="font-display" style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            color: 'var(--chalk)',
            lineHeight: 1,
            letterSpacing: '0.05em',
          }}>
            SUNDRAM
          </h1>
          <h1 className="font-display text-glow" style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            color: 'var(--saffron)',
            lineHeight: 1,
            letterSpacing: '0.1em',
          }}>
            YADAV
          </h1>
        </div>

        {/* Phase 2 → 3: Tagline */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          marginBottom: '32px',
        }}>
          <p className="font-chalk text-2xl md:text-3xl" style={{ color: 'var(--chalk-dim)' }}>
            Chemical & Biochemical Engineer · IIT Dharwad
          </p>
        </div>

        {/* Phase 3 → 4: Plant metaphor with loader ring */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Loader Ring */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader-ring" />
            <span style={{
              position: 'absolute',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px',
              color: 'var(--saffron)',
            }}>⚗️</span>
          </div>
          <p className="font-mono text-sm" style={{ color: 'var(--saffron)', letterSpacing: '0.2em' }}>
            INITIALIZING PLANT SYSTEMS...
          </p>
        </div>

        {/* Saffron decorative line */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: phase >= 4 ? '200px' : '0px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--saffron), transparent)',
          transition: 'width 1s ease',
          boxShadow: '0 0 10px var(--saffron)',
        }} />
      </div>

      {/* Corner decorations */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          width: 40,
          height: 40,
          border: '2px solid var(--saffron)',
          opacity: phase >= 1 ? 0.5 : 0,
          transition: 'opacity 0.5s ease',
          borderRadius: '2px',
          ...(pos.right !== undefined ? { borderLeft: 'none', borderBottom: 'none' } :
             pos.left !== undefined && pos.bottom !== undefined ? { borderRight: 'none', borderTop: 'none' } :
             pos.right !== undefined && pos.bottom !== undefined ? { borderLeft: 'none', borderTop: 'none' } :
             { borderRight: 'none', borderBottom: 'none' }),
        }} />
      ))}
    </div>
  );
}
