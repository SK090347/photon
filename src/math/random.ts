import type { Vec3 } from './vec3';
import { normalize, vec3, lengthSq } from './vec3';

/** Simple xorshift32 PRNG for reproducible sampling. */
export class RNG {
  private state: number;

  constructor(seed = 1) {
    this.state = seed >>> 0 || 1;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return (this.state & 0xffffff) / 0x1000000;
  }

  range(lo: number, hi: number): number {
    return lo + (hi - lo) * this.next();
  }
}

/** Uniform point in unit sphere (rejection). */
export function randomInUnitSphere(rng: RNG): Vec3 {
  for (;;) {
    const p = vec3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1));
    if (lengthSq(p) < 1) return p;
  }
}

export function randomUnitVector(rng: RNG): Vec3 {
  return normalize(randomInUnitSphere(rng));
}

/**
 * Cosine-weighted hemisphere sample around normal `n`.
 * PDF = cos(θ) / π — matches Lambertian BRDF for importance sampling.
 */
export function cosineSampleHemisphere(n: Vec3, rng: RNG): Vec3 {
  // Orthonormal basis from normal
  const a = Math.abs(n[0]) > 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0);
  const t = normalize(crossSafe(a, n));
  const b = crossSafe(n, t);

  const r1 = rng.next();
  const r2 = rng.next();
  const phi = 2 * Math.PI * r1;
  const cosTheta = Math.sqrt(r2); // cosine-weighted
  const sinTheta = Math.sqrt(1 - r2);

  const x = Math.cos(phi) * sinTheta;
  const y = Math.sin(phi) * sinTheta;
  const z = cosTheta;

  return normalize([
    t[0] * x + b[0] * y + n[0] * z,
    t[1] * x + b[1] * y + n[1] * z,
    t[2] * x + b[2] * y + n[2] * z,
  ]);
}

function crossSafe(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
