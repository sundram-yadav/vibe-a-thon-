'use client';

import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, MeshDistortMaterial, Sphere, Cylinder, Box, Grid, Torus, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { PlantUnit } from './plantData';

// ─── Floating Formulas Background (Watermark Density) ─────────────────────────
const formulas = [
  'ΔS ≥ 0', 'k = A·e^(-Ea/RT)', 'PV = nRT', 'ΔG = ΔH - TΔS', 
  '[-CH2-CH2-]n', '[-NH-R-CO-]n', '∂ρ/∂t + ∇·(ρv) = 0', 'HΨ = EΨ',
  'Re = ρvD/μ', 'd[A]/dt = -k[A]', 'Sp. Volume', 'Polymerization',
  'CSTR', 'PFR', 'Nusselt', 'Prandtl', 'Gibbs Free Energy'
];

function ChemistryBackground() {
  const items = useMemo(() => {
    // Reduced to 40 formulas for performance stabilization while maintaining watermark spread
    return Array.from({ length: 40 }).map((_, i) => ({
      text: formulas[i % formulas.length],
      position: [
        (Math.random() - 0.5) * 120, // Wider spread X
        (Math.random() - 0.3) * 80,  // Wider spread Y 
        -30 - Math.random() * 40     // Deep pushed back Z to not interfere with units
      ] as [number, number, number],
      rotation: [
        0,
        0,
        (Math.random() - 0.5) * 0.2
      ] as [number, number, number],
      scale: 1.5 + Math.random() * 2.5, // Made them even larger to compensate for lower count
      opacity: 0.01 + Math.random() * 0.03 // Extremely faint opacity for watermark vibe
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 2; // slow breathing
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
          color="#52321c" // Dark brownish-orange for subtle UI watermark look
          fillOpacity={item.opacity}
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

// ─── Pipe Connections with Reaction Text ──────────────────────────────────────
const reactions = [
  '"Pressure Creates Diamonds"', 
  '"Refining the Variables"', 
  '"Iterating over Failures"', 
  '"Catalyzing Ambitions"', 
  '"Extracting Pure Signal"', 
  '"Scaling the Operation"'
];

function PipeConnections({ units }: { units: PlantUnit[] }) {
  const total = units.length;
  // Complex industrial manifold look using 3D tubes + Reaction Labels
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
          <group key={i}>
            <mesh>
              <tubeGeometry args={[curve, 20, 0.04, 8, false]} />
              <meshStandardMaterial color={unit.color} transparent opacity={0.6} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Reaction Process Text - Billboarded for 360-degree visibility */}
            <Billboard position={[(x1 + x2) / 2, -1.8, (z1 + z2) / 2 + 0.5]}>
              <Text 
                fontSize={0.2} 
                color="rgba(255,255,255,0.7)"
                anchorX="center"
                anchorY="middle"
                font="/fonts/SpaceMono-Regular.ttf"
              >
                {reactions[i % reactions.length]}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// ─── Scaffolding / Foundation ─────────────────────────────────────────────────
function Scaffolding({ position, color }: { position: [number, number, number], color: string }) {
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
  const rotationY = useRef(index);
  
  // Arrange in a wide semi-circle
  const angle = (index / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
  const radius = 5.5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius * 0.7;
  const baseY = 0.5 + Math.sin(index * 1.5) * 0.3;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = baseY + Math.sin(t * 0.7 + index * 1.2) * 0.1;
      
      // Only rotate if not hovered
      if (!isHovered) {
        rotationY.current += delta * 0.2;
      }
      meshRef.current.rotation.y = rotationY.current;
      
      const target = isHovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.2);
    }
  });

  const getShape = () => {
    switch (unit.type) {
      case 'reactor':
        // NEW High-Pressure Reactor Design (Ribbed and Industrial instead of basic cylinder)
        return (
          <group ref={meshRef} position={[baseX, baseY, baseZ]}>
            <Cylinder args={[0.5, 0.5, 1.8, 32]}>
              <meshStandardMaterial color={unit.color} metalness={0.9} roughness={0.3} />
            </Cylinder>
            <Sphere args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0.9, 0]}>
              <meshStandardMaterial color={unit.color} metalness={0.9} roughness={0.3} />
            </Sphere>
            <Sphere args={[0.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} position={[0, -0.9, 0]}>
              <meshStandardMaterial color={unit.color} metalness={0.9} roughness={0.3} />
            </Sphere>
            {/* Pressure Rings */}
            <Torus args={[0.52, 0.05, 16, 64]} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
              <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
            </Torus>
            <Torus args={[0.52, 0.05, 16, 64]} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
            </Torus>
            <Torus args={[0.52, 0.05, 16, 64]} position={[0, -0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
              <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
            </Torus>
            {/* Central glowing core inside */}
            <Cylinder args={[0.4, 0.4, 1.5, 16]} position={[0, 0, 0]}>
              <MeshDistortMaterial color={unit.glowColor || unit.color} emissive={unit.glowColor || unit.color} emissiveIntensity={0.5} distort={0.2} speed={3} />
            </Cylinder>
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
      case 'exchanger':
        // Heat Exchanger Complex Tube Bundle
        return (
          <group ref={meshRef} position={[baseX, baseY, baseZ]}>
            <Cylinder args={[0.4, 0.4, 1.2, 16]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#222" metalness={0.9} roughness={0.4} />
            </Cylinder>
            <mesh>
              <torusKnotGeometry args={[0.4, 0.08, 100, 16, 2, 5]} />
              <MeshDistortMaterial color={unit.color} emissive={unit.color} emissiveIntensity={0.8} metalness={1} distort={0.05} />
            </mesh>
          </group>
        );
      default: // feed tank
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
      onPointerOver={() => { document.body.style.cursor = 'pointer'; onHover(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onHover(false); }}
    >
      <Scaffolding position={[baseX, baseY, baseZ]} color={unit.color} />

      {getShape()}

      {/* Prominent Label Highlights */}
      {!isHovered && (
        <group position={[baseX, -1.2, baseZ]}>
          {/* Base Plate */}
          <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 0.8]} />
            <meshBasicMaterial color="rgba(0,0,0,0.8)" transparent opacity={0.8} />
          </mesh>
          
          {/* Unit Name - Scales dramatically on Hover */}
          <Text 
            position={[0, -0.2, 0.01]} 
            fontSize={0.18} 
            color={unit.color} 
            anchorX="center" 
            anchorY="bottom"
          >
            {unit.subtitle.split(' — ')[0]}
          </Text>
          
          <Text 
            position={[0, -0.5, 0.01]} 
            fontSize={0.12} 
            color="rgba(255,255,255,0.6)" 
            anchorX="center" 
            anchorY="bottom"
          >
            {unit.period}
          </Text>
        </group>
      )}

      {isHovered && (
        <Html position={[0, 1, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.9)', border: `1px solid ${unit.color}`, padding: '8px 16px',
            borderRadius: '12px', color: '#fff', fontSize: '14px', whiteSpace: 'nowrap',
            boxShadow: `0 0 20px ${unit.color}`, pointerEvents: 'none',
            fontFamily: 'monospace', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ◉ Inspect Unit
            </span>
            <span style={{ color: unit.color, fontWeight: 'bold' }}>
              {unit.subtitle.split(' — ')[0]}
            </span>
          </div>
        </Html>
      )}
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
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, pointerEvents: 'none' }}>
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
            autoRotate={!hoveredId}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
