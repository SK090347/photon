# photon

**Progressive Monte Carlo path tracer** in the browser — TypeScript + Canvas 2D.

A portfolio-flagship graphics demo: unbiased path tracing with cosine-weighted hemisphere sampling, Lambertian / metal / emissive materials, a Cornell-box style scene, and a simple BVH — all accumulating live on a `<canvas>`.

[![CI](https://github.com/SK090347/photon/actions/workflows/ci.yml/badge.svg)](https://github.com/SK090347/photon/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](LICENSE)

<p align="center">
  <img src="docs/screenshot-placeholder.png" alt="photon progressive render placeholder" width="512" />
</p>

> **Screenshot placeholders** — drop real captures into `docs/` after running `npm run dev` (early noisy pass vs converged).

## Features

| Feature | Detail |
|--------|--------|
| Ray primitives | Spheres + axis-aligned planes (Cornell walls) |
| Materials | Lambertian, metal (with fuzz), emissive |
| Sampling | Cosine-weighted hemisphere (importance sampling) |
| Acceleration | Binary BVH over object AABBs |
| Display | Progressive spp accumulation, ACES-ish tone map + γ 2.2 |
| Controls | Reset · Pause/Resume · Rays/frame slider · live spp + fps |

## Rendering equation

The path tracer estimates the outgoing radiance via the rendering equation:

\[
L_o(x,\omega_o)=L_e(x,\omega_o)+\int_{\Omega} f_r(x,\omega_i,\omega_o)\,L_i(x,\omega_i)\,(n\cdot\omega_i)\,d\omega_i
\]

For Lambertian BRDFs we sample \(\omega_i\) with a **cosine-weighted** density \(\mathrm{pdf}=\cos\theta/\pi\), so the cosine term cancels and variance drops. Paths recurse until a max depth (or an emissive hit with no scatter).

## Project layout

```
src/
  math/       vec3, ray, RNG + cosine hemisphere sampling
  scene/      materials, hittables, BVH, camera, Cornell scene
  trace/      path tracer + progressive renderer
  __tests__/  Vitest unit tests (vec3 / ray / sphere / sampling)
```

## How to run

```bash
npm install
npm run dev      # http://localhost:5173 — live progressive demo
npm test         # Vitest (vec3 / ray math)
npm run build    # production bundle → dist/
```

## Skills demonstrated

- **Numerics** — robust sphere quadratic roots, orthonormal bases, near-zero guards
- **Graphics** — Monte Carlo path tracing, BRDF sampling, tone mapping
- **Performance** — BVH culling, per-frame ray budgets, progressive accumulation without blocking the UI
- **Engineering** — TypeScript modules, Vitest, Vite, GitHub Actions CI

## License

Dual-licensed under **MIT** OR **Apache-2.0** — see [LICENSE](LICENSE), [LICENSE-MIT](LICENSE-MIT), [LICENSE-APACHE](LICENSE-APACHE).

## Author

**Sumit Kumar Ta** ([SK090347](https://github.com/SK090347))
