'use client';

import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, MeshDistortMaterial, Sphere, Cylinder, Box, Grid, Torus, Html, Billboard, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { PlantUnit } from './plantData';

// ─── Floating Formulas Background ─────────────────────────────────────────────
const formulas = [
  'ΔS ≥ 0', 'k = A·e^(-Ea/RT)', 'PV = nRT', 'ΔG = ΔH - TΔS', 
  '[-CH2-CH2-]n', '[-NH-R-CO-]n', '∂ρ/∂t + ∇·(ρv) = 0', 'HΨ = EΨ',
  'Re = ρvD/μ', 'd[A]/dt = -k[A]', 'Sp. Volume', 'Polymerization',
  'CSTR', 'PFR', 'Nusselt', 'Prandtl', 'Gibbs Free Energy'
];

function ChemistryBackground() {
  const items = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      text: formulas[i % formulas.length],
      position: [
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.3) * 80,
        -30 - Math.random() * 40
      ] as [number, number, number],
      rotation: [0, 0, (Math.random() - 0.5) * 0.2] as [number, number, number],
      scale: 1.5 + Math.random() * 2.5,
      opacity: 0.01 + Math.random() * 0.03
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 2;
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
          color="#52321c"
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

// ─── Pipe Connections with Reaction Text (AutoCAD Style) ──────────────────────
const reactions = [
  '"Pressure Creates Diamonds"', 
  '"Refining the Variables"', 
  '"Iterating over Failures"', 
  '"Catalyzing Ambitions"', 
  '"Extracting Pure Signal"', 
  '"Scaling the Operation"'
];

function CADPipe({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  const points = useMemo(() => [
    start,
    new THREE.Vector3(start.x, -2, start.z),
    new THREE.Vector3(end.x, -2, start.z),
    new THREE.Vector3(end.x, -2, end.z),
    new THREE.Vector3(end.x, -1.5, end.z),
  ], [start, end]);
  
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1), [points]);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.1} 
        emissive={color} 
        emissiveIntensity={0.2}
      />
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
        
        const start = new THREE.Vector3(Math.sin(a1) * r, -0.5, -Math.cos(a1) * r * 0.7);
        const end = new THREE.Vector3(Math.sin(a2) * r, -0.5, -Math.cos(a2) * r * 0.7);
        const textPos = new THREE.Vector3((start.x + end.x)/2, -1.8, (start.z + end.z)/2);

        return (
          <group key={i}>
            <CADPipe start={start} end={end} color={unit.color} />
            <Billboard position={[textPos.x, textPos.y, textPos.z + 0.5]}>
              <Text fontSize={0.2} color="rgba(255,255,255,0.8)" anchorX="center" anchorY="middle">
                {reactions[i % reactions.length]}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// ─── Industrial Equipment Components (CAD Detail) ─────────────────────────────

function VesselLegs({ color }: { color: string }) {
  return (
    <group position={[0, -0.8, 0]}>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.4, -0.5, Math.sin(angle) * 0.4]}>
            <cylinderGeometry args={[0.04, 0.06, 1, 8]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
            <Edges color={color} />
          </mesh>
        );
      })}
    </group>
  );
}

function IndustrialEquipment({ unit, color }: { unit: PlantUnit, color: string }) {
  const commonMat = <meshStandardMaterial color={unit.color} metalness={0.6} roughness={0.1} />;
  const steelMat = <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />;

  switch (unit.type) {
    case 'reactor':
      return (
        <group scale={0.7}>
          <mesh><cylinderGeometry args={[0.6, 0.6, 1.8, 32]} />{commonMat}<Edges color="#fff" /></mesh>
          <mesh position={[0, 0.9, 0]}><sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{commonMat}<Edges color="#fff" /></mesh>
          <mesh position={[0, -0.9, 0]}><sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />{commonMat}<Edges color="#fff" /></mesh>
          <group position={[0, 1.3, 0]}>
            <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.3, 0.4, 0.3]} />{steelMat}<Edges color={color} /></mesh>
            <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />{steelMat}</mesh>
          </group>
          <VesselLegs color={color} />
        </group>
      );
    case 'tower':
      return (
        <group scale={0.7}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.35, 0.45, 3.5, 32]} />{commonMat}<Edges color="#fff" /></mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, -0.8 + i * 0.9, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.42, 0.03, 8, 32]} />{steelMat}
            </mesh>
          ))}
          <VesselLegs color={color} />
        </group>
      );
    case 'exchanger':
      return (
        <group rotation={[0, 0, Math.PI / 2]} scale={0.8}>
          <mesh><cylinderGeometry args={[0.5, 0.5, 1.8, 32]} />{commonMat}<Edges color="#fff" /></mesh>
          <mesh position={[0, 0.9, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.55, 0.08, 12, 32]} />{steelMat}<Edges color="#fff" /></mesh>
          <mesh position={[0, -0.9, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.55, 0.08, 12, 32]} />{steelMat}<Edges color="#fff" /></mesh>
          <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, -Math.PI/2]}><cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />{steelMat}</mesh>
        </group>
      );
    case 'compressor':
      return (
        <group scale={0.7}>
          <mesh><octahedronGeometry args={[0.8, 0]} /><meshStandardMaterial color={color} metalness={0.9} roughness={0.1} wireframe /></mesh>
          <mesh><octahedronGeometry args={[0.6, 0]} />{commonMat}<Edges color="#fff" /></mesh>
          <VesselLegs color={color} />
        </group>
      );
    case 'separator':
      return (
        <group scale={0.7}>
          <mesh rotation={[Math.PI/2, 0, 0]}><capsuleGeometry args={[0.4, 1.2, 16, 32]} />{commonMat}<Edges color="#fff" /></mesh>
          <mesh position={[0.45, 0, 0]}><boxGeometry args={[0.1, 0.8, 0.05]} /><meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.6} /></mesh>
          <VesselLegs color={color} />
        </group>
      );
    default:
      return (
        <group scale={0.7}>
          <mesh><cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />{commonMat}<Edges color="#fff" /></mesh>
          <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />{steelMat}<Edges color="#fff" /></mesh>
          <VesselLegs color={color} />
        </group>
      );
  }
}

function Scaffolding({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      {/* Heavy Steel Base Plate */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[1.8, 0.15, 1.8]} />
        <meshStandardMaterial color="#777" metalness={0.9} roughness={0.2} />
        <Edges color={color} />
      </mesh>
      {/* Support Rails */}
      <mesh position={[0.85, -1, 0.85]}>
        <boxGeometry args={[0.06, 1.6, 0.06]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.1} />
        <Edges color={color} />
      </mesh>
      <mesh position={[-0.85, -1, -0.85]}>
        <boxGeometry args={[0.06, 1.6, 0.06]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.1} />
        <Edges color={color} />
      </mesh>
    </group>
  );
}

function ReactorVessel({ unit, index, total, onClick, isHovered, onHover }: { unit: PlantUnit; index: number; total: number; onClick: () => void; isHovered: boolean; onHover: (h: boolean) => void; }) {
  const meshRef = useRef<THREE.Group>(null!);
  const rotationY = useRef(index);
  const angle = (index / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
  const radius = 5.5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius * 0.7;
  const baseY = 0.5;

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (!isHovered) { rotationY.current += delta * 0.2; }
      meshRef.current.rotation.y = rotationY.current;
      const target = isHovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
  });

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; onHover(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onHover(false); }}
    >
      <Scaffolding position={[baseX, baseY, baseZ]} color={unit.color} />
      <group ref={meshRef} position={[baseX, baseY, baseZ]}>
        <IndustrialEquipment unit={unit} color={unit.color} />
      </group>
      {!isHovered && (
        <group position={[baseX, -1.2, baseZ]}>
          <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.5, 0.8]} /><meshBasicMaterial color="rgba(0,0,0,0.85)" transparent opacity={0.8} /></mesh>
          <Text position={[0, -0.2, 0.01]} fontSize={0.18} color={unit.color} anchorX="center" anchorY="bottom">{unit.subtitle.split(' — ')[0]}</Text>
          <Text position={[0, -0.5, 0.01]} fontSize={0.12} color="rgba(255,255,255,0.6)" anchorX="center" anchorY="bottom">{unit.period}</Text>
        </group>
      )}
      {isHovered && (
        <Html position={[baseX, baseY + 1.2, baseZ]} center>
          <div style={{
            background: 'rgba(0,0,0,0.9)', border: `2px solid ${unit.color}`, padding: '8px 16px',
            borderRadius: '12px', color: '#fff', fontSize: '14px', whiteSpace: 'nowrap',
            boxShadow: `0 0 30px ${unit.color}`, pointerEvents: 'none',
            fontFamily: 'monospace', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>◉ Inspect Unit</span>
            <span style={{ color: unit.color, fontWeight: 'bold', fontSize: '16px' }}>{unit.subtitle.split(' — ')[0]}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

interface ReactorScene3DProps {
  units: PlantUnit[];
  onUnitClick: (unit: PlantUnit) => void;
}

export default function ReactorScene3D({ units, onUnitClick }: ReactorScene3DProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,107,0,0.2)', background: 'radial-gradient(ellipse at center, rgba(16,10,14,1) 0%, rgba(4,4,8,1) 100%)', boxShadow: '0 0 60px rgba(255,107,0,0.05) inset' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, pointerEvents: 'none' }}>
        <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--saffron)' }}>◈ FULL METAVERSE CONTROL MODE ◈</p>
        <p className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Drag to Rotate | Scroll to Zoom | Click to Inspect Unit</p>
      </div>

      <Canvas camera={{ position: [0, 4, 12], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff" />
        <pointLight position={[-5, -2, -3]} intensity={1} color="#FF6B00" />
        <pointLight position={[0, 8, 2]} intensity={1} color="#00D4AA" />
        <fog attach="fog" args={['#040408', 5, 30]} />
        <Grid position={[0, -2.5, 0]} args={[40, 40]} cellSize={1} cellThickness={0.5} cellColor="#ff6b00" sectionSize={5} sectionThickness={1} sectionColor="#222" fadeDistance={25} fadeStrength={1} />
        <Suspense fallback={null}>
          <ChemistryBackground />
          <PipeConnections units={units} />
          {units.map((unit, i) => (
            <ReactorVessel key={unit.id} unit={unit} index={i} total={units.length} onClick={() => onUnitClick(unit)} isHovered={hoveredId === unit.id} onHover={(h) => setHoveredId(h ? unit.id : null)} />
          ))}
          <OrbitControls enablePan={false} enableZoom={true} minDistance={4} maxDistance={18} maxPolarAngle={Math.PI / 2 - 0.05} autoRotate={!hoveredId} autoRotateSpeed={0.5} dampingFactor={0.05} />
        </Suspense>
      </Canvas>
    </div>
  );
}
