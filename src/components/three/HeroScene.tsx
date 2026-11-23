"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Globo helicoidal — interpretação 3D do símbolo da ISIBA:
   uma esfera "fatiada" em faixas que giram em espiral.
------------------------------------------------------------------- */

const BANDS = [
  { start: 0.32, length: 0.5, phi: 0.0, open: 4.3 },
  { start: 0.9, length: 0.5, phi: 1.1, open: 4.6 },
  { start: 1.48, length: 0.5, phi: 2.3, open: 4.6 },
  { start: 2.06, length: 0.5, phi: 3.4, open: 4.2 },
  { start: 2.62, length: 0.3, phi: 4.4, open: 3.4 },
];

function HelixBand({
  start,
  length,
  phi,
  open,
  index,
}: (typeof BANDS)[number] & { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const outer = useMemo(
    () => new THREE.SphereGeometry(1, 128, 24, phi, open, start, length),
    [phi, open, start, length]
  );
  const inner = useMemo(
    () => new THREE.SphereGeometry(0.965, 128, 24, phi, open, start, length),
    [phi, open, start, length]
  );

  useFrame((state) => {
    if (!ref.current) return;
    // Cada faixa respira em fase diferente → sensação de "espiral viva"
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.35 + index * 0.7) * 0.12 + t * 0.05 * (index % 2 ? 1 : -1);
  });

  return (
    <group ref={ref}>
      <mesh geometry={outer}>
        <meshPhysicalMaterial
          color="#3ec2bd"
          roughness={0.22}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#13605e" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Pontos em distribuição de Fibonacci formando uma "rede" esférica de dados */
function DataShell({ count = 1400, radius = 1.55 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      arr[i * 3] = Math.cos(theta) * r * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#a2e8e4"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Anel orbital com "satélites" */
function OrbitRing({ radius, tilt, speed, dots }: { radius: number; tilt: [number, number, number]; speed: number; dots: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.0035, 8, 256]} />
        <meshBasicMaterial color="#6dd7d2" transparent opacity={0.22} />
      </mesh>
      <group ref={ref}>
        {Array.from({ length: dots }).map((_, i) => {
          const a = (i / dots) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshBasicMaterial color="#cff4f2" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  // Em telas estreitas o canvas ocupa só o topo do hero → globo centralizado
  const isNarrow = size.width < 1024;

  useFrame((state, delta) => {
    if (!group.current) return;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const { x, y } = state.pointer;

    // Segue o ponteiro suavemente + gira/afasta conforme o scroll
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.25 + scroll * 0.6, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.4 + scroll * 1.2, 3, delta);
    const targetScale = (isNarrow ? 0.8 : 0.86) * (1 - scroll * 0.25);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, delta));
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, (isNarrow ? 0.15 : 0) + scroll * 0.8, 4, delta);
  });

  return (
    <group ref={group} position={[isNarrow ? 0 : 2.05, 0, 0]}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <group rotation={[0.15, 0, -0.42]}>
          {BANDS.map((b, i) => (
            <HelixBand key={i} {...b} index={i} />
          ))}
          {/* Núcleo luminoso */}
          <mesh>
            <sphereGeometry args={[0.55, 48, 48]} />
            <meshStandardMaterial color="#0b3b3c" emissive="#23a8a3" emissiveIntensity={1.6} roughness={0.4} />
          </mesh>
          <pointLight color="#6dd7d2" intensity={6} distance={4} />
        </group>
        <DataShell />
        <OrbitRing radius={2.05} tilt={[1.25, 0.15, 0]} speed={0.15} dots={3} />
        <OrbitRing radius={2.45} tilt={[1.4, -0.35, 0.3]} speed={-0.1} dots={2} />
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.8} color="#3ec2bd" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#6dd7d2" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#a2e8e4" position={[4, -2, 4]} scale={3} />
      </Environment>
      <Rig />
    </Canvas>
  );
}
