"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { cidades, sede, type Cidade } from "@/data/atuacao";

// Enquadra Salvador (sede), Camaçari e Dias d'Ávila
const CENTER = { lat: -12.77, lon: -38.4 };
const K = 7;

function project(lat: number, lon: number): [number, number, number] {
  return [(lon - CENTER.lon) * K, 0, -(lat - CENTER.lat) * K];
}

/** Malha de pontos que "acende" perto das unidades */
function DotField() {
  const { positions, colors } = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    const hot = [sede, ...cidades].map((c) => project(c.lat, c.lon));
    const base = new THREE.Color("#1a8784");
    const glow = new THREE.Color("#a2e8e4");
    const step = 0.16;
    for (let x = -3.6; x <= 3.6; x += step) {
      for (let z = -2.4; z <= 2.4; z += step) {
        const edge = 1 - Math.min(1, Math.hypot(x / 3.7, z / 2.5));
        if (edge <= 0.02) continue;
        let heat = 0;
        for (const h of hot) heat = Math.max(heat, 1 - Math.min(1, Math.hypot(x - h[0], z - h[2]) / 0.9));
        pts.push(x, 0, z);
        const c = base.clone().lerp(glow, heat * 0.85).multiplyScalar(0.35 + edge * 0.9);
        cols.push(c.r, c.g, c.b);
      }
    }
    return { positions: new Float32Array(pts), colors: new Float32Array(cols) };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

function Arc({ to, active }: { to: [number, number, number]; active: boolean }) {
  const ref = useRef<{ material: { dashOffset: number } } | null>(null);
  const from = project(sede.lat, sede.lon);
  const points = useMemo(() => {
    const mid = new THREE.Vector3((from[0] + to[0]) / 2, 0.25 + Math.hypot(from[0] - to[0], from[2] - to[2]) * 0.35, (from[2] + to[2]) / 2);
    return new THREE.QuadraticBezierCurve3(new THREE.Vector3(...from), mid, new THREE.Vector3(...to)).getPoints(48);
  }, [from, to]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.material.dashOffset -= delta * 0.6;
  });

  return (
    <Line
      // @ts-expect-error -- o ref do Line2 expõe o material com dashOffset
      ref={ref}
      points={points}
      color={active ? "#cff4f2" : "#3ec2bd"}
      lineWidth={active ? 2.2 : 1.2}
      dashed
      dashSize={0.12}
      gapSize={0.08}
      transparent
      opacity={active ? 1 : 0.55}
    />
  );
}

function Pin({
  cidade,
  active,
  isSede,
  onHover,
  portal,
}: {
  cidade: Cidade;
  active: boolean;
  isSede?: boolean;
  onHover?: () => void;
  portal: RefObject<HTMLDivElement | null>;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);
  const pos = project(cidade.lat, cidade.lon);
  const height = isSede ? 0.75 : 0.35 + cidade.unidades.length * 0.08;

  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.6 + pos[0]) % 1;
    if (ring.current) {
      ring.current.scale.setScalar(0.4 + t * (active ? 2.6 : 1.6));
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (active ? 0.9 : 0.5);
    }
    if (head.current) {
      const s = THREE.MathUtils.lerp(head.current.scale.x, active ? 1.6 : 1, 0.12);
      head.current.scale.setScalar(s);
    }
  });

  return (
    <group position={pos} onPointerOver={onHover}>
      <mesh ref={ring} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.09, 0.11, 48]} />
        <meshBasicMaterial color={isSede ? "#ffffff" : "#6dd7d2"} transparent />
      </mesh>
      <mesh position-y={height / 2}>
        <cylinderGeometry args={[0.008, 0.008, height, 8]} />
        <meshBasicMaterial color="#a2e8e4" transparent opacity={0.7} />
      </mesh>
      <mesh ref={head} position-y={height}>
        <sphereGeometry args={[isSede ? 0.065 : 0.05, 24, 24]} />
        <meshStandardMaterial color={isSede ? "#ffffff" : "#6dd7d2"} emissive={isSede ? "#ffffff" : "#3ec2bd"} emissiveIntensity={active ? 2.5 : 1.2} />
      </mesh>
      <Html portal={portal as RefObject<HTMLElement>} position={[cidade.labelOffset ?? 0, height + 0.16, 0]} center distanceFactor={7} zIndexRange={[10, 0]}>
        <div
          className={`whitespace-nowrap rounded border px-2 py-0.5 text-[9px] font-semibold sm:px-3 sm:py-1 sm:text-[11px] ${active || isSede ? "" : "max-sm:hidden"} tracking-wide transition-colors duration-300 select-none ${
            active
              ? "border-brand-300 bg-ink-900 text-white"
              : "border-white/15 bg-ink-900/80 text-slate-200"
          }`}
        >
          {cidade.nome}
        </div>
      </Html>
    </group>
  );
}

function Scene({ active, onHover, portal }: { active: number; onHover: (i: number) => void; portal: RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.18, 2.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.06, 2.5, delta);
  });

  return (
    <group ref={group}>
      <DotField />
      {cidades.map((c, i) => (
        <Arc key={`arc-${c.nome}`} to={project(c.lat, c.lon)} active={active === i} />
      ))}
      <Pin cidade={sede} active={false} isSede portal={portal} />
      {cidades.map((c, i) => (
        <Pin key={c.nome} cidade={c} active={active === i} onHover={() => onHover(i)} portal={portal} />
      ))}
    </group>
  );
}

export default function MapScene({ active, onHover }: { active: number; onHover: (i: number) => void }) {
  // Rótulos HTML vão para uma camada própria (fora da árvore do <Canvas>),
  // evitando conflito de remoção de nós quando a cena é desmontada.
  const labels = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-full w-full">
      <div ref={labels} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" />
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 5.2, 5.6], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 3, 0]} intensity={4} color="#6dd7d2" />
      <Scene active={active} onHover={onHover} portal={labels} />
      </Canvas>
    </div>
  );
}
