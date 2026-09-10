import './style.css';
import { createCornellScene } from './scene/cornell';
import { ProgressiveRenderer } from './trace/renderer';

const WIDTH = 512;
const HEIGHT = 512;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="shell">
    <header class="header">
      <div class="brand">
        <span class="logo">◈</span>
        <div>
          <h1>photon</h1>
          <p class="tag">progressive path tracer · canvas</p>
        </div>
      </div>
      <div class="stats">
        <span id="spp">0 spp</span>
        <span id="fps">— fps</span>
      </div>
    </header>
    <main class="stage">
      <canvas id="viewport" width="${WIDTH}" height="${HEIGHT}" aria-label="Path traced viewport"></canvas>
      <aside class="panel">
        <h2>Controls</h2>
        <button id="btn-reset" type="button">Reset</button>
        <button id="btn-pause" type="button">Pause</button>
        <label class="slider">
          <span>Rays / frame</span>
          <input id="rays" type="range" min="1000" max="16000" step="500" value="4000" />
          <output id="rays-out">4000</output>
        </label>
        <div class="note">
          <h3>Scene</h3>
          <p>Cornell-box walls · Lambertian · Metal · Emissive light · BVH</p>
          <h3>Sampling</h3>
          <p>Cosine-weighted hemisphere · progressive accumulation · ACES tone map</p>
        </div>
      </aside>
    </main>
    <footer class="footer">
      <span>Sumit Kumar Ta · SK090347</span>
      <span>MIT + Apache-2.0</span>
    </footer>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#viewport')!;
const ctx = canvas.getContext('2d', { alpha: false })!;
const imageData = ctx.createImageData(WIDTH, HEIGHT);

const aspect = WIDTH / HEIGHT;
let scene = createCornellScene(aspect);
const renderer = new ProgressiveRenderer(scene, {
  width: WIDTH,
  height: HEIGHT,
  raysPerFrame: 4000,
});

const sppEl = document.querySelector('#spp')!;
const fpsEl = document.querySelector('#fps')!;
const pauseBtn = document.querySelector<HTMLButtonElement>('#btn-pause')!;
const resetBtn = document.querySelector<HTMLButtonElement>('#btn-reset')!;
const raysInput = document.querySelector<HTMLInputElement>('#rays')!;
const raysOut = document.querySelector('#rays-out')!;

resetBtn.addEventListener('click', () => {
  scene = createCornellScene(aspect);
  renderer.reset(scene);
  sppEl.textContent = '0 spp';
});

pauseBtn.addEventListener('click', () => {
  renderer.setPaused(!renderer.paused);
  pauseBtn.textContent = renderer.paused ? 'Resume' : 'Pause';
  pauseBtn.classList.toggle('active', renderer.paused);
});

raysInput.addEventListener('input', () => {
  const v = Number(raysInput.value);
  renderer.raysPerFrame = v;
  raysOut.textContent = String(v);
});

let frames = 0;
let lastFps = performance.now();

function frame(now: number): void {
  renderer.tick();
  renderer.blit(imageData);
  ctx.putImageData(imageData, 0, 0);

  sppEl.textContent = `${renderer.spp} spp`;
  frames++;
  if (now - lastFps >= 1000) {
    fpsEl.textContent = `${frames} fps`;
    frames = 0;
    lastFps = now;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
