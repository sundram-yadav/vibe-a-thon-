'use client';

import { useEffect, useState } from 'react';
import { PlantUnit, ProjectItem } from './plantData';

interface UnitModalProps {
  unit: PlantUnit;
  onClose: () => void;
}

function ProjectCard({ project, color }: { project: ProjectItem; color: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl p-4 mb-3 cursor-pointer"
      style={{
        background: `${color}0D`,
        border: `1px solid ${color}33`,
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.6rem' }}>{project.emoji}</span>
          <div>
            <p className="font-display text-sm" style={{ color }}>{project.name}</p>
            {project.award && (
              <p className="font-mono text-xs mt-0.5" style={{ color: '#FFB700' }}>
                {project.award}
              </p>
            )}
            {project.role && (
              <p className="font-mono text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.45)' }}>
                {project.role}
              </p>
            )}
          </div>
        </div>
        <span style={{ color, fontFamily: 'monospace', fontSize: '0.75rem', flexShrink: 0 }}>
          {expanded ? '▲ CLOSE' : '▼ DETAILS'}
        </span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${color}22` }}>
          <p className="font-chalk text-sm mb-3" style={{ color: 'rgba(245,240,232,0.8)', lineHeight: 1.6 }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tech.map(t => (
              <span key={t} className="font-mono text-xs px-2 py-0.5 rounded-full" style={{
                background: `${color}22`,
                border: `1px solid ${color}33`,
                color,
              }}>{t}</span>
            ))}
          </div>
          <div className="space-y-1">
            {project.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <span style={{ color, fontFamily: 'monospace', flexShrink: 0, marginTop: '2px' }}>›</span>
                <p className="font-chalk text-sm" style={{ color: 'rgba(245,240,232,0.75)' }}>{h}</p>
              </div>
            ))}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 font-mono text-xs px-3 py-1 rounded"
              style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
              onClick={e => e.stopPropagation()}
            >
              → GitHub Repo
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function UnitModal({ unit, onClose }: UnitModalProps) {
  const [visible, setVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const timers = unit.achievements.map((_, i) =>
      setTimeout(() => {
        setAchievementsVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 300 + i * 120)
    );
    return () => {
      clearTimeout(t1);
      timers.forEach(clearTimeout);
    };
  }, [unit]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{
        background: 'rgba(8, 8, 16, 0.9)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl chalkboard"
        style={{
          borderColor: unit.color,
          borderWidth: '2px',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(30px)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: `0 0 60px ${unit.glowColor}, 0 0 120px ${unit.glowColor.replace('0.5', '0.15')}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{
          background: `linear-gradient(90deg, ${unit.color}22, transparent)`,
          borderBottom: `1px solid ${unit.color}44`,
          backdropFilter: 'blur(10px)',
        }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{unit.icon}</span>
            <div>
              <p className="font-mono text-xs" style={{ color: unit.color }}>
                UNIT SPECIFICATION · {unit.type.toUpperCase()}
              </p>
              <h2 className="font-display text-xl" style={{ color: 'var(--chalk)' }}>
                {unit.title}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full font-mono text-sm"
            style={{
              background: `${unit.color}22`,
              border: `1px solid ${unit.color}44`,
              color: 'var(--chalk)',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Subtitle & Period */}
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-chalk text-xl" style={{ color: unit.color }}>
              {unit.subtitle}
            </h3>
            <span className="font-mono text-xs px-3 py-1 rounded-full" style={{
              background: `${unit.color}22`,
              border: `1px solid ${unit.color}44`,
              color: unit.color,
            }}>
              {unit.period}
            </span>
          </div>

          {/* Process Parameters */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Temperature', value: unit.temperature || 'N/A', icon: '🌡️', hint: 'Intensity of this phase' },
              { label: 'Pressure', value: unit.pressure || 'N/A', icon: '⬆️', hint: 'Stakes involved' },
              { label: 'Yield', value: unit.yield || 'Immeasurable', icon: '📊', hint: 'What came out' },
            ].map(param => (
              <div key={param.label} className="rounded-lg p-3 text-center" style={{
                background: `${unit.color}11`,
                border: `1px solid ${unit.color}33`,
              }}>
                <p className="text-lg mb-1">{param.icon}</p>
                <p className="font-mono text-xs mb-1" style={{ color: 'var(--chalk-dim)', fontSize: '9px' }}>
                  {param.label.toUpperCase()}
                </p>
                <p className="font-mono text-sm font-bold" style={{ color: unit.color }}>
                  {param.value}
                </p>
                <p className="font-chalk text-xs mt-1" style={{ color: 'var(--chalk-dim)', fontSize: '10px' }}>
                  {param.hint}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6 p-4 rounded-lg" style={{
            background: 'rgba(245, 240, 232, 0.03)',
            border: '1px solid rgba(245, 240, 232, 0.1)',
          }}>
            <p className="font-mono text-xs mb-2" style={{ color: 'var(--saffron)' }}>
              ◈ UNIT DESCRIPTION
            </p>
            <p className="font-chalk text-lg leading-relaxed" style={{ color: 'var(--chalk)' }}>
              {unit.description}
            </p>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <p className="font-mono text-xs mb-4" style={{ color: unit.color }}>
              ◈ PROCESS LOG — ACHIEVEMENTS & MILESTONES
            </p>
            <div className="space-y-2">
              {unit.achievements.map((achievement, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{
                    background: achievementsVisible[i] ? `${unit.color}0A` : 'transparent',
                    border: `1px solid ${achievementsVisible[i] ? unit.color + '44' : 'transparent'}`,
                    transform: achievementsVisible[i] ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: achievementsVisible[i] ? 1 : 0,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <span style={{ color: unit.color, flexShrink: 0, fontFamily: 'monospace' }}>▶</span>
                  <p className="font-chalk text-base" style={{ color: 'var(--chalk)' }}>
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {unit.projects && unit.projects.length > 0 && (
            <div className="mb-6">
              <p className="font-mono text-xs mb-4" style={{ color: unit.color }}>
                ◈ PROJECTS BUILT THIS SEMESTER
              </p>
              {unit.projects.map((project, i) => (
                <ProjectCard key={i} project={project} color={unit.color} />
              ))}
            </div>
          )}

          {/* Bottom equation */}
          <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${unit.color}33` }}>
            <p className="reaction-eq text-center text-xl" style={{ color: unit.color }}>
              {unit.type === 'reactor' ? '⚗️ High-Pressure Conversion Active' :
               unit.type === 'tower' ? '🏗️ Continuous Separation & Refinement' :
               unit.type === 'separator' ? '⚖️ Yield Optimization Mode' :
               unit.type === 'tank' ? '🏺 Stored Energy — Ready to React' :
               unit.type === 'compressor' ? '🔁 Phase Transition Complete' :
               '♻️ Multi-Effect Processing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
