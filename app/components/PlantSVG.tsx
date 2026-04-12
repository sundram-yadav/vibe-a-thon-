'use client';

import { useEffect, useRef, useState } from 'react';
import { PlantUnit, Reaction } from './plantData';

interface PlantSVGProps {
  units: PlantUnit[];
  reactions: Reaction[];
  onUnitClick: (unit: PlantUnit) => void;
  hoveredUnit: string | null;
  onUnitHover: (id: string | null) => void;
}

// SVG icons for each type
const UnitShape = ({ type, color, x, y, size, isHovered }: {
  type: PlantUnit['type'];
  color: string;
  x: number;
  y: number;
  size: number;
  isHovered: boolean;
}) => {
  const glow = isHovered ? `drop-shadow(0 0 12px ${color})` : `drop-shadow(0 0 4px ${color}88)`;

  const shapes: Record<PlantUnit['type'], JSX.Element> = {
    tank: (
      <g filter={`url(#glow-${color.replace('#', '')})`}>
        <ellipse cx={x} cy={y - size * 0.3} rx={size * 0.5} ry={size * 0.15} fill={`${color}33`} stroke={color} strokeWidth="1.5" />
        <rect x={x - size * 0.5} y={y - size * 0.3} width={size} height={size * 0.6} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
        <ellipse cx={x} cy={y + size * 0.3} rx={size * 0.5} ry={size * 0.15} fill={`${color}44`} stroke={color} strokeWidth="1.5" />
        {/* Pipes */}
        <line x1={x - size * 0.5} y1={y} x2={x - size * 0.7} y2={y} stroke={color} strokeWidth="3" />
        <line x1={x + size * 0.5} y1={y} x2={x + size * 0.7} y2={y} stroke={color} strokeWidth="3" />
      </g>
    ),
    reactor: (
      <g>
        <ellipse cx={x} cy={y - size * 0.4} rx={size * 0.45} ry={size * 0.18} fill={`${color}33`} stroke={color} strokeWidth="2" />
        <rect x={x - size * 0.45} y={y - size * 0.4} width={size * 0.9} height={size * 0.8} fill={`${color}22`} stroke={color} strokeWidth="2" />
        {/* Dome bottom */}
        <path d={`M ${x - size * 0.45} ${y + size * 0.4} Q ${x} ${y + size * 0.65} ${x + size * 0.45} ${y + size * 0.4}`}
          fill={`${color}33`} stroke={color} strokeWidth="2" />
        {/* Heating coil suggestion */}
        <path d={`M ${x - size * 0.3} ${y} Q ${x} ${y - size * 0.15} ${x + size * 0.3} ${y}`}
          fill="none" stroke={`${color}88`} strokeWidth="1" />
        {/* Top pipe */}
        <line x1={x} y1={y - size * 0.55} x2={x} y2={y - size * 0.75} stroke={color} strokeWidth="4" />
      </g>
    ),
    tower: (
      <g>
        <rect x={x - size * 0.25} y={y - size * 0.8} width={size * 0.5} height={size * 1.6} rx="4"
          fill={`${color}22`} stroke={color} strokeWidth="2" />
        {/* Trays */}
        {[-0.4, -0.1, 0.2, 0.5].map((offset, i) => (
          <line key={i} x1={x - size * 0.2} y1={y + size * offset} x2={x + size * 0.2} y2={y + size * offset}
            stroke={`${color}88`} strokeWidth="1" />
        ))}
        {/* Top dome */}
        <ellipse cx={x} cy={y - size * 0.8} rx={size * 0.25} ry={size * 0.1} fill={`${color}44`} stroke={color} strokeWidth="1.5" />
        {/* Pipes */}
        <line x1={x} y1={y - size * 0.9} x2={x} y2={y - size * 1.1} stroke={color} strokeWidth="3" />
        <line x1={x - size * 0.25} y1={y - size * 0.3} x2={x - size * 0.55} y2={y - size * 0.3} stroke={color} strokeWidth="3" />
        <line x1={x + size * 0.25} y1={y + size * 0.3} x2={x + size * 0.55} y2={y + size * 0.3} stroke={color} strokeWidth="3" />
      </g>
    ),
    separator: (
      <g>
        {/* Horizontal drum */}
        <ellipse cx={x - size * 0.35} cy={y} rx={size * 0.15} ry={size * 0.35} fill={`${color}33`} stroke={color} strokeWidth="1.5" />
        <rect x={x - size * 0.35} y={y - size * 0.35} width={size * 0.7} height={size * 0.7} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
        <ellipse cx={x + size * 0.35} cy={y} rx={size * 0.15} ry={size * 0.35} fill={`${color}44`} stroke={color} strokeWidth="1.5" />
        {/* Level indicator */}
        <rect x={x - size * 0.3} y={y + size * 0.05} width={size * 0.6} height={size * 0.25} fill={`${color}33`} />
        {/* Pipes */}
        <line x1={x - size * 0.5} y1={y} x2={x - size * 0.7} y2={y} stroke={color} strokeWidth="3" />
        <line x1={x + size * 0.5} y1={y - size * 0.2} x2={x + size * 0.7} y2={y - size * 0.2} stroke={color} strokeWidth="3" />
        <line x1={x} y1={y + size * 0.35} x2={x} y2={y + size * 0.6} stroke={color} strokeWidth="3" />
      </g>
    ),
    exchanger: (
      <g>
        {/* Shell */}
        <ellipse cx={x - size * 0.4} cy={y} rx={size * 0.12} ry={size * 0.3} fill={`${color}33`} stroke={color} strokeWidth="1.5" />
        <rect x={x - size * 0.4} y={y - size * 0.3} width={size * 0.8} height={size * 0.6} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
        <ellipse cx={x + size * 0.4} cy={y} rx={size * 0.12} ry={size * 0.3} fill={`${color}44`} stroke={color} strokeWidth="1.5" />
        {/* Tubes inside */}
        {[-0.1, 0, 0.1].map((offset, i) => (
          <line key={i} x1={x - size * 0.35} y1={y + size * offset} x2={x + size * 0.35} y2={y + size * offset}
            stroke={`${color}66`} strokeWidth="1" />
        ))}
        <line x1={x - size * 0.4} y1={y - size * 0.15} x2={x - size * 0.65} y2={y - size * 0.15} stroke={color} strokeWidth="3" />
        <line x1={x + size * 0.4} y1={y + size * 0.15} x2={x + size * 0.65} y2={y + size * 0.15} stroke={color} strokeWidth="3" />
      </g>
    ),
    compressor: (
      <g>
        {/* Body */}
        <polygon points={`${x},${y - size * 0.6} ${x + size * 0.5},${y + size * 0.4} ${x - size * 0.5},${y + size * 0.4}`}
          fill={`${color}22`} stroke={color} strokeWidth="2" />
        {/* Inner */}
        <polygon points={`${x},${y - size * 0.3} ${x + size * 0.25},${y + size * 0.2} ${x - size * 0.25},${y + size * 0.2}`}
          fill={`${color}44`} stroke={color} strokeWidth="1" />
        {/* Shaft */}
        <line x1={x} y1={y - size * 0.6} x2={x} y2={y - size * 0.85} stroke={color} strokeWidth="4" />
        {/* Impeller hint */}
        <circle cx={x} cy={y} r={size * 0.12} fill={`${color}88`} stroke={color} strokeWidth="1" />
      </g>
    ),
  };

  return shapes[type] || shapes.tank;
};

export default function PlantSVG({ units, reactions, onUnitClick, hoveredUnit, onUnitHover }: PlantSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setAnimTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  const W = 920;
  const H = 440;

  // Map unit positions to SVG coords
  const getPos = (unit: PlantUnit) => ({
    x: (unit.position.x / 100) * W,
    y: (unit.position.y / 100) * H,
  });

  const unitSize = 55;

  // Steam particles
  const steamParticles = units.filter(u => u.type === 'reactor' || u.type === 'tower').map(u => {
    const pos = getPos(u);
    return { x: pos.x, y: pos.y - unitSize * 0.8, color: u.color };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          display: 'block',
          minWidth: '600px',
        }}
      >
        <defs>
          {/* Glows for each unit color */}
          {units.map(u => {
            const id = u.color.replace('#', '');
            return (
              <filter key={id} id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            );
          })}

          {/* Pipe flow animation */}
          <marker id="arrowOrange" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--saffron)" />
          </marker>
        </defs>

        {/* Background plant floor */}
        <rect x={0} y={H * 0.82} width={W} height={H * 0.18} fill="rgba(20,20,30,0.8)" />
        <line x1={0} y1={H * 0.82} x2={W} y2={H * 0.82} stroke="rgba(255,107,0,0.2)" strokeWidth="1" />

        {/* Grid lines (isometric feel) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={i * (W / 9)} y1={0} x2={i * (W / 9)} y2={H}
            stroke="rgba(255,107,0,0.04)" strokeWidth="1" />
        ))}

        {/* Reaction pipes (connecting units) */}
        {reactions.map((r, i) => {
          const fromUnit = units.find(u => u.id === r.from);
          const toUnit = units.find(u => u.id === r.to);
          if (!fromUnit || !toUnit) return null;
          const from = getPos(fromUnit);
          const to = getPos(toUnit);
          const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

          // Animated dash offset
          const offset = (animTick * 2) % 40;

          return (
            <g key={i}>
              {/* Pipe shadow */}
              <path
                d={`M ${from.x + unitSize * 0.7} ${from.y} C ${mid.x} ${from.y}, ${mid.x} ${to.y}, ${to.x - unitSize * 0.7} ${to.y}`}
                fill="none"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="8"
              />
              {/* Main pipe */}
              <path
                d={`M ${from.x + unitSize * 0.7} ${from.y} C ${mid.x} ${from.y}, ${mid.x} ${to.y}, ${to.x - unitSize * 0.7} ${to.y}`}
                fill="none"
                stroke={`${fromUnit.color}44`}
                strokeWidth="5"
              />
              {/* Flow animation */}
              <path
                d={`M ${from.x + unitSize * 0.7} ${from.y} C ${mid.x} ${from.y}, ${mid.x} ${to.y}, ${to.x - unitSize * 0.7} ${to.y}`}
                fill="none"
                stroke={fromUnit.color}
                strokeWidth="2"
                strokeDasharray="12 28"
                strokeDashoffset={-offset}
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Unit shapes */}
        {units.map((unit) => {
          const pos = getPos(unit);
          const isHovered = hoveredUnit === unit.id;

          return (
            <g
              key={unit.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onUnitClick(unit)}
              onMouseEnter={() => onUnitHover(unit.id)}
              onMouseLeave={() => onUnitHover(null)}
            >
              {/* Hover glow ring */}
              {isHovered && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={unitSize * 1.2}
                  fill="none"
                  stroke={unit.color}
                  strokeWidth="1"
                  opacity="0.5"
                  style={{ animation: 'pulse-glow 1s ease-in-out infinite' }}
                />
              )}

              {/* Ground shadow */}
              <ellipse cx={pos.x} cy={H * 0.83} rx={unitSize * 0.6} ry={8} fill="rgba(0,0,0,0.4)" />

              {/* Unit shape */}
              <UnitShape
                type={unit.type}
                color={unit.color}
                x={pos.x}
                y={pos.y}
                size={unitSize}
                isHovered={isHovered}
              />

              {/* Unit label */}
              <text
                x={pos.x}
                y={pos.y + unitSize + 16}
                textAnchor="middle"
                fill={isHovered ? unit.color : 'rgba(245,240,232,0.7)'}
                fontSize="9"
                fontFamily="'Share Tech Mono', monospace"
                style={{ transition: 'fill 0.2s' }}
              >
                {unit.subtitle.split(' — ')[0]}
              </text>
              <text
                x={pos.x}
                y={pos.y + unitSize + 27}
                textAnchor="middle"
                fill={unit.color}
                fontSize="8"
                fontFamily="'Share Tech Mono', monospace"
                opacity="0.8"
              >
                {unit.period}
              </text>

              {/* Click hint on hover */}
              {isHovered && (
                <text
                  x={pos.x}
                  y={pos.y - unitSize - 8}
                  textAnchor="middle"
                  fill={unit.color}
                  fontSize="8"
                  fontFamily="'Share Tech Mono', monospace"
                >
                  ▶ CLICK TO EXPLORE
                </text>
              )}
            </g>
          );
        })}

        {/* Steam particles */}
        {steamParticles.map((s, i) => {
          const yOff = ((animTick * 1.2 + i * 30) % 80);
          const xDrift = Math.sin((animTick * 0.05) + i) * 8;
          const alpha = Math.max(0, 0.6 - yOff / 80);
          return (
            <ellipse
              key={i}
              cx={s.x + xDrift}
              cy={s.y - yOff}
              rx={4 + yOff * 0.1}
              ry={3}
              fill={`${s.color}${Math.round(alpha * 99).toString(16).padStart(2, '0')}`}
            />
          );
        })}

        {/* Live reaction indicator */}
        <g>
          <circle cx={W - 40} cy={30} r={8} fill="#00FF88"
            style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
          <text x={W - 25} y={34} fill="#00FF88" fontSize="9" fontFamily="'Share Tech Mono', monospace">
            LIVE
          </text>
        </g>

        {/* Title watermark */}
        <text x={20} y={H - 10} fill="rgba(255,107,0,0.15)" fontSize="10" fontFamily="'Special Elite', cursive">
          SUNDRAM YADAV · LIFE PROCESS FLOW DIAGRAM v2.026 · IIT DHARWAD
        </text>
      </svg>
    </div>
  );
}
