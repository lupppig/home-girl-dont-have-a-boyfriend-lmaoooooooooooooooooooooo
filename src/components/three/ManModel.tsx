"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { PALETTE, useHeartGeometry } from "./shapes";

export type ManConfig = {
  height: number; // 0..100
  comms: number;
  eq: number;
  style: number;
  romance: number;
};

const SKIN = ["#f0c9a8", "#d9a273", "#a9714a", "#77462b"];

export default function ManModel({
  config,
  skin = 1,
  hair = "#2a1a14",
  spin = 0,
}: {
  config: ManConfig;
  skin?: number;
  hair?: string;
  spin?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const flag = useRef<THREE.Group>(null);
  const heartGeo = useHeartGeometry(0.3, 0.08);

  const { height, comms, eq, style, romance } = config;

  const legLen = 0.55 + (height / 100) * 0.5;
  const torsoY = legLen + 0.5;
  const headY = torsoY + 0.62;

  // style moves him in steps: grey tee → navy → tailored burgundy. Bands read
  // better than one long lerp, which just produces mud in the middle.
  const neat = style > 55;
  const shirt = style < 34 ? "#a8a49e" : style < 68 ? "#3d4a63" : PALETTE.burgundy;
  const pants = style < 34 ? "#4d5260" : style < 68 ? "#7d8492" : PALETTE.cream;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.5) * 0.03;
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        spin + Math.sin(t * 0.6) * 0.16,
        4,
        delta
      );
    }
    if (head.current) {
      head.current.rotation.z = Math.sin(t * 1.1) * 0.05;
      head.current.rotation.y = Math.sin(t * 0.8) * 0.12;
    }
    // low communication = permanently on his phone
    if (armR.current) {
      const target = comms < 45 ? -1.15 : -0.28 + Math.sin(t * 1.4) * 0.1;
      armR.current.rotation.x = THREE.MathUtils.damp(armR.current.rotation.x, target, 5, delta);
    }
    if (flag.current) {
      flag.current.rotation.z = Math.sin(t * 2.4) * 0.18;
      const s = eq > 62 ? 1 : 0;
      flag.current.scale.setScalar(THREE.MathUtils.damp(flag.current.scale.x, s, 8, delta));
    }
  });

  return (
    <group ref={root}>
      {/* legs */}
      {[-0.17, 0.17].map((x, i) => (
        <mesh key={i} position={[x, legLen / 2 + 0.06, 0]} castShadow>
          <capsuleGeometry args={[0.11, legLen, 6, 14]} />
          <meshStandardMaterial color={pants} roughness={0.62} />
        </mesh>
      ))}
      {/* shoes */}
      {[-0.17, 0.17].map((x, i) => (
        <RoundedBox key={i} args={[0.2, 0.12, 0.32]} radius={0.05} smoothness={4} position={[x, 0.06, 0.06]} castShadow>
          <meshStandardMaterial color={neat ? PALETTE.ivory : "#3b3b3f"} roughness={0.4} />
        </RoundedBox>
      ))}

      {/* torso */}
      <mesh position={[0, torsoY, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 20]} />
        <meshStandardMaterial color={shirt} roughness={0.55} />
      </mesh>
      {/* open jacket panels once he has style */}
      {neat && (
        <>
          {[-1, 1].map((s) => (
            <RoundedBox
              key={s}
              args={[0.16, 0.62, 0.12]}
              radius={0.05}
              smoothness={4}
              position={[s * 0.24, torsoY + 0.02, 0.2]}
              rotation={[0, 0, s * 0.06]}
              castShadow
            >
              <meshStandardMaterial color={PALETTE.plum} roughness={0.5} />
            </RoundedBox>
          ))}
          {/* little chain */}
          <mesh position={[0, torsoY + 0.26, 0.27]} rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[0.12, 0.014, 10, 28]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={1} roughness={0.25} />
          </mesh>
        </>
      )}

      {/* arms */}
      <group position={[-0.38, torsoY + 0.22, 0]} rotation={[0, 0, 0.24]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.44, 6, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color={SKIN[skin]} roughness={0.6} />
        </mesh>
        {/* romance: he brought flowers */}
        <group position={[0, -0.7, 0.06]} scale={romance > 60 ? 1 : 0}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
            <meshStandardMaterial color="#7d9a72" roughness={0.8} />
          </mesh>
          {[
            [0, 0.28, 0, PALETTE.hotpink],
            [0.07, 0.24, 0.03, PALETTE.blush],
            [-0.07, 0.25, -0.02, PALETTE.lavender],
          ].map(([x, y, z, c], i) => (
            <mesh key={i} position={[x as number, y as number, z as number]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshStandardMaterial color={c as string} roughness={0.35} />
            </mesh>
          ))}
        </group>
      </group>

      <group ref={armR} position={[0.38, torsoY + 0.22, 0]} rotation={[0, 0, -0.24]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.44, 6, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color={SKIN[skin]} roughness={0.6} />
        </mesh>
        {/* bad communication: glued to the phone */}
        <RoundedBox
          args={[0.16, 0.28, 0.03]}
          radius={0.03}
          smoothness={4}
          position={[0, -0.66, 0.02]}
          scale={comms < 45 ? 1 : 0}
        >
          <meshStandardMaterial color="#1b0410" emissive={PALETTE.blush} emissiveIntensity={0.9} roughness={0.3} />
        </RoundedBox>
      </group>

      {/* head */}
      <group ref={head} position={[0, headY, 0]}>
        <mesh scale={[1, 1.08, 0.98]} castShadow>
          <sphereGeometry args={[0.34, 28, 28]} />
          <meshStandardMaterial color={SKIN[skin]} roughness={0.55} />
        </mesh>
        {/* hair */}
        <mesh position={[0, 0.09, -0.02]} scale={[1.03, neat ? 0.86 : 1.0, 1.03]} castShadow>
          <sphereGeometry args={[0.335, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color={hair} roughness={0.75} />
        </mesh>
        {!neat && (
          <mesh position={[0.16, 0.24, 0.14]} rotation={[0.3, 0, -0.5]}>
            <capsuleGeometry args={[0.045, 0.16, 4, 10]} />
            <meshStandardMaterial color={hair} roughness={0.75} />
          </mesh>
        )}
        {/* eyes */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0.3]}>
            <sphereGeometry args={[0.038, 14, 14]} />
            <meshStandardMaterial color="#231216" roughness={0.25} />
          </mesh>
        ))}
        {/* brows — flatter when emotionally unavailable */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 0.12, 0.3]} rotation={[0, 0, (i === 0 ? 1 : -1) * (eq > 62 ? 0.16 : -0.02)]}>
            <boxGeometry args={[0.1, 0.022, 0.02]} />
            <meshStandardMaterial color={hair} roughness={0.6} />
          </mesh>
        ))}
        {/* mouth */}
        <mesh position={[0, -0.12, 0.3]} rotation={[0, 0, 0]}>
          <torusGeometry args={[eq > 62 ? 0.075 : 0.055, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#8e3b4a" roughness={0.5} />
        </mesh>
        {/* blush */}
        {[-0.22, 0.22].map((x, i) => (
          <mesh key={i} position={[x, -0.04, 0.24]} rotation={[0, (i === 0 ? -1 : 1) * 0.6, 0]}>
            <circleGeometry args={[0.07, 18]} />
            <meshBasicMaterial color={PALETTE.softpink} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* the literal green flag */}
      <group ref={flag} position={[-0.62, torsoY + 0.5, 0.1]} scale={0}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.8, 8]} />
          <meshStandardMaterial color="#c9a27a" roughness={0.7} />
        </mesh>
        <mesh position={[0.19, 0.4, 0]}>
          <planeGeometry args={[0.36, 0.24]} />
          <meshStandardMaterial color="#5fbf7a" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* a little heart when he is, on balance, quite nice */}
      {eq > 62 && romance > 60 && (
        <mesh geometry={heartGeo} scale={0.12} position={[0.5, headY + 0.42, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color={PALETTE.hotpink} emissive={PALETTE.hotpink} emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}
