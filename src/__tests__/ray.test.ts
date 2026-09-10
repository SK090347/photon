import { describe, it, expect } from 'vitest';
import { ray, at } from '../math/ray';
import { vec3 } from '../math/vec3';
import { Sphere } from '../scene/hittable';
import { lambertian } from '../scene/material';
import { RNG, cosineSampleHemisphere } from '../math/random';
import { dot } from '../math/vec3';

describe('ray', () => {
  it('evaluates point at parameter t', () => {
    const r = ray(vec3(0, 0, 0), vec3(1, 0, 0));
    expect(at(r, 2)).toEqual([2, 0, 0]);
  });
});

describe('sphere intersection', () => {
  it('hits a unit sphere from outside', () => {
    const s = new Sphere(vec3(0, 0, -2), 1, lambertian(vec3(1, 1, 1)));
    const r = ray(vec3(0, 0, 0), vec3(0, 0, -1));
    const hit = s.hit(r, 0.001, Infinity);
    expect(hit).not.toBeNull();
    expect(hit!.t).toBeCloseTo(1, 5);
    expect(hit!.frontFace).toBe(true);
  });

  it('misses when ray points away', () => {
    const s = new Sphere(vec3(0, 0, -2), 1, lambertian(vec3(1, 1, 1)));
    const r = ray(vec3(0, 0, 0), vec3(0, 0, 1));
    expect(s.hit(r, 0.001, Infinity)).toBeNull();
  });
});

describe('cosineSampleHemisphere', () => {
  it('produces directions in the upper hemisphere', () => {
    const rng = new RNG(42);
    const n = vec3(0, 1, 0);
    for (let i = 0; i < 100; i++) {
      const d = cosineSampleHemisphere(n, rng);
      expect(dot(d, n)).toBeGreaterThanOrEqual(-1e-9);
      expect(Math.abs(Math.hypot(d[0], d[1], d[2]) - 1)).toBeLessThan(1e-6);
    }
  });
});
