import { describe, expect, it } from 'vitest';
import { computeTokens, toCssVars } from './computeTokens';
import { contrastRatio, hexToRgb } from './color';
import { NEUTRAL_AXES, type Axes, type Theme } from './types';

const ESTJ: Axes = { ei: 0, sn: 0, tf: 0, jp: 0 };
const INFP: Axes = { ei: 1, sn: 1, tf: 1, jp: 1 };
const THEMES: Theme[] = ['light', 'dark'];

/** Every number found in a token value; hex colors become their 3 channels (0-255). */
function numbersOf(value: string): number[] {
  const out: number[] = [];
  const withoutHex = value.replace(/#([0-9a-f]{6})\b/gi, (hex) => {
    out.push(...hexToRgb(hex).map((c) => c * 255));
    return ' ';
  });
  for (const m of withoutHex.matchAll(/-?\d+(\.\d+)?/g)) out.push(parseFloat(m[0]));
  return out;
}

const pxValue = (v: string) => parseFloat(v);

describe('computeTokens', () => {
  it('produces the same set of variables for every input', () => {
    const keys = Object.keys(toCssVars(computeTokens(NEUTRAL_AXES, 'light'))).sort();
    for (const theme of THEMES) {
      for (const axes of [ESTJ, INFP, NEUTRAL_AXES]) {
        expect(Object.keys(toCssVars(computeTokens(axes, theme))).sort()).toEqual(keys);
      }
    }
  });

  it('maps extreme profiles to the expected visual traits', () => {
    const a = computeTokens(ESTJ, 'light');
    const b = computeTokens(INFP, 'light');

    // T: sharp corners, F: very rounded
    expect(pxValue(a.shape['radius-a'])).toBeLessThanOrEqual(2);
    expect(pxValue(b.shape['radius-sm'])).toBeGreaterThanOrEqual(8);
    // S: symmetric radii, N: asymmetric
    expect(a.shape['radius-a']).toBe(a.shape['radius-b']);
    expect(pxValue(b.shape['radius-a'])).toBeGreaterThan(pxValue(b.shape['radius-b']) * 3);
    // E: heavy and large, I: light and compact
    expect(Number(a.type['font-wght'])).toBeGreaterThan(700);
    expect(Number(b.type['font-wght'])).toBeLessThan(350);
    expect(Number(a.space.scale)).toBeGreaterThan(Number(b.space.scale));
    // F: casual, P: slanted
    expect(Number(a.type['font-casl'])).toBe(0);
    expect(Number(b.type['font-casl'])).toBe(1);
    expect(Number(a.type['font-slnt'])).toBe(0);
    expect(Number(b.type['font-slnt'])).toBeLessThan(-10);
    // N: glass blur, S: none
    expect(a.depth.blur).toBe('0px');
    expect(pxValue(b.depth.blur)).toBeGreaterThan(10);
    // J: ease-out without overshoot, P: overshoot + disorder
    expect(a.motion.ease).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(b.motion.ease).toBe('cubic-bezier(0.34, 1.8, 0.64, 1)');
    expect(a.chaos.chaos).toBe('0');
    expect(b.chaos.chaos).toBe('1');
    // E + T: brutalist hard offset shadow; T: spaced capitals in headings
    expect(a.depth['shadow-md'].startsWith('7px 7px 0 0')).toBe(true);
    expect(b.depth['shadow-md'].startsWith('0px 0px 0 0')).toBe(true);
    expect(a.type.caps).toBe('1');
    expect(b.type.caps).toBe('0');
  });

  it('makes 85 % profiles nearly as strong as the extremes', () => {
    const t = computeTokens({ ei: 0.85, sn: 0.85, tf: 0.85, jp: 0.85 }, 'light');
    expect(Number(t.chaos.chaos)).toBeGreaterThan(0.85);
    expect(Number(t.type['font-wght'])).toBeLessThan(330);
  });

  it('gives a sober neutral position', () => {
    const t = computeTokens(NEUTRAL_AXES, 'light');
    expect(pxValue(t.chaos['chaos-rotate'])).toBe(0);
    expect(t.depth.blur).toBe('0px');
    expect(t.type.caps).toBe('0');
    expect(Number(t.type['font-wght'])).toBeGreaterThan(450);
    expect(Number(t.type['font-wght'])).toBeLessThan(600);
  });

  it('neutralises bounce and rotation when reduced motion is requested', () => {
    const t = computeTokens(INFP, 'light', { reducedMotion: true });
    expect(t.chaos.chaos).toBe('0');
    expect(t.motion.ease).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(t.motion['hover-scale']).toBe('1');
  });

  it('is continuous: a tiny step never makes a token jump', () => {
    const step = 0.002;
    const samples = [0, 0.13, 0.37, 0.5, 0.71, 0.998];
    for (const theme of THEMES) {
      for (const axis of ['ei', 'sn', 'tf', 'jp'] as const) {
        for (const s of samples) {
          const base = { ...NEUTRAL_AXES, [axis]: s };
          const a = toCssVars(computeTokens(base, theme));
          const b = toCssVars(computeTokens({ ...base, [axis]: s + step }, theme));
          for (const key of Object.keys(a)) {
            const na = numbersOf(a[key]);
            const nb = numbersOf(b[key]);
            expect(nb.length, key).toBe(na.length);
            na.forEach((v, i) => {
              const tol = Math.max(4, Math.abs(v) * 0.03);
              expect(Math.abs(v - nb[i]), `${theme} ${axis}=${s} ${key}`).toBeLessThanOrEqual(tol);
            });
          }
        }
      }
    }
  });

  it('keeps the caps cross-fade short so headings never show two half-visible layers', () => {
    let mixed = 0;
    for (let i = 0; i <= 100; i++) {
      const caps = Number(computeTokens({ ...NEUTRAL_AXES, tf: i / 100 }, 'light').type.caps);
      if (caps > 0.1 && caps < 0.9) mixed++;
    }
    expect(mixed).toBeLessThanOrEqual(2);
    expect(Number(computeTokens({ ei: 0.19, sn: 0.07, tf: 0.27, jp: 0.24 }, 'light').type.caps)).toBeGreaterThan(0.9);
  });
});

describe('WCAG AA contrast', () => {
  const steps = [0, 0.25, 0.5, 0.75, 1];
  const positions: Axes[] = [];
  for (const ei of steps)
    for (const sn of steps)
      for (const tf of steps) for (const jp of steps) positions.push({ ei, sn, tf, jp });

  for (const theme of THEMES) {
    it(`holds on a 5⁴ grid of positions in ${theme} mode`, () => {
      for (const axes of positions) {
        const c = computeTokens(axes, theme).color;
        const backgrounds = [c['color-bg'], c['color-bg-2'], c['color-surface-solid'], c['color-surface-2']];
        const check = (fg: string, bgs: string[], min: number, label: string) => {
          for (const bg of bgs) {
            expect(contrastRatio(fg, bg), `${theme} ${JSON.stringify(axes)} ${label}`).toBeGreaterThanOrEqual(min);
          }
        };
        check(c['color-text'], [...backgrounds, c['color-accent-soft']], 4.5, 'text');
        check(c['color-text-muted'], [...backgrounds, c['color-accent-soft']], 4.5, 'text-muted');
        check(c['color-accent-text'], [...backgrounds, c['color-accent-soft']], 4.5, 'accent-text');
        check(c['color-accent-text-2'], backgrounds, 4.5, 'accent-text-2');
        check(c['color-on-accent'], [c['color-accent'], c['color-accent-2']], 4.5, 'on-accent');
        check(c['color-error'], backgrounds, 4.5, 'error');
        check(c['color-border-strong'], backgrounds, 3, 'border-strong');
        check(c['color-focus'], backgrounds, 3, 'focus');
        check(c['color-accent'], [c['color-surface-solid'], c['color-bg']], 3, 'accent as UI');
      }
    });
  }
});
