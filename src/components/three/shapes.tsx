"use client";

import * as THREE from "three";
import { useMemo } from "react";

/** A properly-oriented heart: two lobes up, point down, roughly 2 x 2 units. */
export function makeHeartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.95);
  s.bezierCurveTo(0.55, -0.42, 1.0, 0.04, 1.0, 0.44);
  s.bezierCurveTo(1.0, 0.86, 0.7, 1.06, 0.42, 1.06);
  s.bezierCurveTo(0.17, 1.06, 0.03, 0.9, 0, 0.7);
  s.bezierCurveTo(-0.03, 0.9, -0.17, 1.06, -0.42, 1.06);
  s.bezierCurveTo(-0.7, 1.06, -1.0, 0.86, -1.0, 0.44);
  s.bezierCurveTo(-1.0, 0.04, -0.55, -0.42, 0, -0.95);
  return s;
}

/** Extruded, bevelled heart geometry — chunky like a moulded plastic charm. */
export function useHeartGeometry(depth = 0.4, bevel = 0.09) {
  return useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(makeHeartShape(), {
      depth,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [depth, bevel]);
}

/**
 * One vertical half of the same heart, with its flat edge on x = 0 so it can be
 * hinged open like a locket. side = 1 is the right half, -1 the left.
 */
export function makeHalfHeartShape(side: 1 | -1) {
  const s = new THREE.Shape();
  const x = (v: number) => v * side;
  s.moveTo(x(0), 0.7);
  s.bezierCurveTo(x(0.03), 0.9, x(0.17), 1.06, x(0.42), 1.06);
  s.bezierCurveTo(x(0.7), 1.06, x(1.0), 0.86, x(1.0), 0.44);
  s.bezierCurveTo(x(1.0), 0.04, x(0.55), -0.42, x(0), -0.95);
  s.lineTo(x(0), 0.7);
  return s;
}

export function useHalfHeartGeometry(side: 1 | -1, depth = 0.9, bevel = 0.14) {
  return useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(makeHalfHeartShape(side), {
      depth,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 28,
    });
    geo.translate(0, 0, -depth / 2);
    geo.computeVertexNormals();
    return geo;
  }, [side, depth, bevel]);
}

/** Flat five-point star, for sparkle decals. */
export function useStarGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    const spikes = 4;
    const outer = 1;
    const inner = 0.22;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 3,
      curveSegments: 6,
    });
    geo.center();
    return geo;
  }, []);
}

export const PALETTE = {
  hotpink: "#ff2f78",
  softpink: "#f9a8c4",
  babypink: "#ffc9db",
  blush: "#ffe4ec",
  cream: "#fbeee4",
  ivory: "#fffaf5",
  plum: "#3a0a20",
  burgundy: "#6b0f33",
  lavender: "#cdbdf2",
  chrome: "#e9e2e6",
  gold: "#e8c48a",
  alarmRed: "#ff2d2d",
  lime: "#6ee7a5",
} as const;
