import type { Vec3 } from '../math/vec3';
import { add, cross, mul, normalize, sub } from '../math/vec3';
import type { Ray } from '../math/ray';
import { ray } from '../math/ray';
import type { RNG } from '../math/random';

export class Camera {
  origin: Vec3;
  lowerLeft: Vec3;
  horizontal: Vec3;
  vertical: Vec3;
  u: Vec3;
  v: Vec3;
  w: Vec3;
  lensRadius: number;

  constructor(
    lookFrom: Vec3,
    lookAt: Vec3,
    vup: Vec3,
    vfovDeg: number,
    aspect: number,
    aperture = 0,
    focusDist?: number,
  ) {
    const theta = (vfovDeg * Math.PI) / 180;
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h;
    const viewportWidth = aspect * viewportHeight;

    this.w = normalize(sub(lookFrom, lookAt));
    this.u = normalize(cross(vup, this.w));
    this.v = cross(this.w, this.u);

    const fd = focusDist ?? lengthOf(sub(lookFrom, lookAt));
    this.origin = lookFrom;
    this.horizontal = mul(this.u, viewportWidth * fd);
    this.vertical = mul(this.v, viewportHeight * fd);
    this.lowerLeft = sub(
      sub(sub(this.origin, mul(this.horizontal, 0.5)), mul(this.vertical, 0.5)),
      mul(this.w, fd),
    );
    this.lensRadius = aperture / 2;
  }

  getRay(s: number, t: number, rng: RNG): Ray {
    const rd = mul(randomInUnitDisk(rng), this.lensRadius);
    const offset = add(mul(this.u, rd[0]), mul(this.v, rd[1]));
    const origin = add(this.origin, offset);
    const direction = sub(
      add(add(this.lowerLeft, mul(this.horizontal, s)), mul(this.vertical, t)),
      origin,
    );
    return ray(origin, direction);
  }
}

function lengthOf(v: Vec3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function randomInUnitDisk(rng: RNG): Vec3 {
  for (;;) {
    const p: Vec3 = [rng.range(-1, 1), rng.range(-1, 1), 0];
    if (p[0] * p[0] + p[1] * p[1] < 1) return p;
  }
}
