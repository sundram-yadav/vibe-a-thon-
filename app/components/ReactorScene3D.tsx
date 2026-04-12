'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, MeshDistortMaterial, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { PlantUnit } from './plantData';

// ─── Individual Reactor Vessel ───────────────────────────────────────────────
function ReactorVessel({
  unit,
  index,
  total,
  onClick,
  isHovered,
  onHover,
}: {
  unit: PlantUnit;
  index: number;
  total: number;
  onClick: () => void;
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [clicked, setClicked] = useState(false);

  // Spread units in an arc
  const angle = (index / (total - 1)) * Math.PI * 1.1 - Math.PI * 0.55;
  const radius = 4.5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius * 0.5;
  const baseY = -0.5 + index * 0.25;

  const col = new THREE.Color(unit.color);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.12;
      // Slow Y rotation
      meshRef.current.rotation.y = t * 0.3 + index * 0.8;
      // Scale pop on hover
      const target = isHovered ? 1.18 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
    if (glowRef.current) {
      glowRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.12;
      const gScale = isHovered ? 1.7 : 1.35;
      glowRef.current.scale.lerp(new THREE.Vector3(gScale, gScale, gScale), 0.08);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        isHovered ? 0.22 : 0.08 + Math.sin(t * 1.5 + index) * 0.04;
    }
    if (ringRef.current) {
      ringRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.12 - 0.8;
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  // Pick 3D shape based on unit type
  const getShape = () => {
    switch (unit.type) {
      case 'reactor':
        return (
          <group>
            <Cylinder args={[0.38, 0.5, 1.4, 32]} ref={meshRef} position={[baseX, baseY, baseZ]}>
              <MeshDistortMaterial
                color={unit.color}
                emissive={unit.color}
                emissiveIntensity={isHovered ? 1.2 : 0.5}
                metalness={0.8}
                roughness={0.15}
                distort={isHovered ? 0.08 : 0.02}
                speed={2}
              />
            </Cylinder>
            {/* Dome top */}
            <Sphere args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[baseX, baseY + 0.7, baseZ]}>
              <meshStandardMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
            </Sphere>
          </group>
        );
      case 'tower':
        return (
          <Cylinder args={[0.22, 0.28, 1.9, 16]} ref={meshRef} position={[baseX, baseY, baseZ]}>
            <MeshDistortMaterial
              color={unit.color}
              emissive={unit.color}
              emissiveIntensity={isHovered ? 1.0 : 0.4}
              metalness={0.85}
              roughness={0.1}
              distort={0.03}
              speed={1.5}
            />
          </Cylinder>
        );
      case 'separator':
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]}>
            <capsuleGeometry args={[0.32, 0.8, 8, 24]} />
            <MeshDistortMaterial
              color={unit.color}
              emissive={unit.color}
              emissiveIntensity={isHovered ? 0.9 : 0.35}
              metalness={0.7}
              roughness={0.2}
              distort={0.04}
              speed={2}
            />
          </mesh>
        );
      case 'compressor':
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]} rotation={[0, 0, 0]}>
            <octahedronGeometry args={[0.55, 1]} />
            <MeshDistortMaterial
              color={unit.color}
              emissive={unit.color}
              emissiveIntensity={isHovered ? 1.1 : 0.5}
              metalness={0.9}
              roughness={0.05}
              distort={isHovered ? 0.12 : 0.04}
              speed={3}
            />
          </mesh>
        );
      case 'exchanger':
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]}>
            <torusKnotGeometry args={[0.38, 0.14, 80, 16, 2, 3]} />
            <MeshDistortMaterial
              color={unit.color}
              emissive={unit.color}
              emissiveIntensity={isHovered ? 1.3 : 0.6}
              metalness={0.95}
              roughness={0.05}
              distort={0.06}
              speed={2.5}
            />
          </mesh>
        );
      default: // tank
        return (
          <Sphere args={[0.5, 32, 32]} ref={meshRef} position={[baseX, baseY, baseZ]}>
            <MeshDistortMaterial
              color={unit.color}
              emissive={unit.color}
              emissiveIntensity={isHovered ? 0.8 : 0.3}
              metalness={0.6}
              roughness={0.25}
              distort={0.05}
              speed={1.5}
            />
          </Sphere>
        );
    }
  };

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      {/* Glow aura sphere */}
      <Sphere args={[0.9, 16, 16]} ref={glowRef} position={[baseX, baseY, baseZ]}>
        <meshBasicMaterial color={unit.color} transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>

      {/* Orbital ring */}
      <mesh ref={ringRef} position={[baseX, baseY - 0.8, baseZ]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.03, 8, 32]} />
        <meshBasicMaterial color={unit.color} transparent opacity={isHovered ? 0.9 : 0.35} />
      </mesh>

      {/* Main shape */}
      {getShape()}

      {/* Label */}
      <Text
        position={[baseX, baseY - 1.3, baseZ + 0.1]}
        fontSize={0.13}
        color={isHovered ? unit.color : 'rgba(245,240,232,0.7)'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
      >
        {unit.subtitle.split(' — ')[0]}
      </Text>
      <Text
        position={[baseX, baseY - 1.52, baseZ + 0.1]}
        fontSize={0.1}
        color={unit.color}
        anchorX="center"
        anchorY="middle"
      >
        {unit.period}
      </Text>

      {/* Steam particles for reactors and towers */}
      {(unit.type === 'reactor' || unit.type === 'tower') && (
        <SteamParticles baseX={baseX} baseY={baseY + 1.2} baseZ={baseZ} color={unit.color} />
      )}
    </group>
  );
}

// ─── Steam Particles ──────────────────────────────────────────────────────────
function SteamParticles({ baseX, baseY, baseZ, color }: { baseX: number; baseY: number; baseZ: number; color: string }) {
  const particles = useRef<THREE.Points>(null!);
  const count = 12;
  const positions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 0.3;
      positions.current[i * 3 + 1] = Math.random() * 1.2;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 1] = ((positions.current[i * 3 + 1] + 0.008) % 1.5);
      positions.current[i * 3] += Math.sin(t + i) * 0.001;
    }
    if (particles.current) {
      (particles.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  const col = new THREE.Color(color);

  return (
    <points ref={particles} position={[baseX, baseY, baseZ]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color={col} size={0.05} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ─── Pipe Connections (curved tubes) ─────────────────────────────────────────
function PipeConnections({ units }: { units: PlantUnit[] }) {
  const total = units.length;

  return (
    <>
      {units.slice(0, -1).map((unit, i) => {
        const a1 = (i / (total - 1)) * Math.PI * 1.1 - Math.PI * 0.55;
        const a2 = ((i + 1) / (total - 1)) * Math.PI * 1.1 - Math.PI * 0.55;
        const r = 4.5;
        const x1 = Math.sin(a1) * r;
        const z1 = -Math.cos(a1) * r * 0.5;
        const y1 = -0.5 + i * 0.25;
        const x2 = Math.sin(a2) * r;
        const z2 = -Math.cos(a2) * r * 0.5;
        const y2 = -0.5 + (i + 1) * 0.25;

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x1, y1, z1),
          new THREE.Vector3((x1 + x2) / 2, (y1 + y2) / 2 + 0.3, (z1 + z2) / 2),
          new THREE.Vector3(x2, y2, z2),
        ]);

        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          // @ts-ignore - React Three Fiber line component type conflicts with SVG line
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color={unit.color} transparent opacity={0.35} linewidth={1} />
          </line>
        );
      })}
    </>
  );
}

// ─── Floating Background Particles ───────────────────────────────────────────
function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FF6B00" size={0.04} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── Camera Auto-Orbit ────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.12) * 1.5;
    camera.position.y = Math.sin(t * 0.08) * 0.4 + 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main 3D Scene ────────────────────────────────────────────────────────────
interface ReactorScene3DProps {
  units: PlantUnit[];
  onUnitClick: (unit: PlantUnit) => void;
}

export default function ReactorScene3D({ units, onUnitClick }: ReactorScene3DProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        width: '100%',
        height: '480px',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,107,0,0.2)',
        background: 'radial-gradient(ellipse at center, rgba(20,10,5,0.95) 0%, rgba(8,8,16,1) 100%)',
        boxShadow: '0 0 60px rgba(255,107,0,0.08) inset',
        cursor: hoveredId ? 'pointer' : 'default',
      }}
    >
      {/* Instruction hint */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        color: 'rgba(255,107,0,0.6)',
        letterSpacing: '0.15em',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        ◈ INTERACTIVE 3D PLANT — CLICK ANY VESSEL TO EXPLORE ◈
      </div>

      <Canvas
        camera={{ position: [0, 1, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#FF6B00" />
        <pointLight position={[-5, -2, -3]} intensity={0.8} color="#FFB700" />
        <pointLight position={[0, -5, 2]} intensity={0.6} color="#00D4AA" />
        <fog attach="fog" args={['#080810', 10, 22]} />

        <Suspense fallback={null}>
          <BackgroundParticles />
          <PipeConnections units={units} />
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
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
