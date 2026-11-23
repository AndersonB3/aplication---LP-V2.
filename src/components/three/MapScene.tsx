"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cidades, sede, type Unidade } from "@/data/atuacao";

/* ------------------------------------------------------------------
   Maquete 3D da Região Metropolitana de Salvador.
   Divisas municipais: IBGE (malhas, qualidade máxima), recortadas pelo
   litoral do OpenStreetMap (© OpenStreetMap contributors, ODbL) —
   arquivo gerado em public/v2/map/rms.json.
------------------------------------------------------------------- */

type Ring = [number, number][];
type MapData = {
  lon0: number;
  lat0: number;
  k: number;
  cos: number;
  municipios: { nome: string; isiba: boolean; polys: { ext: Ring; holes: Ring[] }[] }[];
};

const H_ISIBA = 0.16; // altura das placas dos municípios com unidades
const H_OTHER = 0.05;
const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/** lat/lon → coordenadas da cena (x = leste, z = sul) */
function useProject(data: MapData) {
  return useMemo(
    () => (lat: number, lon: number, y = 0) =>
      new THREE.Vector3((lon - data.lon0) * data.cos * data.k, y, -(lat - data.lat0) * data.k),
    [data]
  );
}

/* ---------------- Relevo dos municípios ---------------- */

function Municipios({ data }: { data: MapData }) {
  const items = useMemo(() => {
    return data.municipios.flatMap((m) =>
      m.polys.map((p, i) => {
        const shape = new THREE.Shape(p.ext.map(([x, y]) => new THREE.Vector2(x, y)));
        shape.holes = p.holes.map((h) => new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
        const depth = m.isiba ? H_ISIBA : H_OTHER;
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelThickness: 0.012,
          bevelSize: 0.012,
          bevelSegments: 2,
          curveSegments: 1,
        });
        geo.rotateX(-Math.PI / 2); // plano XY → chão XZ (y vira -z = norte)
        // Contorno no topo (divisa)
        const border = new THREE.BufferGeometry().setFromPoints(
          [...p.ext, p.ext[0]].map(([x, y]) => new THREE.Vector3(x, depth + 0.014, -y))
        );
        return { key: `${m.nome}-${i}`, geo, border, isiba: m.isiba };
      })
    );
  }, [data]);

  useEffect(
    () => () =>
      items.forEach((it) => {
        it.geo.dispose();
        it.border.dispose();
      }),
    [items]
  );

  const matIsiba = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1f9b96", roughness: 0.45, metalness: 0.1 }), []);
  const matOther = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1d3c42", roughness: 0.85 }), []);
  const lineIsiba = useMemo(() => new THREE.LineBasicMaterial({ color: "#a2e8e4", transparent: true, opacity: 0.85 }), []);
  const lineOther = useMemo(() => new THREE.LineBasicMaterial({ color: "#4d7a80", transparent: true, opacity: 0.5 }), []);

  return (
    <group>
      {items.map((it) => (
        <group key={it.key}>
          <mesh geometry={it.geo} material={it.isiba ? matIsiba : matOther} />
          <lineSegments geometry={it.border} material={it.isiba ? lineIsiba : lineOther} />
        </group>
      ))}
    </group>
  );
}

/** Mar com leve brilho e ondulação */
function Water() {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (ref.current) ref.current.emissiveIntensity = 0.16 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial ref={ref} color="#0b2a30" emissive="#0f4a4c" roughness={0.25} metalness={0.4} />
    </mesh>
  );
}

/* ---------------- Unidades ---------------- */

function Building({ tipo, active }: { tipo: Unidade["tipo"]; active: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = (state.clock.elapsedTime * 0.7) % 1;
    ring.current.scale.setScalar(0.6 + t * (active ? 3 : 1.8));
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (active ? 0.9 : 0.45);
  });

  const glow = active ? 1.4 : 0.6;
  return (
    <group>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.005}>
        <ringGeometry args={[0.1, 0.12, 48]} />
        <meshBasicMaterial color={tipo === "sede" ? "#ffffff" : "#6dd7d2"} transparent depthWrite={false} />
      </mesh>
      <group>
        {tipo === "upa" && (
          <>
            <mesh position-y={0.11}>
              <boxGeometry args={[0.2, 0.22, 0.2]} />
              <meshStandardMaterial color="#f2fbfa" emissive="#6dd7d2" emissiveIntensity={glow * 0.25} roughness={0.4} />
            </mesh>
            {/* cruz no telhado */}
            <mesh position-y={0.228}>
              <boxGeometry args={[0.14, 0.012, 0.04]} />
              <meshStandardMaterial color="#23a8a3" emissive="#3ec2bd" emissiveIntensity={glow} />
            </mesh>
            <mesh position-y={0.228}>
              <boxGeometry args={[0.04, 0.012, 0.14]} />
              <meshStandardMaterial color="#23a8a3" emissive="#3ec2bd" emissiveIntensity={glow} />
            </mesh>
          </>
        )}
        {tipo === "laboratorio" && (
          <>
            <mesh position-y={0.09}>
              <cylinderGeometry args={[0.08, 0.08, 0.18, 32]} />
              <meshStandardMaterial color="#cff4f2" emissive="#6dd7d2" emissiveIntensity={glow * 0.3} roughness={0.3} />
            </mesh>
            <mesh position-y={0.19}>
              <cylinderGeometry args={[0.03, 0.05, 0.05, 24]} />
              <meshStandardMaterial color="#3ec2bd" emissive="#3ec2bd" emissiveIntensity={glow} />
            </mesh>
          </>
        )}
        {tipo === "sede" && (
          <>
            <mesh position-y={0.24}>
              <boxGeometry args={[0.14, 0.48, 0.14]} />
              <meshStandardMaterial color="#ffffff" emissive="#a2e8e4" emissiveIntensity={0.35} roughness={0.35} />
            </mesh>
            <mesh position-y={0.5}>
              <boxGeometry args={[0.16, 0.03, 0.16]} />
              <meshStandardMaterial color="#3ec2bd" emissive="#3ec2bd" emissiveIntensity={1.2} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

/** Arco de luz da sede até a cidade, com partículas percorrendo o caminho */
function Flow({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean }) {
  const curve = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5);
    mid.y = 0.6 + from.distanceTo(to) * 0.25;
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.008, 6, false), [curve]);
  useEffect(() => () => tube.dispose(), [tube]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dots.current.forEach((m, i) => {
      if (!m) return;
      m.position.copy(curve.getPoint((t * 0.22 + i / 4) % 1));
    });
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={active ? "#cff4f2" : "#3ec2bd"} transparent opacity={active ? 0.9 : 0.45} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(m) => void (dots.current[i] = m)}>
          <sphereGeometry args={[active ? 0.03 : 0.022, 12, 12]} />
          <meshBasicMaterial color="#e6fffd" />
        </mesh>
      ))}
    </group>
  );
}

function Label({ text, strong, portal }: { text: string; strong?: boolean; portal: RefObject<HTMLDivElement | null> }) {
  return (
    <Html portal={portal as RefObject<HTMLElement>} center zIndexRange={[10, 0]}>
      <div
        className={`select-none whitespace-nowrap rounded border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors sm:px-2.5 sm:text-xs ${
          strong ? "border-brand-300 bg-ink-900 text-white" : "border-white/15 bg-ink-900/85 text-slate-200"
        }`}
      >
        {text}
      </div>
    </Html>
  );
}

/* ---------------- Câmera ---------------- */

const HOME_TARGET = new THREE.Vector3(0.55, 0, -0.35);
const HOME_POS = new THREE.Vector3(0.6, 6.4, 6.9);

function CameraRig({ focus, introRef }: { focus: THREE.Vector3 | null; introRef: RefObject<number | null> }) {
  const get = useThree((s) => s.get);
  const target = useRef(HOME_TARGET.clone());

  useEffect(() => {
    const { camera, clock } = get();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      camera.position.copy(HOME_POS);
      return;
    }
    // Começa no alto, como um drone, e desce até a vista em perspectiva
    camera.position.set(HOME_POS.x, 13, 1.2);
    introRef.current = clock.elapsedTime;
  }, [get, introRef]);

  useFrame((state, delta) => {
    const wantTarget = focus ?? HOME_TARGET;
    const wantPos = focus ? focus.clone().add(new THREE.Vector3(0.25, 3.4, 3.9)) : HOME_POS.clone();
    // leve órbita com o ponteiro
    wantPos.x += state.pointer.x * 0.5;
    wantPos.y += state.pointer.y * 0.25;

    const introK = introRef.current === null ? 1 : ease((state.clock.elapsedTime - introRef.current) / 2.6);
    const speed = introK < 1 ? 1.6 + introK * 2 : 2.4;
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, wantPos.x, speed, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, wantPos.y, speed, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, wantPos.z, speed, delta);
    target.current.lerp(wantTarget, 1 - Math.exp(-speed * delta));
    cam.lookAt(target.current);
  });
  return null;
}

/* ---------------- Cena ---------------- */

function Scene({
  active,
  focus,
  onSelect,
  portal,
}: {
  active: number;
  focus: number | null;
  onSelect: (i: number) => void;
  portal: RefObject<HTMLDivElement | null>;
}) {
  const raw = useLoader(THREE.FileLoader, "/v2/map/rms.json") as string;
  const data = useMemo(() => JSON.parse(raw) as MapData, [raw]);
  const project = useProject(data);
  const introRef = useRef<number | null>(null);
  const { clock } = useThree();
  const born = useRef(clock.elapsedTime);

  const sedePos = useMemo(() => project(sede.lat, sede.lon, H_ISIBA + 0.02), [project]);
  const cityData = useMemo(
    () =>
      cidades.map((c) => {
        const units = c.unidades.map((u) => ({ u, pos: project(u.lat, u.lon, H_ISIBA + 0.02) }));
        const center = units.reduce((acc, x) => acc.add(x.pos), new THREE.Vector3()).divideScalar(units.length);
        return { cidade: c, units, center };
      }),
    [project]
  );

  const focusPos = focus === null ? null : cityData[focus].center.clone().setY(0);

  // Crescimento dos prédios após a descida da câmera
  const growRef = useRef(0);
  useFrame((state) => {
    growRef.current = ease((state.clock.elapsedTime - born.current - 1.2) / 1.2);
  });

  return (
    <>
      <CameraRig focus={focusPos} introRef={introRef} />
      <Water />
      <Municipios data={data} />

      <group position={sedePos}>
        <GrowingBuilding tipo="sede" active={false} growRef={growRef} />
        <group position-y={0.72}>
          <Label text="Sede · Salvador" portal={portal} />
        </group>
      </group>

      {cityData.map((c, i) => (
        <group key={c.cidade.nome} onClick={() => onSelect(i)} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
          <Flow from={sedePos.clone().setY(sedePos.y + 0.5)} to={c.center.clone().setY(c.center.y + 0.3)} active={active === i} />
          {c.units.map(({ u, pos }) => (
            <group key={u.nome} position={pos}>
              <GrowingBuilding tipo={u.tipo} active={active === i} growRef={growRef} />
            </group>
          ))}
          <group position={c.center.clone().setY(c.center.y + 0.55)}>
            <Label text={c.cidade.nome} strong={active === i} portal={portal} />
          </group>
        </group>
      ))}
    </>
  );
}

function GrowingBuilding({
  tipo,
  active,
  growRef,
}: {
  tipo: Unidade["tipo"];
  active: boolean;
  growRef: RefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = Math.max(growRef.current ?? 1, 0.001);
  });
  return (
    <group ref={ref}>
      <Building tipo={tipo} active={active} />
    </group>
  );
}

export default function MapScene({
  active,
  focus,
  onSelect,
}: {
  active: number;
  focus: number | null;
  onSelect: (i: number) => void;
}) {
  // Rótulos HTML numa camada própria (fora da árvore do <Canvas>)
  const labels = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-full w-full">
      <div ref={labels} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" />
      <Canvas dpr={[1, 1.75]} camera={{ position: [0.35, 13, 1.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#0a2226", 6.5, 13]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 8, 5]} intensity={1.6} />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#6dd7d2" />
        <Suspense fallback={null}>
          <Scene active={active} focus={focus} onSelect={onSelect} portal={labels} />
        </Suspense>
      </Canvas>
    </div>
  );
}
