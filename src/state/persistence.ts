import { clamp01 } from '../tokens/math';
import { AXIS_KEYS, NEUTRAL_AXES, type Axes, type Theme } from '../tokens/types';

export interface AppState {
  axes: Axes;
  theme: Theme;
}

const PARAM: Record<keyof Axes, string> = { ei: 'ei', sn: 'sn', tf: 'tf', jp: 'jp' };
export const STORAGE_KEY = 'mbti-design-system:state';

const parsePercent = (raw: string | null | undefined): number | undefined => {
  if (raw == null || raw.trim() === '') return undefined;
  const v = Number(raw);
  return Number.isFinite(v) ? clamp01(v / 100) : undefined;
};

const parseTheme = (raw: unknown): Theme | undefined => (raw === 'light' || raw === 'dark' ? raw : undefined);

/** Reads whatever the query string provides; missing or invalid values are left undefined. */
export function parseUrl(search: string): { axes: Partial<Axes>; theme?: Theme } {
  const params = new URLSearchParams(search);
  const axes: Partial<Axes> = {};
  for (const k of AXIS_KEYS) {
    const v = parsePercent(params.get(PARAM[k]));
    if (v !== undefined) axes[k] = v;
  }
  return { axes, theme: parseTheme(params.get('theme')) };
}

/** Returns a query string with the state merged into any other existing parameters. */
export function serializeUrl(state: AppState, existingSearch = ''): string {
  const params = new URLSearchParams(existingSearch);
  for (const k of AXIS_KEYS) params.set(PARAM[k], String(Math.round(state.axes[k] * 100)));
  params.set('theme', state.theme);
  return `?${params.toString()}`;
}

export function parseStored(raw: string | null): { axes: Partial<Axes>; theme?: Theme } {
  if (!raw) return { axes: {} };
  try {
    const data = JSON.parse(raw) as { axes?: Record<string, unknown>; theme?: unknown };
    const axes: Partial<Axes> = {};
    for (const k of AXIS_KEYS) {
      const v = data.axes?.[k];
      if (typeof v === 'number' && Number.isFinite(v)) axes[k] = clamp01(v);
    }
    return { axes, theme: parseTheme(data.theme) };
  } catch {
    return { axes: {} };
  }
}

export const serializeStored = (state: AppState) =>
  JSON.stringify({ axes: state.axes, theme: state.theme });

/** Priority per field: URL, then localStorage, then defaults. */
export function resolveInitialState(search: string, stored: string | null, defaultTheme: Theme): AppState {
  const fromUrl = parseUrl(search);
  const fromStore = parseStored(stored);
  return {
    axes: { ...NEUTRAL_AXES, ...fromStore.axes, ...fromUrl.axes },
    theme: fromUrl.theme ?? fromStore.theme ?? defaultTheme,
  };
}

export function loadInitialState(): AppState {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable (private mode, disabled cookies).
  }
  const prefersDark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  return resolveInitialState(location.search, stored, prefersDark ? 'dark' : 'light');
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeStored(state));
  } catch {
    // Ignore quota / privacy errors: the URL still carries the state.
  }
  const search = serializeUrl(state, location.search);
  if (search !== location.search) {
    history.replaceState(history.state, '', `${location.pathname}${search}${location.hash}`);
  }
}
