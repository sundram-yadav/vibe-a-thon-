'use client';

import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, MeshDistortMaterial, Sphere, Cylinder, Box, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { PlantUnit } from './plantData';

// ─── Floating Formulas Background ──────────────────────────────────────────────
const formulas = [
  'ΔS ≥ 0', 'k = A·e^(-Ea/RT)', 'PV = nRT', 'ΔG = ΔH - TΔS', 
  '[-CH2-CH2-]n', '[-NH-R-CO-]n', '∂ρ/∂t + ∇·(ρv) = 0', 'HΨ = EΨ',
  'Re = ρvD/μ', 'd[A]/dt = -k[A]', 'Sp. Volume', 'Polymerization'
];

function ChemistryBackground() {
  const items = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      text: formulas[i % formulas.length],
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20 - 5
      ] as [number, number, number],
      rotation: [
        Math.random() * 0.2,
        Math.random() * Math.PI,
        Math.random() * 0.2
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.2
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Text
          key={i}
          position={item.position}
          rotation={item.rotation}
          fontSize={item.scale}
          color="rgba(255, 107, 0, 0.15)"
          material-transparent
          anchorX="center"
          anchorY="middle"
        >
          {item.text}
        </Text>
      ))}
    </group>
  );
}

// ─── Ambient Particles ────────────────────────────────────────────────────────
function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00D4AA" size={0.03} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── Pipe Connections ────────────────────────────────────────────────────────
function PipeConnections({ units }: { units: PlantUnit[] }) {
  const total = units.length;
  // Complex industrial manifold look using 3D tubes
  return (
    <group>
      {units.slice(0, -1).map((unit, i) => {
        const a1 = (i / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const a2 = ((i + 1) / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const r = 5.5;
        
        const x1 = Math.sin(a1) * r;
        const z1 = -Math.cos(a1) * r * 0.7;
        const y1 = 0;
        
        const x2 = Math.sin(a2) * r;
        const z2 = -Math.cos(a2) * r * 0.7;
        const y2 = 0;

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x1, y1 - 0.5, z1),
          new THREE.Vector3(x1, y1 - 2, z1), // drops down
          new THREE.Vector3((x1 + x2) / 2, -2.5, (z1 + z2) / 2), // travels along floor
          new THREE.Vector3(x2, y2 - 2, z2), // up to next unit
          new THREE.Vector3(x2, y2 - 0.5, z2),
        ]);

        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 20, 0.04, 8, false]} />
            <meshStandardMaterial color={unit.color} transparent opacity={0.6} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Scaffolding / Foundation ─────────────────────────────────────────────────
function Scaffolding({ position, color }: { position: [number, number, number], color: string }) {
  // Adds industrial beams around the base of each vessel
  return (
    <group position={position}>
      <Box args={[1.5, 0.1, 1.5]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#1a1a24" metalness={0.8} roughness={0.5} />
      </Box>
      <Box args={[0.05, 1.5, 0.05]} position={[0.6, -1, 0.6]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} opacity={0.5} transparent />
      </Box>
      <Box args={[0.05, 1.5, 0.05]} position={[-0.6, -1, -0.6]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} opacity={0.5} transparent />
      </Box>
      <Box args={[0.05, 1.5, 0.05]} position={[-0.6, -1, 0.6]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} opacity={0.5} transparent />
      </Box>
      <Box args={[0.05, 1.5, 0.05]} position={[0.6, -1, -0.6]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} opacity={0.5} transparent />
      </Box>
    </group>
  );
}

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
  const meshRef = useRef<any>(null!);
  const glowRef = useRef<any>(null!);
  
  // Arrange in a wide semi-circle
  const angle = (index / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
  const radius = 5.5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius * 0.7;
  const baseY = 0.5 + Math.sin(index * 1.5) * 0.3;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.1;
      meshRef.current.rotation.y = t * 0.2 + index;
      const target = isHovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
    if (glowRef.current) {
      glowRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.1;
      const gScale = isHovered ? 1.6 : 1.2;
      glowRef.current.scale.lerp(new THREE.Vector3(gScale, gScale, gScale), 0.1);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        isHovered ? 0.3 : 0.05 + Math.sin(t * 1.5 + index) * 0.03;
    }
  });

  const getShape = () => {
    switch (unit.type) {
      case 'reactor':
        return (
          <group ref={meshRef} position={[baseX, baseY, baseZ]}>
            <Cylinder args={[0.4, 0.45, 1.6, 32]}>
              <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} distort={0.03} speed={2} />
            </Cylinder>
            <Sphere args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color={unit.color} metalness={0.8} />
            </Sphere>
            <Sphere args={[0.45, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} position={[0, -0.8, 0]}>
              <meshStandardMaterial color={unit.color} metalness={0.8} />
            </Sphere>
          </group>
        );
      case 'tower':
        return (
          <Cylinder args={[0.25, 0.25, 2.8, 16]} ref={meshRef} position={[baseX, baseY + 0.4, baseZ]}>
            <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} distort={0.02} />
          </Cylinder>
        );
      case 'separator':
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.3, 0.8, 16, 24]} />
            <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.6} metalness={0.7} roughness={0.2} distort={0.05} />
          </mesh>
        );
      case 'compressor':
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]}>
            <octahedronGeometry args={[0.6, 1]} />
            <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.7} metalness={0.9} roughness={0.1} distort={0.1} speed={3} />
          </mesh>
        );
      case 'exchanger': // A bundle of tubes look
        return (
          <group ref={meshRef} position={[baseX, baseY, baseZ]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
              <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh>
              <torusKnotGeometry args={[0.4, 0.08, 100, 16, 2, 5]} />
              <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.8} metalness={1} distort={0.05} />
            </mesh>
          </group>
        );
      default: // tank
        return (
          <mesh ref={meshRef} position={[baseX, baseY, baseZ]}>
            <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
            <meshStandardMaterial color={unit.color} metalness={0.7} roughness={0.3} />
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={unit.color} metalness={0.7} />
            </mesh>
          </mesh>
        );
    }
  };

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      <Scaffolding position={[baseX, baseY, baseZ]} color={unit.color} />

      <Sphere args={[1.2, 16, 16]} ref={glowRef} position={[baseX, baseY, baseZ]}>
        <meshBasicMaterial color={unit.color} transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>

      {getShape()}

      {/* Ground Label Stand */}
      <group position={[baseX, -1.5, baseZ]}>
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 0.6]} />
          <meshBasicMaterial color="rgba(0,0,0,0.8)" transparent opacity={0.8} />
        </mesh>
        <Text position={[0, -0.1, 0.01]} fontSize={0.15} color={isHovered ? '#fff' : unit.color} anchorX="center" anchorY="bottom">
          {unit.subtitle.split(' — ')[0]}
        </Text>
        <Text position={[0, -0.3, 0.01]} fontSize={0.1} color="rgba(255,255,255,0.6)" anchorX="center" anchorY="bottom">
          {unit.period}
        </Text>
      </group>
    </group>
  );
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
        height: '600px', // Increased height for better immersion
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,107,0,0.2)',
        background: 'radial-gradient(ellipse at center, rgba(16,10,14,1) 0%, rgba(4,4,8,1) 100%)',
        boxShadow: '0 0 60px rgba(255,107,0,0.05) inset',
        cursor: hoveredId ? 'pointer' : 'grab',
      }}
      onMouseUp={(e) => { e.currentTarget.style.cursor = hoveredId ? 'pointer' : 'grab'; }}
      onMouseDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--saffron)' }}>
          ◈ FULL METAVERSE CONTROL MODE ◈
        </p>
        <p className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          Drag to Rotate | Scroll to Zoom | Click to Inspect Unit
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 4, 12], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff" />
        <pointLight position={[-5, -2, -3]} intensity={1} color="#FF6B00" />
        <pointLight position={[0, 8, 2]} intensity={1} color="#00D4AA" />
        <fog attach="fog" args={['#040408', 5, 30]} />

        {/* Industrial Grid floor */}
        <Grid
          position={[0, -2.5, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#ff6b00"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#222"
          fadeDistance={25}
          fadeStrength={1}
        />

        <Suspense fallback={null}>
          <ChemistryBackground />
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
          {/* Allow user to freely spin and zoom the plant */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={18}
            maxPolarAngle={Math.PI / 2 - 0.05} // Cannot go under the floor grid
            autoRotate={true}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
