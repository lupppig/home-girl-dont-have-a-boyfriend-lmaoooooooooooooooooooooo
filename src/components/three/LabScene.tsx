"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import BoyfriendMachine from "./BoyfriendMachine";
import ManModel, { type ManConfig } from "./ManModel";
import {
  ArcadeCabinet,
  Certificate,
  Conveyor,
  EmergencyButton,
  LabRoom,
  Scoreboard,
  TrophyShelf,
  type LabObject,
} from "./LabProps";
import { PALETTE, useHeartGeometry } from "./shapes";

export type Focus = "machine" | "wide" | "belt" | "shelf" | "boss" | "alarm";

const SHOTS: Record<Focus, { pos: [number, number, number]; target: [number, number, number]; fov: number }> = {
  // targets sit ~1.2 units below each subject so it renders in the upper half,
  // clear of the dialogue box docked along the bottom of the screen
  machine: { pos: [0, 2.9, 9.2], target: [0, 0.9, 0], fov: 34 },
  wide: { pos: [0.4, 3.8, 13.0], target: [0, 1.4, -1], fov: 36 },
  belt: { pos: [0, 3.6, 12.4], target: [0, 0.9, 2.8], fov: 34 },
  shelf: { pos: [4.8, 3.4, 9.6], target: [4.8, 1.2, -2.4], fov: 34 },
  boss: { pos: [0, 3.4, 13.0], target: [0, 2.0, -2], fov: 36 },
  alarm: { pos: [0, 2.8, 8.8], target: [0, 1.2, 0], fov: 40 },
};

/** Glides the camera between shots; also widens on portrait phones. */
function DirectorCamera({ focus, shakeAmt }: { focus: Focus; shakeAmt: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as { target: THREE.Vector3; update: () => void } | null;
  const target = useRef(new THREE.Vector3(0, 2, 0));
  const desired = useRef(new THREE.Vector3(0, 3.1, 8.6));

  useEffect(() => {
    const shot = SHOTS[focus];
    const aspect = size.width / Math.max(size.height, 1);
    // portrait: pull back so the room still reads at a narrow field of view
    const pull = aspect < 1.2 ? 1 + (1.2 - aspect) * 1.5 : 1;
    desired.current.set(shot.pos[0], shot.pos[1], shot.pos[2] * pull);
    target.current.set(...shot.target);
    camera.fov = shot.fov;
    camera.updateProjectionMatrix();
  }, [focus, camera, size]);

  useFrame((state, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desired.current.x, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desired.current.y, 2.4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desired.current.z, 2.4, delta);
    if (controls) {
      controls.target.lerp(target.current, 1 - Math.exp(-2.4 * delta));
    }
    if (shakeAmt > 0) {
      const t = state.clock.elapsedTime;
      camera.position.x += Math.sin(t * 47) * 0.05 * shakeAmt;
      camera.position.y += Math.cos(t * 61) * 0.04 * shakeAmt;
    }
  });

  return null;
}

/** The morphing "ideal man" boss. */
function Boss({ active, form, hitPulse }: { active: boolean; form: number; hitPulse: number }) {
  const g = useRef<THREE.Group>(null);
  const heart = useHeartGeometry(0.3, 0.08);

  const config = useMemo<ManConfig>(() => {
    const seeds = [
      { height: 96, comms: 30, eq: 20, style: 80, romance: 20 },
      { height: 55, comms: 12, eq: 8, style: 40, romance: 10 },
      { height: 78, comms: 60, eq: 30, style: 95, romance: 45 },
      { height: 48, comms: 80, eq: 78, style: 55, romance: 82 },
      { height: 88, comms: 22, eq: 12, style: 72, romance: 15 },
      { height: 70, comms: 50, eq: 44, style: 62, romance: 35 },
      { height: 62, comms: 70, eq: 60, style: 48, romance: 66 },
      { height: 84, comms: 40, eq: 25, style: 88, romance: 28 },
    ];
    return seeds[form % seeds.length];
  }, [form]);

  useFrame((state, delta) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, active ? 2.35 : 0.001, 5, delta));
    g.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    g.current.position.x = Math.sin(t * 0.9) * 0.18 + (hitPulse > 0 ? Math.sin(t * 40) * 0.12 * hitPulse : 0);
    g.current.position.y = Math.sin(t * 1.3) * 0.06;
  });

  return (
    <group ref={g} position={[0, 0.1, -2.2]} scale={0.001}>
      <ManModel config={config} skin={form % 4} hair="#1b1116" />
      {/* dramatic villain glow */}
      <pointLight position={[0, 1.6, 1.2]} color={PALETTE.alarmRed} intensity={active ? 6 : 0} distance={7} />
      <mesh geometry={heart} scale={0.16} position={[0.55, 2.35, 0]} rotation={[0, 0, 0.4]}>
        <meshStandardMaterial
          color={PALETTE.alarmRed}
          emissive={PALETTE.alarmRed}
          emissiveIntensity={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/** Confetti + fireworks for the fake celebration. */
function Celebration({ active }: { active: boolean }) {
  const heart = useHeartGeometry(0.24, 0.06);
  const g = useRef<THREE.Group>(null);
  const start = useRef(0);
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        vx: (Math.random() - 0.5) * 6,
        vy: 3 + Math.random() * 5,
        vz: (Math.random() - 0.5) * 4,
        spin: (Math.random() - 0.5) * 8,
        scale: 0.12 + Math.random() * 0.18,
        delay: Math.random() * 0.6,
        color: [PALETTE.hotpink, PALETTE.babypink, PALETTE.lavender, PALETTE.gold, PALETTE.ivory][i % 5],
      })),
    []
  );

  useEffect(() => {
    start.current = 0;
  }, [active]);

  useFrame((state) => {
    if (!g.current) return;
    if (!active) {
      g.current.visible = false;
      return;
    }
    g.current.visible = true;
    if (start.current === 0) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;
    g.current.children.forEach((c, i) => {
      const b = bits[i];
      const t = elapsed - b.delay;
      if (t < 0 || t > 6) {
        c.visible = false;
        return;
      }
      c.visible = true;
      c.position.set(b.vx * t * 0.7, 1.5 + b.vy * t - 3.2 * t * t, b.vz * t * 0.6);
      c.rotation.set(b.spin * t, b.spin * t * 0.6, b.spin * t * 0.3);
      c.scale.setScalar(b.scale);
    });
  });

  return (
    <group ref={g} position={[0, 1, 1]} visible={false}>
      {bits.map((b, i) => (
        <mesh key={i} geometry={heart}>
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function LabScene({
  focus,
  onPoke,
  scanning,
  beltRunning,
  emergencyArmed,
  bossActive,
  bossForm,
  bossHit,
  celebrate,
  shakeAmt,
  daysSingle,
}: {
  focus: Focus;
  onPoke: (id: LabObject) => void;
  scanning: boolean;
  beltRunning: boolean;
  emergencyArmed: boolean;
  bossActive: boolean;
  bossForm: number;
  bossHit: number;
  celebrate: boolean;
  shakeAmt: number;
  daysSingle: number;
}) {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, touch ? 1.4 : 1.7]}
      camera={{ position: [0, 3.1, 8.6], fov: 36 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.72 }}
      onPointerMissed={() => (document.body.style.cursor = "auto")}
    >
      <color attach="background" args={["#1d0713"]} />
      <fog attach="fog" args={["#26091a", 14, 34]} />

      <ambientLight intensity={0.22} color="#ffe9f2" />
      <hemisphereLight intensity={0.2} color="#ffd7e6" groundColor="#6b3d4f" />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.15}
        color="#fff4ea"
        castShadow
        shadow-mapSize={touch ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0006}
      />
      <pointLight position={[-6, 4, 4]} intensity={13} color={PALETTE.hotpink} distance={18} />
      <pointLight position={[6, 3, 4]} intensity={8} color={PALETTE.lavender} distance={16} />
      {emergencyArmed && <pointLight position={[0, 5, 3]} intensity={40} color={PALETTE.alarmRed} distance={22} />}

      <Environment resolution={256} environmentIntensity={0.65}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 7, 5]} scale={[10, 4, 1]} target={[0, 1, 0]} />
        <Lightformer form="circle" intensity={2.6} color={PALETTE.hotpink} position={[-6, 3, 4]} scale={6} target={[0, 1, 0]} />
        <Lightformer form="circle" intensity={1.8} color={PALETTE.lavender} position={[6, 2, 4]} scale={5} target={[0, 1, 0]} />
        <Lightformer form="rect" intensity={1} color={PALETTE.cream} position={[0, -3, 4]} scale={[10, 3, 1]} target={[0, 1, 0]} />
      </Environment>

      <DirectorCamera focus={focus} shakeAmt={shakeAmt} />

      <LabRoom />
      <Scoreboard onPoke={onPoke} days={daysSingle} />
      <Certificate onPoke={onPoke} />
      <ArcadeCabinet onPoke={onPoke} />
      <TrophyShelf onPoke={onPoke} />
      <EmergencyButton onPoke={onPoke} armed={emergencyArmed} />
      <Conveyor running={beltRunning} />

      <group
        scale={1.05}
        onClick={(e) => {
          e.stopPropagation();
          onPoke("machine");
        }}
      >
        <BoyfriendMachine scanning={scanning} onScan={() => onPoke("machine")} />
      </group>

      <Boss active={bossActive} form={bossForm} hitPulse={bossHit} />
      <Celebration active={celebrate} />

      <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={26} blur={2.4} far={6} color="#3a0a20" />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.35}
        enableRotate={!touch}
        minPolarAngle={0.85}
        maxPolarAngle={1.56}
        minAzimuthAngle={-0.6}
        maxAzimuthAngle={0.6}
      />
    </Canvas>
  );
}
