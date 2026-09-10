import type { Vec3 } from '../math/vec3';
import { dot, mul, sub, lengthSq } from '../math/vec3';
import type { Ray } from '../math/ray';
import { at } from '../math/ray';
import type { Material } from './material';

export interface HitRecord {
  t: number;
  p: Vec3;
  normal: Vec3;
  frontFace: boolean;
  material: Material;
}

export interface AABB {
  min: Vec3;
  max: Vec3;
}

export interface Hittable {
  hit(r: Ray, tMin: number, tMax: number): HitRecord | null;
  bounds(): AABB;
}

export function surround(a: AABB, b: AABB): AABB {
  return {
    min: [
      Math.min(a.min[0], b.min[0]),
      Math.min(a.min[1], b.min[1]),
      Math.min(a.min[2], b.min[2]),
    ],
    max: [
      Math.max(a.max[0], b.max[0]),
      Math.max(a.max[1], b.max[1]),
      Math.max(a.max[2], b.max[2]),
    ],
  };
}

export function hitAABB(box: AABB, r: Ray, tMin: number, tMax: number): boolean {
  for (let a = 0; a < 3; a++) {
    const invD = 1 / r.direction[a];
    let t0 = (box.min[a] - r.origin[a]) * invD;
    let t1 = (box.max[a] - r.origin[a]) * invD;
    if (invD < 0) {
      const tmp = t0;
      t0 = t1;
      t1 = tmp;
    }
    tMin = t0 > tMin ? t0 : tMin;
    tMax = t1 < tMax ? t1 : tMax;
    if (tMax <= tMin) return false;
  }
  return true;
}

export class Sphere implements Hittable {
  constructor(
    public center: Vec3,
    public radius: number,
    public material: Material,
  ) {}

  hit(r: Ray, tMin: number, tMax: number): HitRecord | null {
    const oc = sub(r.origin, this.center);
    const a = lengthSq(r.direction);
    const halfB = dot(oc, r.direction);
    const c = lengthSq(oc) - this.radius * this.radius;
    const disc = halfB * halfB - a * c;
    if (disc < 0) return null;
    const sqrtD = Math.sqrt(disc);
    let root = (-halfB - sqrtD) / a;
    if (root < tMin || root > tMax) {
      root = (-halfB + sqrtD) / a;
      if (root < tMin || root > tMax) return null;
    }
    const p = at(r, root);
    const outward = mul(sub(p, this.center), 1 / this.radius);
    const frontFace = dot(r.direction, outward) < 0;
    const normal = frontFace ? outward : mul(outward, -1);
    return { t: root, p, normal, frontFace, material: this.material };
  }

  bounds(): AABB {
    const r = this.radius;
    return {
      min: [this.center[0] - r, this.center[1] - r, this.center[2] - r],
      max: [this.center[0] + r, this.center[1] + r, this.center[2] + r],
    };
  }
}

/** Infinite axis-aligned plane (useful for Cornell floor/walls). */
export class Plane implements Hittable {
  constructor(
    public point: Vec3,
    public normal: Vec3,
    public material: Material,
    /** Soft AABB extent used for BVH (plane itself is infinite). */
    public extent = 100,
  ) {}

  hit(r: Ray, tMin: number, tMax: number): HitRecord | null {
    const denom = dot(this.normal, r.direction);
    if (Math.abs(denom) < 1e-8) return null;
    const t = dot(sub(this.point, r.origin), this.normal) / denom;
    if (t < tMin || t > tMax) return null;
    const p = at(r, t);
    const frontFace = denom < 0;
    const normal = frontFace ? this.normal : mul(this.normal, -1);
    return { t, p, normal, frontFace, material: this.material };
  }

  bounds(): AABB {
    const e = this.extent;
    // Inflate slightly along normal so AABB has volume
    return {
      min: [this.point[0] - e, this.point[1] - e, this.point[2] - e],
      max: [this.point[0] + e, this.point[1] + e, this.point[2] + e],
    };
  }
}

export class HittableList implements Hittable {
  constructor(public objects: Hittable[] = []) {}

  add(obj: Hittable): void {
    this.objects.push(obj);
  }

  hit(r: Ray, tMin: number, tMax: number): HitRecord | null {
    let closest: HitRecord | null = null;
    let closestT = tMax;
    for (const obj of this.objects) {
      const rec = obj.hit(r, tMin, closestT);
      if (rec) {
        closest = rec;
        closestT = rec.t;
      }
    }
    return closest;
  }

  bounds(): AABB {
    if (this.objects.length === 0) {
      return { min: [0, 0, 0], max: [0, 0, 0] };
    }
    let box = this.objects[0].bounds();
    for (let i = 1; i < this.objects.length; i++) {
      box = surround(box, this.objects[i].bounds());
    }
    return box;
  }
}

