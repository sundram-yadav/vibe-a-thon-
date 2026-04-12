'use client';

import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Grid, Html, Billboard, Edges, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { PlantUnit } from './plantData';

// ─── Floating Chemistry Formulas Background ────────────────────────────────────
const formulas = [
  'ΔS ≥ 0', 'k = A·e^(-Ea/RT)', 'PV = nRT', 'ΔG = ΔH - TΔS',
  '[-CH2-CH2-]n', '[-NH-R-CO-]n', '∂ρ/∂t + ∇·(ρv) = 0', 'HΨ = EΨ',
  'Re = ρvD/μ', 'd[A]/dt = -k[A]', 'Sp. Volume', 'Polymerization',
  'CSTR', 'PFR', 'Nusselt', 'Prandtl', 'Gibbs Free Energy'
];

function ChemistryBackground() {
  const items = useMemo(() =>
    Array.from({ length: 35 }).map((_, i) => ({
      text: formulas[i % formulas.length],
      position: [(Math.random() - 0.5) * 110, (Math.random() - 0.3) * 70, -35 - Math.random() * 30] as [number, number, number],
      rotation: [0, 0, (Math.random() - 0.5) * 0.15] as [number, number, number],
      scale: 1.2 + Math.random() * 2,
      opacity: 0.012 + Math.random() * 0.025,
    })), []);

  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 1.5;
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Text key={i} position={item.position} rotation={item.rotation} fontSize={item.scale}
          color="#4a2a10" fillOpacity={item.opacity} anchorX="center" anchorY="middle">
          {item.text}
        </Text>
      ))}
    </group>
  );
}

// ─── Reusable Glossy Materials ──────────────────────────────────────────────────
function GlossyMat({ color, emissiveIntensity = 0.15 }: { color: string; emissiveIntensity?: number }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.75}
      roughness={0.08}
      clearcoat={1}
      clearcoatRoughness={0.05}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function SteelMat({ color = '#7C3AED' }: { color?: string }) {
  return <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.05} clearcoat={0.8} clearcoatRoughness={0.1} />;
}

// ─── Base Skid (Foundation for ALL units) ──────────────────────────────────────
// This ensures NOTHING floats. Every unit sits on this grounded skid.
function BaseSkid({ color }: { color: string }) {
  const FLOOR_Y = -2.5; // same as Grid
  const SKID_H = 0.18;
  const LEG_H = 1.2;
  const skidY = FLOOR_Y + SKID_H / 2; // skid sits ON the floor
  const legY = FLOOR_Y + LEG_H / 2;   // legs from floor up

  return (
    <group>
      {/* Concrete-style foundation plate ON the floor */}
      <mesh position={[0, skidY, 0]}>
        <boxGeometry args={[2.2, SKID_H, 2.2]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        <Edges color={color} linewidth={1.5} />
      </mesh>
      {/* 4 structural I-beam legs from floor to equipment level */}
      {[[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].map(([x, z], i) => (
        <group key={i} position={[x, legY, z]}>
          {/* Main vertical column */}
          <mesh>
            <boxGeometry args={[0.12, LEG_H, 0.12]} />
            <SteelMat color="#6D28D9" />
            <Edges color="#A78BFA" linewidth={1} />
          </mesh>
          {/* Flange top */}
          <mesh position={[0, LEG_H / 2, 0]}>
            <boxGeometry args={[0.28, 0.06, 0.28]} />
            <SteelMat color="#7C3AED" />
          </mesh>
          {/* Diagonal brace to center (visual support) */}
          <mesh position={[x > 0 ? -0.2 : 0.2, 0.1, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
            <boxGeometry args={[0.45, 0.05, 0.05]} />
            <SteelMat color="#5B21B6" />
          </mesh>
        </group>
      ))}
      {/* Cross-beam connecting the 4 legs at mid-height */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[0, FLOOR_Y + LEG_H * 0.55, i === 0 ? 0 : 0]}>
          <boxGeometry args={i === 0 ? [1.9, 0.06, 0.08] : [0.08, 0.06, 1.9]} />
          <SteelMat color="#5B21B6" />
        </mesh>
      ))}
      {/* Anchor bolts at corners */}
      {[[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].map(([x, z], i) => (
        <mesh key={i} position={[x, FLOOR_Y + 0.05, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 6]} />
          <meshStandardMaterial color="#F59E0B" metalness={1} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Mock Pipe Valve ────────────────────────────────────────────────────────────
function Valve({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.07, 0.025, 8, 16]} />
        <GlossyMat color={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ─── Pipe Connection System (AutoCAD manifold style) ───────────────────────────
function CADPipe({ start, end, color, radius = 0.055 }: { start: THREE.Vector3; end: THREE.Vector3; color: string; radius?: number }) {
  const points = useMemo(() => {
    const mid1 = new THREE.Vector3(start.x, -2.0, start.z);
    const mid2 = new THREE.Vector3(end.x, -2.0, start.z);
    const mid3 = new THREE.Vector3(end.x, -2.0, end.z);
    return [start, mid1, mid2, mid3, end];
  }, [start, end]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15), [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 80, radius, 10, false]} />
      <meshPhysicalMaterial color={color} metalness={0.8} roughness={0.1} clearcoat={0.9}
        emissive={color} emissiveIntensity={0.25} />
    </mesh>
  );
}

function PipeConnections({ units }: { units: PlantUnit[] }) {
  const total = units.length;
  return (
    <group>
      {units.slice(0, -1).map((unit, i) => {
        const a1 = (i / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const a2 = ((i + 1) / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const r = 5.5;
        const start = new THREE.Vector3(Math.sin(a1) * r, -1.1, -Math.cos(a1) * r * 0.7);
        const end = new THREE.Vector3(Math.sin(a2) * r, -1.1, -Math.cos(a2) * r * 0.7);
        const midX = (start.x + end.x) / 2;
        const midZ = (start.z + end.z) / 2;

        return (
          <group key={i}>
            <CADPipe start={start} end={end} color={unit.color} />
            {/* Valves along the pipe */}
            <Valve position={[midX * 0.6 + start.x * 0.4, -2.0, midZ * 0.6 + start.z * 0.4]} color={unit.color} />
            <Valve position={[midX * 0.6 + end.x * 0.4, -2.0, midZ * 0.6 + end.z * 0.4]} color={units[i + 1].color} />
            {/* Reaction label */}
            <Billboard position={[midX, -1.5, midZ + 0.3]}>
              <Text fontSize={0.16} color="rgba(255,255,255,0.7)" anchorX="center" anchorY="middle"
                outlineWidth={0.01} outlineColor="#000">
                {`→ ${units[i + 1].type.toUpperCase()} →`}
              </Text>
            </Billboard>
          </group>
        );
      })}
      {/* Central ring manifold pipe at floor level */}
      <mesh position={[0, -2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.04, 8, 64]} />
        <meshPhysicalMaterial color="#6D28D9" metalness={0.9} roughness={0.1} clearcoat={1}
          emissive="#6D28D9" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// ─── Equipment Models (Distinctive per type) ───────────────────────────────────

// REACTOR — Vertical pressure vessel with agitator + flanged nozzles
function ReactorModel({ color }: { color: string }) {
  const agitatorRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => { if (agitatorRef.current) agitatorRef.current.rotation.y += delta * 2; });

  return (
    <group>
      {/* Main shell */}
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* Top dome */}
      <mesh position={[0, 1.4, 0]}><sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <GlossyMat color={color} /></mesh>
      {/* Bottom dome */}
      <mesh position={[0, -0.4, 0]}><sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <GlossyMat color={color} /></mesh>
      {/* Flanged rings */}
      {[-0.1, 0.6, 1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.035, 8, 32]} />
          <SteelMat color="#7C3AED" />
        </mesh>
      ))}
      {/* Side nozzles */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.62, 0.3, Math.cos(a) * 0.62]} rotation={[0, a, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.22, 8]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Agitator motor on top */}
      <mesh position={[0, 1.75, 0]}><cylinderGeometry args={[0.18, 0.18, 0.3, 12]} />
        <SteelMat color="#4C1D95" /></mesh>
      <mesh ref={agitatorRef} position={[0, 1.55, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.07]} />
        <GlossyMat color={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// SEPARATOR — Horizontal with dual saddle cradles
function SeparatorModel({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Main horizontal shell */}
      <mesh><cylinderGeometry args={[0.45, 0.45, 2.0, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* Hemispherical end caps */}
      <mesh position={[0, 1.0, 0]}><sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <GlossyMat color={color} /></mesh>
      <mesh position={[0, -1.0, 0]}><sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <GlossyMat color={color} /></mesh>
      {/* Saddle cradles */}
      {[-0.55, 0.55].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh><boxGeometry args={[0.12, 0.18, 1.1]} /><SteelMat color="#7C3AED" /></mesh>
          <mesh position={[0, -0.12, 0]}><boxGeometry args={[0.6, 0.06, 1.1]} /><SteelMat color="#6D28D9" /></mesh>
        </group>
      ))}
      {/* Flanges on both ends */}
      {[-1.05, 1.05].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.47, 0.025, 8, 32]} />
          <SteelMat color="#7C3AED" />
        </mesh>
      ))}
    </group>
  );
}

// DISTILLATION TOWER — Tall slender column with platforms and external piping
function TowerModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main column */}
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.32, 0.38, 3.8, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* Top cone cap */}
      <mesh position={[0, 2.8, 0]}><coneGeometry args={[0.32, 0.5, 16]} />
        <GlossyMat color={color} /></mesh>
      {/* Platform rings (tray levels) */}
      {[-0.5, 0.2, 0.9, 1.6, 2.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.03, 8, 32]} />
          <SteelMat color="#7C3AED" />
        </mesh>
      ))}
      {/* External downcomer pipes */}
      {[0, Math.PI].map((a, i) => (
        <group key={i} position={[Math.sin(a) * 0.52, 0.8, Math.cos(a) * 0.52]}>
          <mesh><cylinderGeometry args={[0.04, 0.04, 3.2, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.1}
              emissive="#F59E0B" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
      {/* Reboiler at bottom */}
      <mesh position={[0.65, -0.8, 0]}><cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
        <GlossyMat color="#FF5722" emissiveIntensity={0.35} /></mesh>
      {/* Connecting pipe reboiler to column */}
      <mesh position={[0.42, -0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.46, 8]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// HEAT EXCHANGER — Shell & tube horizontal with distinct end plates
function ExchangerModel({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Main shell */}
      <mesh><cylinderGeometry args={[0.42, 0.42, 2.2, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* End plates (tube sheet) */}
      {[-1.1, 1.1].map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0]}><cylinderGeometry args={[0.5, 0.5, 0.12, 32]} />
            <SteelMat color="#4C1D95" /></mesh>
          {/* Axial nozzle stub on each end (safe — along axis, no visible float) */}
          <mesh position={[0, y + (i === 0 ? -0.18 : 0.18), 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 8]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {/* Shell reinforcement flanges */}
      {[-0.8, 0, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.025, 8, 32]} />
          <SteelMat color="#6D28D9" />
        </mesh>
      ))}
    </group>
  );
}

// COMPRESSOR — Diamond/octahedral form on a vibration isolation pad
function CompressorModel({ color }: { color: string }) {
  const spinRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => { if (spinRef.current) spinRef.current.rotation.z += delta * 1.5; });

  return (
    <group>
      {/* Anti-vibration pad */}
      <mesh position={[0, -0.6, 0]}><boxGeometry args={[1.1, 0.12, 1.1]} />
        <meshPhysicalMaterial color="#1E1B4B" metalness={0.5} roughness={0.5} /></mesh>
      {/* Main compressor casing */}
      <mesh position={[0, 0, 0]}><octahedronGeometry args={[0.65, 1]} />
        <GlossyMat color={color} emissiveIntensity={0.3} /></mesh>
      {/* Wireframe outer shell */}
      <mesh position={[0, 0, 0]}><octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} wireframe /></mesh>
      {/* Spinning impeller disc */}
      <mesh ref={spinRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.04, 6, 8]} />
        <GlossyMat color={color} emissiveIntensity={0.6} />
      </mesh>
      {/* Inlet/Outlet pipes */}
      {[0, Math.PI].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.7, 0, Math.cos(a) * 0.7]} rotation={[0, a + Math.PI / 2, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 8]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// TANK — Large flat-bottomed storage tank with roof vent and ladder
function TankModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main cylindrical body */}
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.7, 0.72, 1.6, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* Flat bottom */}
      <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.72, 0.72, 0.08, 32]} />
        <SteelMat color="#4C1D95" /></mesh>
      {/* Conical roof */}
      <mesh position={[0, 1.05, 0]}><coneGeometry args={[0.72, 0.45, 32]} />
        <GlossyMat color={color} /></mesh>
      {/* Vent nozzle on top */}
      <mesh position={[0, 1.32, 0]}><cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
        <meshStandardMaterial color="#A78BFA" metalness={0.9} roughness={0.1} /></mesh>
      {/* Shell reinforcement rings */}
      {[-0.4, 0.2, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.73, 0.025, 8, 32]} />
          <SteelMat color="#6D28D9" />
        </mesh>
      ))}
      {/* Side ladder (visual rungs) */}
      <group position={[0.71, 0.2, 0]}>
        {[-0.5, -0.1, 0.3, 0.7].map((y, i) => (
          <mesh key={i} position={[0.06, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
            <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        {/* Rails */}
        {[-0.12, 0.12].map((z, i) => (
          <mesh key={i} position={[0.06, 0.15, z]}>
            <cylinderGeometry args={[0.015, 0.015, 1.45, 6]} />
            <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Dispatcher: picks the right model for each unit type ──────────────────────
function IndustrialEquipment({ unit }: { unit: PlantUnit }) {
  switch (unit.type) {
    case 'reactor':   return <ReactorModel color={unit.color} />;
    case 'separator': return <SeparatorModel color={unit.color} />;
    case 'tower':     return <TowerModel color={unit.color} />;
    case 'exchanger': return <ExchangerModel color={unit.color} />;
    case 'compressor': return <CompressorModel color={unit.color} />;
    case 'tank':
    default:          return <TankModel color={unit.color} />;
  }
}

// ─── Full Reactor Vessel Unit (Equipment + Skid + Labels) ──────────────────────
function ReactorVessel({
  unit, index, total, onClick, isHovered, onHover
}: {
  unit: PlantUnit; index: number; total: number;
  onClick: () => void; isHovered: boolean; onHover: (h: boolean) => void;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const angle = (index / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
  const radius = 5.8;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius * 0.72;
  // Equipment sits exactly on top of the skid
  const equipY = -1.1;

  // Only scale on hover — NO individual rotation
  useFrame(() => {
    if (meshRef.current) {
      const target = isHovered ? 1.12 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
    }
  });

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; onHover(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onHover(false); }}>

      {/* ── Structural foundation (static, no rotation) ── */}
      <group position={[baseX, 0, baseZ]}>
        <BaseSkid color={unit.color} />
        {/* Glow ring on floor below unit */}
        <mesh position={[0, -2.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.15, 32]} />
          <meshBasicMaterial color={unit.color} transparent opacity={isHovered ? 0.35 : 0.12} />
        </mesh>
      </group>

      {/* ── Equipment body (rotates slowly, sits on skid) ── */}
      <group ref={meshRef} position={[baseX, equipY, baseZ]}>
        <IndustrialEquipment unit={unit} />
        {/* Colored glow sphere inside the equipment */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color={unit.color} transparent opacity={0.04} />
        </mesh>
      </group>

      {/* ── Unit nameplate label (static, below equipment) ── */}
      {!isHovered && (
        <group position={[baseX, -2.1, baseZ]}>
          <Billboard>
            <mesh position={[0, -0.02, -0.01]}>
              <planeGeometry args={[2.6, 0.75]} />
              <meshBasicMaterial color="#08060E" transparent opacity={0.88} />
            </mesh>
            <Text position={[0, 0.13, 0]} fontSize={0.175} color={unit.color}
              anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor="#000">
              {unit.subtitle.split(' — ')[0]}
            </Text>
            <Text position={[0, -0.12, 0]} fontSize={0.11} color="rgba(255,255,255,0.5)"
              anchorX="center" anchorY="middle">
              {unit.period}
            </Text>
          </Billboard>
        </group>
      )}

      {/* ── Hover tooltip ── */}
      {isHovered && (
        <Html position={[baseX, equipY + 2.1, baseZ]} center>
          <div style={{
            background: 'rgba(4,3,12,0.95)',
            border: `2px solid ${unit.color}`,
            padding: '10px 18px',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 28px ${unit.color}88, 0 0 60px ${unit.color}33`,
            pointerEvents: 'none',
            fontFamily: 'monospace',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '2px' }}>◉ Click to Inspect</span>
            <span style={{ color: unit.color, fontWeight: 'bold', fontSize: '15px' }}>{unit.subtitle.split(' — ')[0]}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{unit.type.toUpperCase()} · {unit.period}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Main Scene ─────────────────────────────────────────────────────────────────
interface ReactorScene3DProps {
  units: PlantUnit[];
  onUnitClick: (unit: PlantUnit) => void;
}

export default function ReactorScene3D({ units, onUnitClick }: ReactorScene3DProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{
      width: '100%',
      height: '620px',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(109,40,217,0.35)',
      background: 'radial-gradient(ellipse at 40% 30%, #0d0720 0%, #050310 60%, #020108 100%)',
      boxShadow: '0 0 80px rgba(109,40,217,0.08) inset, 0 0 0 1px rgba(167,139,250,0.07)',
    }}>

      {/* HUD overlay */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, pointerEvents: 'none' }}>
        <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--saffron)' }}>
          ◈ CHEMICAL PLANT METAVERSE ◈
        </p>
        <p className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
          Drag to Rotate · Scroll to Zoom · Click Unit to Inspect
        </p>
      </div>

      {/* Top-right unit count badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 10,
        fontFamily: 'monospace', fontSize: '11px', color: '#A78BFA',
        background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(109,40,217,0.4)',
        padding: '4px 10px', borderRadius: '6px', pointerEvents: 'none',
      }}>
        {units.length} UNIT{units.length !== 1 ? 'S' : ''} ONLINE
      </div>

      <Canvas camera={{ position: [0, 5, 14], fov: 48 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>

        {/* Lighting */}
        <ambientLight intensity={0.35} color="#E0D0FF" />
        <directionalLight position={[12, 14, 8]} intensity={1.8} color="#fff" castShadow />
        <directionalLight position={[-10, 8, -5]} intensity={0.6} color="#A78BFA" />
        <pointLight position={[0, 6, 0]} intensity={1.2} color="#7C3AED" distance={20} />
        <pointLight position={[-4, -1, -4]} intensity={1.0} color="#FF6B00" distance={15} />
        <pointLight position={[4, -1, 4]} intensity={0.8} color="#00D4AA" distance={15} />
        <fog attach="fog" args={['#050310', 8, 32]} />

        {/* Floor Grid */}
        <Grid
          position={[0, -2.5, 0]}
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#3B0764"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#6D28D9"
          fadeDistance={28}
          fadeStrength={1.5}
        />

        <Suspense fallback={null}>
          <ChemistryBackground />
          <PipeConnections units={units} />

          {/* Floor branding text */}
          <group position={[0, -2.48, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <Text fontSize={1.4} color="#FF6B00" anchorX="center" anchorY="middle"
              material-metalness={0.9} material-roughness={0.1}
              material-emissive="#FF6B00" material-emissiveIntensity={0.18}>
              SUNDRAM
            </Text>
          </group>

          {units.map((unit, i) => (
            <ReactorVessel
              key={unit.id}
              unit={unit}
              index={i}
              total={units.length}
              onClick={() => onUnitClick(unit)}
              isHovered={hoveredId === unit.id}
              onHover={(h) => setHoveredId(h ? unit.id : null)}
            />
          ))}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 - 0.04}
            autoRotate={!hoveredId}
            autoRotateSpeed={0.45}
            dampingFactor={0.06}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
