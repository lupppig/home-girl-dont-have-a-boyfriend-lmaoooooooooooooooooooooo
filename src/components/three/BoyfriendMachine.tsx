"use client";

import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { PALETTE, useHeartGeometry } from "./shapes";

type Props = {
  scanning: boolean;
  onScan: () => void;
};

/** Glossy moulded plastic — the expensive-toy look. */
function PlasticMaterial({ color, ...rest }: { color: string } & Record<string, unknown>) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.22}
      metalness={0.05}
      clearcoat={1}
      clearcoatRoughness={0.08}
      sheen={0.4}
      sheenColor={PALETTE.blush}
      {...rest}
    />
  );
}

function ChromeMaterial(props: Record<string, unknown>) {
  return (
    <meshStandardMaterial color={PALETTE.chrome} metalness={0.95} roughness={0.16} envMapIntensity={1.7} {...props} />
  );
}

/** Hearts that puff out of the machine when it fires. */
function HeartBurst({ active, count = 26 }: { active: boolean; count?: number }) {
  const geo = useHeartGeometry(0.3, 0.08);
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 1.6,
        z: (Math.random() - 0.5) * 1.0,
        speed: 0.5 + Math.random() * 0.9,
        spin: (Math.random() - 0.5) * 3,
        scale: 0.06 + Math.random() * 0.08,
        offset: (i / count) * 3 + Math.random(),
        color: [PALETTE.hotpink, PALETTE.softpink, PALETTE.babypink, PALETTE.lavender][i % 4],
      })),
    [count]
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const life = ((t * s.speed + s.offset) % 3) / 3;
      child.position.set(
        s.x + Math.sin(life * 6 + s.offset) * 0.28,
        2.9 + life * 2.6,
        s.z + Math.cos(life * 4 + s.offset) * 0.2
      );
      child.rotation.z = t * s.spin;
      child.rotation.y = t * s.spin * 0.5;
      const fade = Math.sin(life * Math.PI);
      const k = active ? fade : 0;
      child.scale.setScalar(s.scale * k * 14);
      child.visible = k > 0.02;
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} geometry={geo} visible={false}>
          <meshStandardMaterial color={s.color} roughness={0.3} emissive={s.color} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export default function BoyfriendMachine({ scanning, onScan }: Props) {
  const heart = useHeartGeometry(0.42, 0.1);
  const buttonHeart = useHeartGeometry(0.5, 0.12);

  const root = useRef<THREE.Group>(null);
  const scanner = useRef<THREE.Group>(null);
  const gearL = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Group>(null);
  const leds = useRef<THREE.Group>(null);
  const screenGlow = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const ledColors = [PALETTE.hotpink, PALETTE.babypink, PALETTE.lavender, PALETTE.hotpink, PALETTE.babypink, PALETTE.lavender];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // idle breathing + hover wiggle
    if (root.current) {
      const wiggle = hovered ? Math.sin(t * 14) * 0.02 : 0;
      root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, wiggle, 12, delta);
      root.current.position.y = Math.sin(t * 1.4) * 0.012;
      const target = hovered ? 1.03 : 1;
      const s = THREE.MathUtils.damp(root.current.scale.x, target, 8, delta);
      root.current.scale.setScalar(s);
    }

    // heart scanner rotates — lazily at rest, frantically while searching
    if (scanner.current) {
      scanner.current.rotation.y += delta * (scanning ? 6 : hovered ? 1.2 : 0.45);
      scanner.current.position.y = 2.74 + Math.sin(t * (scanning ? 9 : 2)) * (scanning ? 0.06 : 0.02);
    }

    if (gearL.current) gearL.current.rotation.x += delta * (scanning ? 4 : 0.7);

    // little mechanical arms
    const armSwing = scanning ? Math.sin(t * 7) * 0.5 : Math.sin(t * 1.1) * 0.09;
    if (armL.current) armL.current.rotation.z = -0.5 + armSwing;
    if (armR.current) armR.current.rotation.z = 0.5 - armSwing;

    // LEDs chase while scanning, low glow on hover
    if (leds.current) {
      leds.current.children.forEach((led, i) => {
        const m = (led as THREE.Mesh).material as THREE.MeshStandardMaterial;
        const chase = scanning ? (Math.sin(t * 12 - i * 0.9) > 0.2 ? 3.2 : 0.1) : hovered ? 1.1 : 0.15;
        m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, chase, 14, delta);
      });
    }

    if (screenGlow.current) {
      const target = scanning ? 1.6 + Math.sin(t * 18) * 0.5 : hovered ? 0.85 : 0.4;
      screenGlow.current.emissiveIntensity = THREE.MathUtils.damp(
        screenGlow.current.emissiveIntensity,
        target,
        10,
        delta
      );
    }

    if (buttonRef.current) {
      const z = pressed ? -0.06 : 0;
      buttonRef.current.position.z = THREE.MathUtils.damp(buttonRef.current.position.z, 0.34 + z, 18, delta);
    }
  });

  return (
    <group
      ref={root}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* feet */}
      {[
        [-0.66, 0.4],
        [0.66, 0.4],
        [-0.66, -0.4],
        [0.66, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <sphereGeometry args={[0.1, 20, 20]} />
          <ChromeMaterial />
        </mesh>
      ))}

      {/* chrome plinth */}
      <RoundedBox args={[1.82, 0.24, 1.24]} radius={0.09} smoothness={5} position={[0, 0.27, 0]} castShadow receiveShadow>
        <ChromeMaterial roughness={0.22} />
      </RoundedBox>

      {/* body */}
      <RoundedBox args={[1.46, 1.84, 1.02]} radius={0.27} smoothness={7} position={[0, 1.36, 0]} castShadow receiveShadow>
        <PlasticMaterial color={PALETTE.babypink} />
      </RoundedBox>

      {/* burgundy waistband stripe */}
      <RoundedBox args={[1.48, 0.1, 1.04]} radius={0.045} smoothness={4} position={[0, 0.58, 0]}>
        <meshPhysicalMaterial color={PALETTE.burgundy} roughness={0.3} clearcoat={1} />
      </RoundedBox>

      {/* screen bezel + screen */}
      <RoundedBox args={[1.06, 0.8, 0.1]} radius={0.07} smoothness={5} position={[0, 1.72, 0.5]}>
        <ChromeMaterial roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.64, 0.06]} radius={0.05} smoothness={5} position={[0, 1.72, 0.55]}>
        <meshStandardMaterial ref={screenGlow} color="#2a0512" emissive={PALETTE.hotpink} emissiveIntensity={0.4} roughness={0.35} />
      </RoundedBox>
      {/* little readout bars on the screen */}
      {[
        [-0.16, 0.17, 0.44],
        [-0.06, 0.0, 0.6],
        [-0.22, -0.17, 0.32],
      ].map(([x, y, w], i) => (
        <mesh key={i} position={[x, 1.72 + y, 0.59]}>
          <boxGeometry args={[w, 0.055, 0.01]} />
          <meshStandardMaterial color={PALETTE.blush} emissive={PALETTE.blush} emissiveIntensity={scanning ? 2.4 : 0.9} />
        </mesh>
      ))}

      {/* LED strip along the shoulder */}
      <group ref={leds}>
        {ledColors.map((c, i) => (
          <mesh key={i} position={[-0.5 + i * 0.2, 2.3, 0.36]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15} roughness={0.2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* top chrome collar */}
      <mesh position={[0, 2.34, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.38, 0.07, 20, 48]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, 2.46, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.34, 24]} />
        <ChromeMaterial />
      </mesh>

      {/* heart-shaped scanner head */}
      <group ref={scanner} position={[0, 2.74, 0]}>
        <mesh geometry={heart} scale={0.36} castShadow>
          <meshPhysicalMaterial
            color={PALETTE.hotpink}
            roughness={0.12}
            clearcoat={1}
            transmission={0.35}
            thickness={0.6}
            emissive={PALETTE.hotpink}
            emissiveIntensity={scanning ? 0.9 : 0.15}
          />
        </mesh>
        {/* scanner ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.022, 12, 40]} />
          <ChromeMaterial />
        </mesh>
      </group>

      {/* antennae with heart tips — the toy-shop detail */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.5, 2.28, -0.1]} rotation={[0, 0, side * 0.35]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.028, 0.44, 10]} />
            <ChromeMaterial />
          </mesh>
          <mesh geometry={buttonHeart} scale={0.09} position={[0, 0.5, 0]} rotation={[0, 0, -side * 0.35]}>
            <meshPhysicalMaterial
              color={side < 0 ? PALETTE.hotpink : PALETTE.lavender}
              roughness={0.12}
              clearcoat={1}
              emissive={side < 0 ? PALETTE.hotpink : PALETTE.lavender}
              emissiveIntensity={hovered || scanning ? 0.7 : 0.1}
            />
          </mesh>
        </group>
      ))}

      {/* a chunky dial */}
      <mesh position={[-0.5, 1.12, 0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.12, 24]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[-0.5, 1.12, 0.59]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
        <meshPhysicalMaterial color={PALETTE.hotpink} roughness={0.15} clearcoat={1} />
      </mesh>

      {/* side gear */}
      <mesh ref={gearL} position={[-0.77, 1.36, 0.16]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 9]} />
        <ChromeMaterial roughness={0.25} />
      </mesh>
      <mesh position={[0.77, 1.36, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 24]} />
        <meshPhysicalMaterial color={PALETTE.lavender} roughness={0.2} clearcoat={1} />
      </mesh>

      {/* tiny mechanical arms */}
      <group ref={armL} position={[-0.73, 1.86, 0.08]}>
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.46, 12]} />
          <ChromeMaterial />
        </mesh>
        <mesh position={[-0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.14, 0.14]} />
          <PlasticMaterial color={PALETTE.hotpink} />
        </mesh>
      </group>
      <group ref={armR} position={[0.73, 1.86, 0.08]}>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.46, 12]} />
          <ChromeMaterial />
        </mesh>
        <mesh position={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.14, 0.14]} />
          <PlasticMaterial color={PALETTE.hotpink} />
        </mesh>
      </group>

      {/* console shelf — juts out toward the viewer so the buttons read from the front */}
      <RoundedBox args={[1.5, 0.15, 0.76]} radius={0.06} smoothness={5} position={[0, 0.74, 0.8]} rotation={[-0.22, 0, 0]} castShadow>
        <meshPhysicalMaterial color={PALETTE.cream} roughness={0.3} clearcoat={0.8} />
      </RoundedBox>

      {/* the heart SCAN button */}
      <group position={[0.4, 0.87, 0.9]} rotation={[-0.95, 0, 0]}>
        <group
          ref={buttonRef}
          position={[0, 0, 0.34]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setPressed(false);
            document.body.style.cursor = "pointer";
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setPressed(true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            setPressed(false);
            onScan();
          }}
        >
          <mesh geometry={buttonHeart} scale={0.2} castShadow>
            <meshPhysicalMaterial
              color={PALETTE.hotpink}
              roughness={0.1}
              clearcoat={1}
              emissive={PALETTE.hotpink}
              emissiveIntensity={scanning ? 0.8 : 0.25}
            />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.23, 0.25, 0.1, 28]} />
          <ChromeMaterial />
        </mesh>
      </group>

      {/* tiny heart buttons + a switch */}
      {[
        [-0.5, PALETTE.lavender],
        [-0.28, PALETTE.ivory],
        [-0.06, PALETTE.softpink],
      ].map(([x, c], i) => (
        <mesh key={i} geometry={buttonHeart} scale={0.075} position={[x as number, 0.86, 0.86]} rotation={[-0.95, 0, 0]}>
          <meshPhysicalMaterial color={c as string} roughness={0.15} clearcoat={1} />
        </mesh>
      ))}
      <mesh position={[0.12, 0.9, 0.84]} rotation={[0.22, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.16, 14]} />
        <ChromeMaterial />
      </mesh>

      {/* engraved nameplate */}
      <RoundedBox args={[0.7, 0.16, 0.04]} radius={0.03} smoothness={4} position={[0, 0.7, 0.51]}>
        <meshStandardMaterial color={PALETTE.burgundy} roughness={0.4} metalness={0.3} />
      </RoundedBox>

      <HeartBurst active={scanning || hovered} />

      {/* the machine casts its own pink glow onto the desk */}
      <pointLight
        position={[0, 2.0, 1.2]}
        color={PALETTE.hotpink}
        intensity={scanning ? 9 : hovered ? 3.5 : 1.2}
        distance={5}
      />
    </group>
  );
}
