import type { Vec3 } from './vec3';
import { add, mul } from './vec3';

export interface Ray {
  origin: Vec3;
  direction: Vec3;
}

export function ray(origin: Vec3, direction: Vec3): Ray {
  return { origin, direction };
}

export function at(r: Ray, t: number): Vec3 {
  return add(r.origin, mul(r.direction, t));
}
