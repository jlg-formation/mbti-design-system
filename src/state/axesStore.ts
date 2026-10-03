import { applyCssVars } from '../tokens/applyTokens';
import { computeTokens, toCssVars } from '../tokens/computeTokens';
import { clamp01 } from '../tokens/math';
import type { Axes, Theme } from '../tokens/types';
import { loadInitialState, saveState, type AppState } from './persistence';

type Listener = () => void;

const SAVE_THROTTLE_MS = 200;

let state: AppState = { axes: { ei: 0.5, sn: 0.5, tf: 0.5, jp: 0.5 }, theme: 'light' };
let reducedMotion = false;
const listeners = new Set<Listener>();
let frame = 0;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function flush() {
  frame = 0;
  const root = document.documentElement;
  applyCssVars(toCssVars(computeTokens(state.axes, state.theme, { reducedMotion })), root);
  root.dataset.theme = state.theme;
}

function scheduleApply() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = undefined;
    saveState(state);
  }, SAVE_THROTTLE_MS);
}

function commit(next: AppState) {
  state = next;
  listeners.forEach((l) => l());
  scheduleApply();
  scheduleSave();
}

export const store = {
  getState: () => state,
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setAxes(partial: Partial<Axes>) {
    const axes = { ...state.axes };
    for (const [k, v] of Object.entries(partial) as [keyof Axes, number][]) axes[k] = clamp01(v);
    commit({ ...state, axes });
  },
  setTheme(theme: Theme) {
    commit({ ...state, theme });
  },
  isReducedMotion: () => reducedMotion,
};

export function initStore() {
  state = loadInitialState();
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;
  mq.addEventListener('change', (e) => {
    reducedMotion = e.matches;
    scheduleApply();
  });
  flush();
  saveState(state);
}
