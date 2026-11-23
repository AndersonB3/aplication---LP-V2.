"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Símbolo ISIBA em 3D.
   Cada uma das 4 faixas do ícone oficial (public/v2/logo/band*.png) é
   projetada sobre uma esfera: visto de frente, o globo reproduz o logo
   exatamente; ao girar, as faixas aparecem como fitas curvas com espessura.
------------------------------------------------------------------- */

const BANDS = [0, 1, 2, 3];
const LAYERS = 10; // cascas empilhadas que dão espessura às fitas
const THICKNESS = 0.05;

// De onde cada faixa parte na montagem inicial (rotação em x, y, z)
const START: [number, number, number][] = [
  [0.9, 2.4, 0.3],
  [-0.4, -2.8, -0.2],
  [0.6, 2.9, -0.5],
  [-0.9, -2.2, 0.4],
];
const ASSEMBLY = 1.8; // duração da montagem (s)
const STAGGER = 0.16;

/** Esfera com UV planar (projeção frontal): u,v = posição x,y normalizada */
function projectedSphere(w: number, h: number) {
  // Só o hemisfério frontal (z > 0): os vãos entre as faixas ficam vazados,
  // como no logo, em vez de mostrar as faixas do lado de trás.
  const g = new THREE.SphereGeometry(1, w, h, 0, Math.PI);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) * 0.5 + 0.5, pos.getY(i) * 0.5 + 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

/** Casca externa em alta resolução; internas (só aparecem na borda) mais leves */
function useProjectedSpheres() {
  return useMemo(() => ({ outer: projectedSphere(128, 96), inner: projectedSphere(72, 54) }), []);
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
        return new THREE.MeshPhysicalMaterial({
          map: outer ? colorMap : null,
          color: outer ? "#ffffff" : new THREE.Color("#1d8581"),
          alphaMap,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
          roughness: outer ? 0.32 : 0.6,
          metalness: 0.05,
          clearcoat: outer ? 0.8 : 0,
          clearcoatRoughness: 0.25,
        });
      }),
    [colorMap, alphaMap]
  );

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    if (startAt.current === null) {
      g.rotation.set(0, 0, 0);
      return;
    }
    const t = easeOut((state.clock.elapsedTime - startAt.current - index * STAGGER) / ASSEMBLY);
    const [sx, sy, sz] = START[index];
    g.rotation.set(sx * (1 - t), sy * (1 - t), sz * (1 - t));
    g.scale.setScalar(0.92 + 0.08 * t);
  });

  return (
    <group ref={ref}>
      {materials.map((m, l) => (
        <mesh key={l} geometry={l === 0 ? geometry.outer : geometry.inner} material={m} scale={1 - (l * THICKNESS) / (LAYERS - 1)} />
      ))}
    </group>
  );
}

function LogoGlobe() {
  const geometry = useProjectedSpheres();
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
    const t = state.clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const { x, y } = state.pointer;

    // Balanço lento em torno da posição do logo + ponteiro + scroll.
    // Amplitude contida para o símbolo continuar reconhecível.
    const swayY = Math.sin(t * 0.32) * 0.2;
    const swayX = Math.sin(t * 0.23) * 0.06;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, swayY + x * 0.18 + scroll * 1.1, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, swayX - y * 0.12 + scroll * 0.4, 3, delta);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      Math.sin(t * 0.6) * 0.05 + scroll * 0.8,
      4,
      delta
    );
    const targetScale = (isNarrow ? 0.95 : 1.05) * (1 - scroll * 0.25);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, delta));
  });

  return (
    <group position={[isNarrow ? 0 : 1.75, 0, 0]}>
      <group ref={group}>
        <LogoGlobe />
      </group>
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
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#a2e8e4" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.5} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#cff4f2" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="circle" intensity={1} position={[4, -2, 4]} scale={2} />
      </Environment>
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </Canvas>
  );
}
