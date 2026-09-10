import type { Vec3 } from '../math/vec3';
import { add, dot, mul, normalize, nearZero, reflect } from '../math/vec3';
import type { Ray } from '../math/ray';
import { ray } from '../math/ray';
import type { RNG } from '../math/random';
import { cosineSampleHemisphere, randomInUnitSphere } from '../math/random';
import type { HitRecord } from './hittable';

export type Material =
  | { kind: 'lambertian'; albedo: Vec3 }
  | { kind: 'metal'; albedo: Vec3; fuzz: number }
  | { kind: 'emissive'; emission: Vec3 };

export interface ScatterResult {
  scattered: Ray;
  attenuation: Vec3;
}

export function scatter(
  mat: Material,
  rIn: Ray,
  rec: HitRecord,
  rng: RNG,
): ScatterResult | null {
  switch (mat.kind) {
    case 'lambertian': {
      let dir = cosineSampleHemisphere(rec.normal, rng);
      if (nearZero(dir)) dir = rec.normal;
      return {
        scattered: ray(rec.p, dir),
        attenuation: mat.albedo,
      };
    }
    case 'metal': {
      const reflected = reflect(normalize(rIn.direction), rec.normal);
      const fuzzed = add(reflected, mul(randomInUnitSphere(rng), mat.fuzz));
      if (dot(fuzzed, rec.normal) <= 0) return null;
      return {
        scattered: ray(rec.p, fuzzed),
        attenuation: mat.albedo,
      };
    }
    case 'emissive':
      return null;
  }
}

export function emitted(mat: Material): Vec3 {
  return mat.kind === 'emissive' ? mat.emission : [0, 0, 0];
}

export function lambertian(albedo: Vec3): Material {
  return { kind: 'lambertian', albedo };
}

export function metal(albedo: Vec3, fuzz = 0): Material {
  return { kind: 'metal', albedo, fuzz: Math.min(fuzz, 1) };
}

export function emissive(emission: Vec3): Material {
  return { kind: 'emissive', emission };
}

// silence unused import warning if tree-shaken oddly
