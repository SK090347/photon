# photon

Browser path tracer in TypeScript + Canvas 2D. Progressive Monte Carlo accumulation on a Cornell-box scene — Lambertian / metal / emissive materials, cosine-weighted sampling, and a small BVH.

[![CI](https://github.com/SK090347/photon/actions/workflows/ci.yml/badge.svg)](https://github.com/SK090347/photon/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](LICENSE)

Sumit Kumar Ta ([SK090347](https://github.com/SK090347))

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 — watch spp climb
npm test
npm run build
```

No fancy screenshots checked in yet — open the demo and pause once it converges if you want a capture.

## How it works

Rendering equation for outgoing radiance:

\[
L_o(x,\omega_o)=L_e(x,\omega_o)+\int_{\Omega} f_r(x,\omega_i,\omega_o)\,L_i(x,\omega_i)\,(n\cdot\omega_i)\,d\omega_i
\]

MC estimate with \(N\) samples (progressive spp on the canvas):

\[
\hat{L}_o \approx L_e + \frac{1}{N}\sum_{k=1}^{N} \frac{f_r\, L_i\, \cos\theta_k}{p(\omega_k)}
\]

Lambertian paths use cosine-weighted \(p(\omega)=\cos\theta/\pi\) so the cosine cancels. Recurse to max depth (or hit emissive and stop). Display: ACES-ish tone map + \(\gamma = 2.2\). BVH cuts naive \(O(R\cdot M)\) intersections toward \(O(R\log M)\).

More detail: [docs/MATH.md](docs/MATH.md).

## Features

- Spheres + AABB planes (Cornell walls)
- Lambertian, metal (fuzz), emissive
- Cosine-weighted hemisphere sampling
- Binary BVH over object AABBs
- Progressive spp, rays/frame slider, pause/reset

```
src/
  math/       vec3, ray, RNG, hemisphere sampling
  scene/      materials, hittables, BVH, camera, Cornell
  trace/      path tracer + progressive renderer
  __tests__/  Vitest (vec3 / ray / sphere / sampling)
```

## License

**MIT** OR **Apache-2.0**.
