"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Símbolo ISIBA em 3D.
   Forma: as 4 faixas do ícone oficial, vetorizadas e trianguladas
   (public/v2/logo/bands.json), viram sólidos curvos sobre uma esfera —
   de frente, o globo reproduz o logo.
   Vida: núcleo luminoso, material com verniz, rede de pontos, anéis
   orbitais e cada faixa "respirando" no próprio ritmo.
------------------------------------------------------------------- */

const R_OUT = 1;
const R_IN = 0.92; // espessura das fitas

// Montagem inicial: de onde cada faixa parte (rotação em x, y, z)
const START: [number, number, number][] = [
  [0.9, 2.4, 0.3],
  [-0.4, -2.8, -0.2],
  [0.6, 2.9, -0.5],
  [-0.9, -2.2, 0.4],
];
/**
 * A 3ª faixa do logo é a continuação da 2ª: a fita larga dá a volta pela
 * lateral direita e segue por TRÁS do globo — por isso no logo ela aparece
 * em outro tom (é a face interna da fita). Fica no hemisfério de trás e se
 * move junto com a 2ª.
 */
const BACK_BAND = 2;

/** Bola central: "solid" (luminosa opaca), "glass" (vidro luminoso) ou "none" */
const CORE: "solid" | "glass" | "none" = "glass" as "solid" | "glass" | "none";
const LINKED_TO: Record<number, number> = { [BACK_BAND]: 1 };

const ASSEMBLY = 1.8; // duração da montagem (s)
const STAGGER = 0.16;

type BandData = { color: string; loop: number; pts: number[]; tris: number[] };

/** Ponto do plano do logo (x,y em [-1,1]) levado à superfície da esfera unitária */
function toSphere(x: number, y: number): THREE.Vector3 {
  const r2 = x * x + y * y;
  const max = 0.995;
  if (r2 > max) {
    const k = Math.sqrt(max / r2);
    x *= k;
    y *= k;
  }
  return new THREE.Vector3(x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y)));
}

/**
 * Sólido de uma faixa: face frontal curva (raio R_OUT), face interna (R_IN)
 * e paredes laterais ao longo do contorno, com normais suaves.
 * Grupos de material: 0 = frente, 1 = face interna, 2 = paredes.
 */
function buildBand(d: BandData, onBack = false) {
  const n = d.pts.length / 2;
  const L = d.loop;
  const unit: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) unit.push(toSphere(d.pts[i * 2], d.pts[i * 2 + 1]));

  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const push = (v: THREE.Vector3, nv: THREE.Vector3) => {
    pos.push(v.x, v.y, v.z);
    nor.push(nv.x, nv.y, nv.z);
    return pos.length / 3 - 1;
  };

  // Faces frontal e interna
  const front = unit.map((u) => push(u.clone().multiplyScalar(R_OUT), u));
  const back = unit.map((u) => push(u.clone().multiplyScalar(R_IN), u.clone().negate()));
  const frontIdx: number[] = [];
  const backIdx: number[] = [];
  for (let t = 0; t < d.tris.length; t += 3) {
    const a = d.tris[t];
    let b = d.tris[t + 1];
    let c = d.tris[t + 2];
    const ax = d.pts[a * 2], ay = d.pts[a * 2 + 1];
    const area = (d.pts[b * 2] - ax) * (d.pts[c * 2 + 1] - ay) - (d.pts[c * 2] - ax) * (d.pts[b * 2 + 1] - ay);
    if (area < 0) [b, c] = [c, b]; // garante sentido anti-horário (voltado para fora)
    frontIdx.push(front[a], front[b], front[c]);
    backIdx.push(back[a], back[c], back[b]);
  }

  // Paredes: normal para fora, média das arestas vizinhas (borda arredondada)
  const wallIdx: number[] = [];
  const outward: THREE.Vector3[] = [];
  for (let i = 0; i < L; i++) {
    const prev = unit[(i - 1 + L) % L];
    const next = unit[(i + 1) % L];
    const e = next.clone().sub(prev);
    outward.push(e.clone().cross(unit[i]).normalize());
  }
  const wf: number[] = [];
  const wb: number[] = [];
  for (let i = 0; i < L; i++) {
    wf.push(push(unit[i].clone().multiplyScalar(R_OUT), outward[i]));
    wb.push(push(unit[i].clone().multiplyScalar(R_IN), outward[i]));
  }
  for (let i = 0; i < L; i++) {
    const j = (i + 1) % L;
    wallIdx.push(wf[i], wb[i], wf[j], wf[j], wb[i], wb[j]);
  }

  idx.push(...frontIdx, ...backIdx, ...wallIdx);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  g.addGroup(0, frontIdx.length, 0);
  g.addGroup(frontIdx.length, backIdx.length, 1);
  g.addGroup(frontIdx.length + backIdx.length, wallIdx.length, 2);
  if (onBack) {
    // Espelha para o hemisfério de trás e corrige o sentido dos triângulos
    g.scale(1, 1, -1);
    const ix = g.getIndex()!;
    for (let i = 0; i < ix.count; i += 3) {
      const b = ix.getX(i + 1);
      ix.setX(i + 1, ix.getX(i + 2));
      ix.setX(i + 2, b);
    }
    ix.needsUpdate = true;
  }
  g.computeBoundingSphere();
  return g;
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

function Band({ index, data, startAt }: { index: number; data: BandData; startAt: React.RefObject<number | null> }) {
  const ref = useRef<THREE.Group>(null);
  const isBack = index === BACK_BAND;
  const geometry = useMemo(() => buildBand(data, isBack), [data, isBack]);

  const materials = useMemo(() => {
    const base = new THREE.Color(data.color);
    const face = new THREE.MeshPhysicalMaterial({
      color: base.clone().offsetHSL(0, 0.04, 0.05),
      roughness: 0.22,
      metalness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const inner = new THREE.MeshStandardMaterial({ color: base.clone().offsetHSL(0, -0.05, -0.1), roughness: 0.5 });
    const wall = new THREE.MeshPhysicalMaterial({
      color: base.clone().offsetHSL(0, 0, 0.1),
      roughness: 0.3,
      clearcoat: 0.6,
    });
    // Na faixa de trás, quem aparece para a câmera é a face interna (côncava):
    // ela recebe o acabamento claro; a face externa fica voltada para trás.
    if (isBack) {
      // Face interna da fita: teal um pouco mais claro que a 2ª faixa, acetinado
      const concave = new THREE.MeshPhysicalMaterial({
        color: base.clone().offsetHSL(0, 0.02, 0.02),
        roughness: 0.38,
        metalness: 0.05,
        clearcoat: 0.35,
        clearcoatRoughness: 0.3,
      });
      face.dispose();
      return [inner, concave, wall];
    }
    return [face, inner, wall];
  }, [data.color, isBack]);

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials]
  );

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // "Respiração" própria de cada faixa (sempre volta ao desenho do logo)
    const phase = LINKED_TO[index] ?? index; // a faixa de trás acompanha a 2ª
    const breatheY = Math.sin(t * 0.45 + phase * 1.3) * 0.11;
    const breatheX = Math.sin(t * 0.33 + phase * 0.9) * 0.04;

    let k = 1;
    if (startAt.current !== null) {
      k = easeOut((t - startAt.current - phase * STAGGER) / ASSEMBLY);
    }
    const [sx, sy, sz] = START[phase];
    g.rotation.set(sx * (1 - k) + breatheX * k, sy * (1 - k) + breatheY * k, sz * (1 - k));
    g.scale.setScalar(0.9 + 0.1 * k);
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry} material={materials} />
    </group>
  );
}

function LogoGlobe() {
  const raw = useLoader(THREE.FileLoader, "/v2/logo/bands.json") as string;
  const bands = useMemo(() => (JSON.parse(raw) as { bands: BandData[] }).bands, [raw]);

  // Início da montagem (null = já montado, para quem prefere menos movimento)
  const startAt = useRef<number | null>(null);
  const clock = useThree((s) => s.clock);
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAt.current = clock.elapsedTime + 0.25;
    }
  }, [clock]);

  return (
    <group>
      {bands.map((b, i) => (
        <Band key={i} index={i} data={b} startAt={startAt} />
      ))}
      {CORE === "solid" && (
        <mesh>
          <sphereGeometry args={[0.5, 48, 48]} />
          <meshStandardMaterial color="#0b3b3c" emissive="#23a8a3" emissiveIntensity={1.5} roughness={0.4} />
        </mesh>
      )}
      {CORE === "glass" && (
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshPhysicalMaterial
            color="#6dd7d2"
            emissive="#23a8a3"
            emissiveIntensity={0.45}
            transmission={0.9}
            thickness={0.6}
            roughness={0.12}
            ior={1.35}
            clearcoat={1}
          />
        </mesh>
      )}
      {/* Luz interna: ilumina a face interna da fita de trás */}
      <pointLight color="#6dd7d2" intensity={1.6} distance={3} />
    </group>
  );
}

/** Pontos em distribuição de Fibonacci formando uma rede esférica */
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
        opacity={0.5}
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
        <meshBasicMaterial color="#6dd7d2" transparent opacity={0.28} />
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
  const symbol = useRef<THREE.Group>(null);
  const { size } = useThree();
  // Em telas estreitas o canvas ocupa só o topo do hero → globo centralizado
  const isNarrow = size.width < 1024;

  useFrame((state, delta) => {
    if (!group.current || !symbol.current) return;
    const t = state.clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const { x, y } = state.pointer;

    // Conjunto (rede + anéis + símbolo) segue o ponteiro e gira com o scroll
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.22 + scroll * 0.6, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.35 + scroll * 1.2, 3, delta);
    const targetScale = (isNarrow ? 0.8 : 0.9) * (1 - scroll * 0.25);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, delta));
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, (isNarrow ? 0.15 : 0) + scroll * 0.8, 4, delta);

    // O símbolo balança suavemente em torno da vista frontal (logo legível)
    symbol.current.rotation.y = Math.sin(t * 0.3) * 0.22;
  });

  return (
    <group ref={group} position={[isNarrow ? 0 : 2.05, 0, 0]}>
      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.6}>
        <group ref={symbol}>
          <LogoGlobe />
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
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </Canvas>
  );
}
