import type { Vec3 } from '../math/vec3';
import { toSRGB } from '../math/vec3';
import { RNG } from '../math/random';
import type { Scene } from '../scene/cornell';
import { trace, accumulateSample } from './pathTracer';

export interface RendererOptions {
  width: number;
  height: number;
  /** Rays per frame (tile budget). Higher = faster convergence, more jank. */
  raysPerFrame?: number;
}

export class ProgressiveRenderer {
  width: number;
  height: number;
  raysPerFrame: number;
  buffer: Float32Array;
  spp = 0;
  paused = false;
  private rng: RNG;
  private scene: Scene;
  private pixelIndex = 0;

  constructor(scene: Scene, opts: RendererOptions) {
    this.scene = scene;
    this.width = opts.width;
    this.height = opts.height;
    this.raysPerFrame = opts.raysPerFrame ?? 4000;
    this.buffer = new Float32Array(this.width * this.height * 3);
    this.rng = new RNG((Math.random() * 0xffffffff) >>> 0);
  }

  reset(scene?: Scene): void {
    if (scene) this.scene = scene;
    this.buffer.fill(0);
    this.spp = 0;
    this.pixelIndex = 0;
    this.rng = new RNG((Math.random() * 0xffffffff) >>> 0);
  }

  setPaused(p: boolean): void {
    this.paused = p;
  }

  /** Advance progressive accumulation by a budget of rays. Returns true if a full spp completed. */
  tick(): boolean {
    if (this.paused) return false;

    const { width, height, scene, raysPerFrame } = this;
    const total = width * height;
    let rays = 0;
    let completedPass = false;

    while (rays < raysPerFrame) {
      const i = this.pixelIndex;
      const x = i % width;
      const y = Math.floor(i / width);

      const u = (x + this.rng.next()) / width;
      const v = (y + this.rng.next()) / height;
      const r = scene.camera.getRay(u, v, this.rng);
      const color = trace(r, scene.world, this.rng, 0, scene.background);

      const nextSpp = this.spp + 1;
      accumulateSample(this.buffer, i, color, nextSpp);

      this.pixelIndex++;
      rays++;

      if (this.pixelIndex >= total) {
        this.pixelIndex = 0;
        this.spp++;
        completedPass = true;
        break;
      }
    }
    return completedPass;
  }

  /** Blit linear HDR buffer → ImageData (tone-mapped sRGB). */
  blit(imageData: ImageData): void {
    const data = imageData.data;
    const n = this.width * this.height;
    for (let i = 0; i < n; i++) {
      const c: Vec3 = [
        this.buffer[i * 3],
        this.buffer[i * 3 + 1],
        this.buffer[i * 3 + 2],
      ];
      const srgb = toSRGB(c);
      const o = i * 4;
      data[o] = (srgb[0] * 255) | 0;
      data[o + 1] = (srgb[1] * 255) | 0;
      data[o + 2] = (srgb[2] * 255) | 0;
      data[o + 3] = 255;
    }
  }
}
