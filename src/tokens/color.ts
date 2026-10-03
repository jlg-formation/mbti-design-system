import { clamp01 } from './math';

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export type Rgb = [number, number, number];

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** OKLCH → linear sRGB, possibly out of gamut. */
function oklchToLinearRgb({ l, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** Reduces chroma until the color fits in sRGB (keeps lightness and hue). */
export function toGamut(color: Oklch): Oklch {
  const l = clamp01(color.l);
  if (inGamut(oklchToLinearRgb({ ...color, l }))) return { ...color, l };
  let lo = 0;
  let hi = color.c;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinearRgb({ l, c: mid, h: color.h }))) lo = mid;
    else hi = mid;
  }
  return { l, c: lo, h: color.h };
}

/** OKLCH → gamma-encoded sRGB in [0, 1]. */
export function oklchToRgb(color: Oklch): Rgb {
  const lin = oklchToLinearRgb(toGamut(color));
  return lin.map((v) => clamp01(fromLinear(clamp01(v)))) as Rgb;
}

export const to255 = (rgb: Rgb): Rgb => rgb.map((v) => Math.round(v * 255)) as Rgb;

export function rgbToHex(rgb: Rgb): string {
  return '#' + to255(rgb).map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): Rgb {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const oklchToHex = (color: Oklch) => rgbToHex(oklchToRgb(color));

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = to255(hexToRgb(hex));
  return `rgb(${r} ${g} ${b} / ${Math.round(clamp01(alpha) * 1000) / 1000})`;
}

/** WCAG 2.x relative luminance of an sRGB color. */
export function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a));
  const lb = luminance(hexToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
