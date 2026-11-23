"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Símbolo ISIBA em 3D.
   Forma: as 4 faixas do ícone oficial (public/v2/logo/band*.png) projetadas
   sobre uma esfera — de frente, o globo reproduz o logo.
   Vida: núcleo luminoso, material com verniz, rede de pontos, anéis
   orbitais e cada faixa "respirando" no próprio ritmo.
------------------------------------------------------------------- */

const BANDS = [0, 1, 2, 3];
const LAYERS = 10; // cascas empilhadas que dão espessura às fitas
const THICKNESS = 0.06;

// Montagem inicial: de onde cada faixa parte (rotação em x, y, z)
const START: [number, number, number][] = [
  [0.9, 2.4, 0.3],
  [-0.4, -2.8, -0.2],
  [0.6, 2.9, -0.5],
  [-0.9, -2.2, 0.4],
];
const ASSEMBLY = 1.8; // duração da montagem (s)
const STAGGER = 0.16;

/**
 * Esfera com UV planar (projeção frontal). Cobre o hemisfério frontal e um
 * pouco além das laterais: os vãos do logo ficam abertos (mostrando o núcleo)
 * e as faixas "dobram" pelas bordas quando o globo gira.
 */
function projectedSphere(w: number, h: number) {
  const wrap = 0.35;
  const g = new THREE.SphereGeometry(1, w, h, -wrap, Math.PI + wrap * 2);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) * 0.5 + 0.5, pos.getY(i) * 0.5 + 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

function Band({
  index,
  geometry,
  colorMap,
  alphaMap,
  startAt,
}: {
  index: number;
  geometry: { outer: THREE.SphereGeometry; inner: THREE.SphereGeometry };
  colorMap: THREE.Texture;
  alphaMap: THREE.Texture;
  startAt: React.RefObject<number | null>;
}) {
  const ref = useRef<THREE.Group>(null);

  const materials = useMemo(
    () =>
      Array.from({ length: LAYERS }, (_, l) => {
        const outer = l === 0;
        return outer
          ? new THREE.MeshPhysicalMaterial({
              map: colorMap,
              color: "#c9fbf8", // clareia o teal do logo para o verniz brilhar
              alphaMap,
              alphaTest: 0.5,
              side: THREE.DoubleSide,
              roughness: 0.2,
              metalness: 0.15,
              clearcoat: 1,
              clearcoatRoughness: 0.12,
            })
          : new THREE.MeshStandardMaterial({
              color: "#13605e",
              alphaMap,
              alphaTest: 0.5,
              side: THREE.DoubleSide,
              roughness: 0.55,
            });
      }),
    [colorMap, alphaMap]
  );

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // "Respiração" própria de cada faixa (sempre volta ao desenho do logo)
    const breatheY = Math.sin(t * 0.45 + index * 1.3) * 0.11;
    const breatheX = Math.sin(t * 0.33 + index * 0.9) * 0.04;

    let k = 1;
    if (startAt.current !== null) {
      k = easeOut((t - startAt.current - index * STAGGER) / ASSEMBLY);
    }
    const [sx, sy, sz] = START[index];
    g.rotation.set(sx * (1 - k) + breatheX * k, sy * (1 - k) + breatheY * k, sz * (1 - k));
    g.scale.setScalar(0.9 + 0.1 * k);
  });

  return (
    <group ref={ref}>
      {materials.map((m, l) => (
        <mesh
          key={l}
          geometry={l === 0 ? geometry.outer : geometry.inner}
          material={m}
          scale={1 - (l * THICKNESS) / (LAYERS - 1)}
        />
      ))}
    </group>
  );
}

function LogoGlobe() {
  const geometry = useMemo(() => ({ outer: projectedSphere(144, 108), inner: projectedSphere(80, 60) }), []);
  const [color, b0, b1, b2, b3] = useTexture(
    ["/v2/logo/color.webp", "/v2/logo/band0.png", "/v2/logo/band1.png", "/v2/logo/band2.png", "/v2/logo/band3.png"],
    (tex) => {
      const [c] = tex as THREE.Texture[];
      c.colorSpace = THREE.SRGBColorSpace;
      c.anisotropy = 8;
    }
  );
  const masks = [b0, b1, b2, b3];

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
      {BANDS.map((i) => (
        <Band key={i} index={i} geometry={geometry} colorMap={color} alphaMap={masks[i]} startAt={startAt} />
      ))}
      {/* Núcleo luminoso, visto pelos vãos do símbolo */}
      <mesh>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial color="#0b3b3c" emissive="#23a8a3" emissiveIntensity={1.5} roughness={0.4} />
      </mesh>
      <pointLight color="#6dd7d2" intensity={5} distance={3.5} />
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
