export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const clamp01 = (v: number) => clamp(v, 0, 1);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

export const round = (v: number, digits = 3) => {
  const k = 10 ** digits;
  return Math.round(v * k) / k;
};

export const wrapHue = (h: number) => ((h % 360) + 360) % 360;

/** Pole intensities [left, right] of an axis: flat around 50 %, steep toward the ends, full from ~92 %. */
export function poles(v: number): [number, number] {
  const d = (clamp01(v) - 0.5) * 2;
  const k = smoothstep(Math.abs(d) / 0.85);
  return d < 0 ? [k, 0] : [0, k];
}

/** Value at the neutral position, pulled toward `left` / `right` by the pole intensities. */
export const pick = (mid: number, left: number, right: number, [l, r]: [number, number]) =>
  mid + (left - mid) * l + (right - mid) * r;
