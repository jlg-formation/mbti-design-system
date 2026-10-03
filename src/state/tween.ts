import { lerp } from '../tokens/math';
import { AXIS_KEYS, type Axes } from '../tokens/types';
import { store } from './axesStore';

let current = 0;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function cancelAxesAnimation() {
  if (current) cancelAnimationFrame(current);
  current = 0;
}

/** Glides the axes (not the CSS) toward a target so every intermediate frame is a valid design. */
export function animateAxesTo(target: Axes, duration = 750) {
  cancelAxesAnimation();
  if (store.isReducedMotion()) {
    store.setAxes(target);
    return;
  }
  const from = { ...store.getState().axes };
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const k = easeInOut(t);
    const next = {} as Axes;
    for (const key of AXIS_KEYS) next[key] = lerp(from[key], target[key], k);
    store.setAxes(next);
    current = t < 1 ? requestAnimationFrame(tick) : 0;
  };
  current = requestAnimationFrame(tick);
}
