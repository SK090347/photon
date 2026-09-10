/** Immutable-style 3D vector utilities for ray tracing numerics. */

export type Vec3 = readonly [number, number, number];

export const ZERO: Vec3 = [0, 0, 0];
export const ONE: Vec3 = [1, 1, 1];

export function vec3(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function mul(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

export function hadamard(a: Vec3, b: Vec3): Vec3 {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function length(v: Vec3): number {
  return Math.sqrt(dot(v, v));
}

export function lengthSq(v: Vec3): number {
  return dot(v, v);
}

export function normalize(v: Vec3): Vec3 {
  const len = length(v);
  if (len < 1e-12) return ZERO;
  return mul(v, 1 / len);
}

export function reflect(v: Vec3, n: Vec3): Vec3 {
  return sub(v, mul(n, 2 * dot(v, n)));
}

export function nearZero(v: Vec3): boolean {
  const eps = 1e-8;
  return Math.abs(v[0]) < eps && Math.abs(v[1]) < eps && Math.abs(v[2]) < eps;
}

export function clamp(v: Vec3, lo = 0, hi = 1): Vec3 {
  return [
    Math.min(hi, Math.max(lo, v[0])),
    Math.min(hi, Math.max(lo, v[1])),
    Math.min(hi, Math.max(lo, v[2])),
  ];
}

/** ACES-ish tone map then gamma 2.2 for display. */
export function toSRGB(c: Vec3): Vec3 {
  const tone = (x: number) => {
    const a = 2.51;
    const b = 0.03;
    const c0 = 2.43;
    const d = 0.59;
    const e = 0.14;
    return Math.max(0, Math.min(1, (x * (a * x + b)) / (x * (c0 * x + d) + e)));
  };
  return [
    Math.pow(tone(c[0]), 1 / 2.2),
    Math.pow(tone(c[1]), 1 / 2.2),
    Math.pow(tone(c[2]), 1 / 2.2),
  ];
}
