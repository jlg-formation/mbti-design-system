import { contrastRatio, oklchToHex, type Oklch } from './color';

/** Small safety margin so that hex rounding never drops a pair under the WCAG threshold. */
const MARGIN = 0.08;

const minContrast = (hex: string, against: string[]) =>
  Math.min(...against.map((bg) => contrastRatio(hex, bg)));

/**
 * Moves the lightness of `color` (only in the given direction, so the result stays continuous)
 * until it reaches `min` contrast against every background in `against`.
 */
export function ensureContrast(
  color: Oklch,
  against: string[],
  min: number,
  direction: 'darken' | 'lighten',
): string {
  const target = min + MARGIN;
  const hex = oklchToHex(color);
  if (minContrast(hex, against) >= target) return hex;

  let lo = color.l;
  let hi = direction === 'darken' ? 0 : 1;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (minContrast(oklchToHex({ ...color, l: mid }), against) >= target) hi = mid;
    else lo = mid;
  }
  return oklchToHex({ ...color, l: hi });
}
