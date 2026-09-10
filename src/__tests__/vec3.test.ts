import { describe, it, expect } from 'vitest';
import {
  add,
  sub,
  mul,
  dot,
  cross,
  length,
  normalize,
  reflect,
  hadamard,
  nearZero,
  vec3,
} from '../math/vec3';

describe('vec3', () => {
  it('adds and subtracts component-wise', () => {
    expect(add(vec3(1, 2, 3), vec3(4, 5, 6))).toEqual([5, 7, 9]);
    expect(sub(vec3(4, 5, 6), vec3(1, 2, 3))).toEqual([3, 3, 3]);
  });

  it('scales and hadamard-multiplies', () => {
    expect(mul(vec3(1, 2, 3), 2)).toEqual([2, 4, 6]);
    expect(hadamard(vec3(1, 2, 3), vec3(2, 3, 4))).toEqual([2, 6, 12]);
  });

  it('computes dot and cross', () => {
    expect(dot(vec3(1, 0, 0), vec3(0, 1, 0))).toBe(0);
    expect(dot(vec3(1, 2, 3), vec3(4, 5, 6))).toBe(32);
    expect(cross(vec3(1, 0, 0), vec3(0, 1, 0))).toEqual([0, 0, 1]);
  });

  it('normalizes to unit length', () => {
    const n = normalize(vec3(3, 0, 4));
    expect(length(n)).toBeCloseTo(1, 10);
    expect(n[0]).toBeCloseTo(0.6, 10);
    expect(n[2]).toBeCloseTo(0.8, 10);
  });

  it('reflects across a normal', () => {
    const r = reflect(vec3(1, -1, 0), vec3(0, 1, 0));
    expect(r[0]).toBeCloseTo(1);
    expect(r[1]).toBeCloseTo(1);
    expect(r[2]).toBeCloseTo(0);
  });

  it('detects near-zero vectors', () => {
    expect(nearZero(vec3(0, 0, 0))).toBe(true);
    expect(nearZero(vec3(1e-9, 0, 0))).toBe(true);
    expect(nearZero(vec3(0.1, 0, 0))).toBe(false);
  });
});
