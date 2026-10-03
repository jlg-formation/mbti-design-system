/** Each axis goes from 0 (left pole: E, S, T, J) to 1 (right pole: I, N, F, P). */
export interface Axes {
  ei: number;
  sn: number;
  tf: number;
  jp: number;
}

export type AxisKey = keyof Axes;

export type Theme = 'light' | 'dark';

export interface TokenOptions {
  reducedMotion?: boolean;
}

export type TokenGroupName = 'color' | 'shape' | 'type' | 'depth' | 'space' | 'motion' | 'chaos';

/** Keys are CSS custom property names without the leading `--`, unique across groups. */
export type Tokens = Record<TokenGroupName, Record<string, string>>;

export const AXIS_KEYS: AxisKey[] = ['ei', 'sn', 'tf', 'jp'];

export const NEUTRAL_AXES: Axes = { ei: 0.5, sn: 0.5, tf: 0.5, jp: 0.5 };
