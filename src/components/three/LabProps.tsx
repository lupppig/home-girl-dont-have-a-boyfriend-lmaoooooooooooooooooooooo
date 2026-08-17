"use client";

import * as THREE from "three";
import { ReactNode, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { PALETTE, useHeartGeometry, useStarGeometry } from "./shapes";

export type LabObject = "machine" | "emergency" | "trophy" | "arcade" | "scoreboard" | "certificate";

export function Chrome(props: Record<string, unknown>) {
  return (
    <meshStandardMaterial color={PALETTE.chrome} metalness={0.95} roughness={0.16} envMapIntensity={1.8} {...props} />
  );
}

export function Gloss({ color, ...rest }: { color: string } & Record<string, unknown>) {
  return (
    <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} clearcoatRoughness={0.08} {...rest} />
  );
}

/** Every touchable thing in the lab: hover lift, click squash, cursor. */
export function Touchable({
  id,
  onPoke,
  children,
  position,
  rotation,
}: {
  id: LabObject;
  onPoke: (id: LabObject) => void;
  children: ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const squash = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    squash.current = Math.max(0, squash.current - delta * 3);
    const s = 1 + (hovered ? 0.05 : 0) - Math.sin(squash.current * Math.PI) * 0.12;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, s, 14, delta));
    ref.current.position.y = position[1] + (hovered ? 0.08 : 0);
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        squash.current = 1;
        onPoke(id);
      }}
    >
      {children}
    </group>
  );
}

/* ------------------------------------------------------------ the room */

export function LabRoom() {
  const tiles = useMemo(() => {
    const out: { x: number; z: number; light: boolean }[] = [];
    for (let x = -7; x <= 7; x++)
      for (let z = -5; z <= 5; z++) out.push({ x, z, light: (x + z) % 2 === 0 });
    return out;
  }, []);

  return (
    <group>
      {/* checkerboard floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[34, 26]} />
        <meshStandardMaterial color="#c99cb0" roughness={0.7} />
      </mesh>
      {tiles
        .filter((t) => t.light)
        .map((t, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[t.x * 1.5, 0, t.z * 1.5 + 1]} receiveShadow>
            <planeGeometry args={[1.5, 1.5]} />
            <meshStandardMaterial color="#e6c3d3" roughness={0.6} />
          </mesh>
        ))}

      {/* back wall + chrome wainscot */}
      <mesh position={[0, 4.4, -6]} receiveShadow>
        <planeGeometry args={[34, 14]} />
        <meshStandardMaterial color="#a86e88" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.9, -5.94]}>
        <planeGeometry args={[34, 1.8]} />
        <meshStandardMaterial color="#d9c7d3" metalness={0.7} roughness={0.28} />
      </mesh>
      {/* hazard stripe running round the room */}
      <mesh position={[0, 1.86, -5.92]}>
        <planeGeometry args={[34, 0.22]} />
        <meshStandardMaterial color={PALETTE.hotpink} roughness={0.5} />
      </mesh>

      {/* ceiling strip lights */}
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} position={[x, 6.4, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 9]} />
          <meshStandardMaterial color="#f7dfe9" emissive="#ffd9e7" emissiveIntensity={0.55} />
        </mesh>
      ))}

      {/* pillars */}
      {[-8.5, 8.5].map((x) => (
        <mesh key={x} position={[x, 3, -4]} castShadow>
          <cylinderGeometry args={[0.45, 0.5, 6, 20]} />
          <meshStandardMaterial color="#e7d5e0" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------- the big emergency button */

export function EmergencyButton({
  onPoke,
  armed,
}: {
  onPoke: (id: LabObject) => void;
  armed: boolean;
}) {
  const dome = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!dome.current) return;
    const m = dome.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = armed ? 1.4 + Math.sin(state.clock.elapsedTime * 9) * 0.8 : 0.25;
  });

  return (
    <Touchable id="emergency" onPoke={onPoke} position={[3.6, 0, 2.6]}>
      {/* pedestal */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.55, 1, 26]} />
        <Chrome />
      </mesh>
      <mesh position={[0, 1.03, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.5, 0.18, 26]} />
        <meshStandardMaterial color="#ffd400" roughness={0.45} />
      </mesh>
      <mesh ref={dome} position={[0, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.42, 26, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={PALETTE.alarmRed}
          roughness={0.12}
          clearcoat={1}
          emissive={PALETTE.alarmRed}
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* glass guard ring */}
      <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.045, 12, 32]} />
        <Chrome roughness={0.3} />
      </mesh>
    </Touchable>
  );
}

/* --------------------------------------------------- arcade + trophies */

export function ArcadeCabinet({ onPoke }: { onPoke: (id: LabObject) => void }) {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (screen.current) {
      screen.current.emissiveIntensity = 0.9 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
    }
  });

  return (
    <Touchable id="arcade" onPoke={onPoke} position={[-5.4, 0, -2.2]} rotation={[0, 0.45, 0]}>
      <RoundedBox args={[1.5, 3.1, 1.1]} radius={0.16} smoothness={5} position={[0, 1.55, 0]} castShadow>
        <Gloss color={PALETTE.hotpink} />
      </RoundedBox>
      <RoundedBox args={[1.15, 0.95, 0.1]} radius={0.06} smoothness={4} position={[0, 2.3, 0.56]}>
        <meshStandardMaterial ref={screen} color="#2a0512" emissive={PALETTE.babypink} emissiveIntensity={1} />
      </RoundedBox>
      {/* marquee header */}
      <RoundedBox args={[1.5, 0.5, 0.5]} radius={0.1} smoothness={4} position={[0, 3.3, 0.3]} castShadow>
        <meshStandardMaterial color={PALETTE.lavender} emissive={PALETTE.lavender} emissiveIntensity={0.4} />
      </RoundedBox>
      {/* control deck */}
      <RoundedBox args={[1.4, 0.24, 0.7]} radius={0.08} smoothness={4} position={[0, 1.55, 0.62]} rotation={[-0.25, 0, 0]}>
        <Chrome />
      </RoundedBox>
      <mesh position={[-0.35, 1.72, 0.72]} rotation={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.3, 12]} />
        <Chrome />
      </mesh>
      <mesh position={[-0.35, 1.88, 0.76]}>
        <sphereGeometry args={[0.1, 18, 18]} />
        <Gloss color={PALETTE.alarmRed} />
      </mesh>
      {[0.1, 0.32, 0.54].map((x, i) => (
        <mesh key={i} position={[x, 1.7, 0.75]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 18]} />
          <Gloss color={[PALETTE.ivory, PALETTE.lavender, PALETTE.babypink][i]} />
        </mesh>
      ))}
    </Touchable>
  );
}

export function TrophyShelf({ onPoke }: { onPoke: (id: LabObject) => void }) {
  const star = useStarGeometry();
  return (
    <Touchable id="trophy" onPoke={onPoke} position={[5.9, 0, -2.6]} rotation={[0, -0.5, 0]}>
      {/* cabinet */}
      <RoundedBox args={[2.4, 2.8, 0.7]} radius={0.1} smoothness={4} position={[0, 1.4, 0]} castShadow>
        <Gloss color={PALETTE.cream} />
      </RoundedBox>
      {[0.75, 1.65, 2.45].map((y, s) => (
        <group key={s}>
          <mesh position={[0, y - 0.06, 0.2]}>
            <boxGeometry args={[2.2, 0.06, 0.5]} />
            <Chrome roughness={0.3} />
          </mesh>
          {[-0.65, 0, 0.65].map((x, i) => (
            <group key={i} position={[x, y + 0.02, 0.24]}>
              {/* tiny trophy */}
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.11, 0.14, 0.08, 16]} />
                <meshStandardMaterial color="#f0d3a2" metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
                <meshStandardMaterial color="#f0d3a2" metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh geometry={star} scale={0.16} position={[0, 0.36, 0]}>
                <meshStandardMaterial
                  color={s === 2 && i === 1 ? PALETTE.hotpink : "#f0d3a2"}
                  metalness={0.85}
                  roughness={0.28}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </Touchable>
  );
}

/* ------------------------------------------------------- big scoreboard */

export function Scoreboard({
  onPoke,
  days,
}: {
  onPoke: (id: LabObject) => void;
  days: number;
}) {
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (glow.current) glow.current.emissiveIntensity = 1.1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.3;
  });

  // digits rendered as chunky emissive bars — no font loading needed
  const digits = String(days).padStart(4, "0").split("").map(Number);

  return (
    <Touchable id="scoreboard" onPoke={onPoke} position={[0, 0, -5.6]}>
      <RoundedBox args={[6.4, 2.4, 0.35]} radius={0.12} smoothness={4} position={[0, 4.2, 0]} castShadow>
        <Chrome />
      </RoundedBox>
      <RoundedBox args={[5.9, 1.9, 0.12]} radius={0.08} smoothness={4} position={[0, 4.2, 0.2]}>
        <meshStandardMaterial ref={glow} color="#2a0512" emissive={PALETTE.hotpink} emissiveIntensity={1.1} />
      </RoundedBox>
      {digits.map((d, i) => (
        <SevenSeg key={i} value={d} position={[-1.35 + i * 0.9, 4.05, 0.28]} />
      ))}
      {/* bracket lights */}
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} position={[x, 4.2, 0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={PALETTE.babypink} emissive={PALETTE.babypink} emissiveIntensity={0.9} />
        </mesh>
      ))}
    </Touchable>
  );
}

const SEG_MAP: Record<number, number[]> = {
  0: [1, 1, 1, 1, 1, 1, 0],
  1: [0, 1, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1],
  3: [1, 1, 1, 1, 0, 0, 1],
  4: [0, 1, 1, 0, 0, 1, 1],
  5: [1, 0, 1, 1, 0, 1, 1],
  6: [1, 0, 1, 1, 1, 1, 1],
  7: [1, 1, 1, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
};

function SevenSeg({ value, position }: { value: number; position: [number, number, number] }) {
  const on = SEG_MAP[value] ?? SEG_MAP[8];
  const segs: { p: [number, number, number]; s: [number, number, number] }[] = [
    { p: [0, 0.52, 0], s: [0.46, 0.11, 0.05] }, // top
    { p: [0.28, 0.27, 0], s: [0.11, 0.4, 0.05] }, // top right
    { p: [0.28, -0.27, 0], s: [0.11, 0.4, 0.05] }, // bottom right
    { p: [0, -0.52, 0], s: [0.46, 0.11, 0.05] }, // bottom
    { p: [-0.28, -0.27, 0], s: [0.11, 0.4, 0.05] }, // bottom left
    { p: [-0.28, 0.27, 0], s: [0.11, 0.4, 0.05] }, // top left
    { p: [0, 0, 0], s: [0.46, 0.11, 0.05] }, // middle
  ];
  return (
    <group position={position}>
      {segs.map((seg, i) => (
        <mesh key={i} position={seg.p}>
          <boxGeometry args={seg.s} />
          <meshStandardMaterial
            color={on[i] ? "#fff0f6" : "#3d0f22"}
            emissive={on[i] ? "#ffd0e4" : "#000000"}
            emissiveIntensity={on[i] ? 1.5 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------- laminated certificate */

export function Certificate({ onPoke }: { onPoke: (id: LabObject) => void }) {
  const heart = useHeartGeometry(0.3, 0.08);
  return (
    <Touchable id="certificate" onPoke={onPoke} position={[-3.1, 0, -5.75]}>
      <RoundedBox args={[1.5, 1.9, 0.08]} radius={0.04} smoothness={4} position={[0, 3.6, 0]} castShadow>
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 3.6, 0.05]}>
        <planeGeometry args={[1.28, 1.66]} />
        <meshStandardMaterial color={PALETTE.blush} roughness={0.8} />
      </mesh>
      {[0.5, 0.25, 0, -0.25].map((y, i) => (
        <mesh key={i} position={[0, 3.6 + y, 0.06]}>
          <planeGeometry args={[i === 0 ? 0.85 : 1.0, 0.08]} />
          <meshStandardMaterial color={PALETTE.softpink} roughness={0.8} />
        </mesh>
      ))}
      <mesh geometry={heart} scale={0.2} position={[0, 3.02, 0.09]}>
        <meshStandardMaterial color={PALETTE.hotpink} roughness={0.3} />
      </mesh>
    </Touchable>
  );
}

/* ------------------------------------------------------- conveyor belt */

export function Conveyor({ running }: { running: boolean }) {
  const belt = useRef<THREE.Group>(null);
  const busts = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        offset: i * 1.6,
        skin: ["#f0c9a8", "#d9a273", "#a9714a", "#77462b"][i % 4],
        shirt: ["#8c98ad", "#6b0f33", "#3d4a63", "#a8a49e"][i % 4],
      })),
    []
  );

  useFrame((state, delta) => {
    if (!belt.current) return;
    const speed = running ? 1.6 : 0.25;
    belt.current.children.forEach((c, i) => {
      const b = busts[i];
      const x = ((state.clock.elapsedTime * speed + b.offset) % 11) - 5.5;
      c.position.x = x;
      c.position.y = 1.16 + Math.sin(state.clock.elapsedTime * 6 + i) * (running ? 0.03 : 0.01);
      c.rotation.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      void delta;
    });
  });

  return (
    <group position={[0, 0, 3.4]}>
      {/* belt body */}
      <RoundedBox args={[11.5, 0.5, 1.5]} radius={0.1} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <Chrome roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.3, 1.3]} />
        <meshStandardMaterial color="#3b1a28" roughness={0.85} />
      </mesh>
      {/* rollers */}
      {[-5.6, 5.6].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 20]} />
          <Chrome />
        </mesh>
      ))}
      {/* legs */}
      {[-4.6, 0, 4.6].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} castShadow>
          <boxGeometry args={[0.22, 0.62, 0.9]} />
          <Chrome roughness={0.35} />
        </mesh>
      ))}

      <group ref={belt}>
        {busts.map((b, i) => (
          <group key={i}>
            <mesh castShadow>
              <capsuleGeometry args={[0.22, 0.3, 6, 14]} />
              <meshStandardMaterial color={b.shirt} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.42, 0]} castShadow>
              <sphereGeometry args={[0.23, 20, 20]} />
              <meshStandardMaterial color={b.skin} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.5, -0.02]} scale={[1.02, 0.8, 1.02]}>
              <sphereGeometry args={[0.23, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color="#241318" roughness={0.8} />
            </mesh>
            {[-0.08, 0.08].map((x, e) => (
              <mesh key={e} position={[x, 0.44, 0.2]}>
                <sphereGeometry args={[0.026, 10, 10]} />
                <meshStandardMaterial color="#20111a" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
