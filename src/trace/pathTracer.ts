import type { Vec3 } from '../math/vec3';
import { add, hadamard, ZERO } from '../math/vec3';
import type { Ray } from '../math/ray';
import type { Hittable } from '../scene/hittable';
import { scatter, emitted } from '../scene/material';
import type { RNG } from '../math/random';

const MAX_DEPTH = 8;

/**
 * Unbiased Monte Carlo path tracer.
 *
 * Rendering equation (simplified):
 *   L_o(x, ω_o) = L_e(x, ω_o) + ∫_Ω f_r(x, ω_i, ω_o) L_i(x, ω_i) (n·ω_i) dω_i
 *
 * We estimate the integral with cosine-weighted hemisphere samples for
 * Lambertian BRDFs (importance sampling), and recursive path continuation.
 */
export function trace(
  r: Ray,
  world: Hittable,
  rng: RNG,
  depth = 0,
  background: Vec3 = ZERO,
): Vec3 {
  if (depth >= MAX_DEPTH) return ZERO;

  const rec = world.hit(r, 0.001, Infinity);
  if (!rec) return background;

  const emit = emitted(rec.material);
  const scattered = scatter(rec.material, r, rec, rng);
  if (!scattered) return emit;

  const incoming = trace(scattered.scattered, world, rng, depth + 1, background);
  return add(emit, hadamard(scattered.attenuation, incoming));
}

/** Accumulate one sample into a float buffer (RGB linear). */
export function accumulateSample(
  buffer: Float32Array,
  index: number,
  color: Vec3,
  sampleCount: number,
): void {
  const i = index * 3;
  const w = 1 / sampleCount;
  const prev = 1 - w;
  buffer[i] = buffer[i] * prev + color[0] * w;
  buffer[i + 1] = buffer[i + 1] * prev + color[1] * w;
  buffer[i + 2] = buffer[i + 2] * prev + color[2] * w;
}

