import { oklchToHex, rgba, type Oklch } from './color';
import { ensureContrast } from './contrast';
import { lerp, pick, poles, round, smoothstep, wrapHue } from './math';
import type { Axes, Theme, TokenOptions, Tokens } from './types';

const px = (v: number) => `${round(v, 2)}px`;
const num = (v: number, d = 3) => `${round(v, d)}`;

const AA_TEXT = 4.5;
const AA_UI = 3;

export function computeTokens(axes: Axes, theme: Theme, options: TokenOptions = {}): Tokens {
  // Pole intensities: 0 around the middle so the neutral stays sober, 1 at the extremes.
  const ei = poles(axes.ei);
  const sn = poles(axes.sn);
  const tf = poles(axes.tf);
  const jp = poles(axes.jp);
  const [E, I] = ei;
  const [S, N] = sn;
  const [T, F] = tf;
  const [J, P] = jp;
  // Signed positions (0 = left pole, 0.5 = neutral, 1 = right pole), E-side for e.
  const e = 0.5 + 0.5 * (E - I);
  const n = 0.5 + 0.5 * (N - S);
  const f = 0.5 + 0.5 * (F - T);
  const reduced = !!options.reducedMotion;
  const dark = theme === 'dark';
  const textDir = dark ? 'lighten' : 'darken';

  // ---------- Color ----------
  // Cold blue (T) → rose coral (F), going through violet: the shortest arc on the wheel.
  // Rose rather than orange coral, because orange turns brown once darkened for contrast.
  const hue = wrapHue(245 + 125 * f);
  // Monochrome (S) → contrasting (N). Warm profiles lean to gold in dark mode, to plum in light mode
  // (gold turns muddy once darkened for contrast on a light background).
  const hueOffset = lerp(0, 165 - (dark ? 100 : 230) * f, n);
  const hue2 = wrapHue(hue + hueOffset);
  const chroma = pick(0.13, 0.29, 0.035, ei);

  // E floods the page with color, I fades it to grey paper, F warms it up.
  const bgL = dark ? pick(0.17, 0.215, 0.14, ei) : pick(0.978, 0.915, 0.968, ei);
  const bgC = pick(0.006, 0.06, 0.002, ei) + 0.012 * F;
  const bg = oklchToHex({ l: bgL, c: bgC, h: hue });
  const bg2 = oklchToHex({ l: bgL + (dark ? 0.03 : -0.035) * N, c: bgC + 0.07 * N, h: hue2 });
  const surfaceSolid = oklchToHex({ l: dark ? bgL + 0.055 : 0.998, c: bgC * 0.4, h: hue });
  const surface2 = oklchToHex({ l: dark ? bgL + 0.1 : bgL - 0.04, c: bgC * 1.3 + 0.004, h: hue });
  const surfaces = [bg, bg2, surfaceSolid, surface2];

  const accentSoft = oklchToHex(
    dark ? { l: bgL + 0.1, c: chroma * 0.45, h: hue } : { l: bgL - 0.035, c: chroma * 0.35, h: hue },
  );

  const text = ensureContrast(
    { l: dark ? pick(0.94, 0.99, 0.88, tf) : pick(0.2, 0.12, 0.3, tf), c: lerp(0.008, 0.035, f), h: hue },
    [...surfaces, accentSoft],
    AA_TEXT,
    textDir,
  );
  const textMuted = ensureContrast(
    { l: dark ? 0.72 : 0.5, c: 0.02, h: hue },
    [...surfaces, accentSoft],
    AA_TEXT,
    textDir,
  );

  // Buttons: white label on a dark accent in light mode, dark label on a light accent in dark mode.
  const onAccent = dark ? oklchToHex({ l: 0.17, c: 0.02, h: hue }) : '#ffffff';
  const accentDir = dark ? 'lighten' : 'darken';
  const accentBase: Oklch = { l: dark ? lerp(0.74, 0.8, e) : lerp(0.5, 0.57, e), c: chroma, h: hue };
  const accent = ensureContrast(accentBase, [onAccent], AA_TEXT, accentDir);
  const accent2 = ensureContrast(
    { l: accentBase.l, c: chroma * lerp(1, 1.15, n), h: wrapHue(hue + n * hueOffset) },
    [onAccent],
    AA_TEXT,
    accentDir,
  );
  const accentText = ensureContrast(
    { l: dark ? 0.78 : 0.5, c: chroma, h: hue },
    [...surfaces, accentSoft],
    AA_TEXT,
    textDir,
  );
  const accentText2 = ensureContrast(
    { l: dark ? 0.78 : 0.5, c: chroma, h: hue2 },
    [...surfaces, accentSoft],
    AA_TEXT,
    textDir,
  );
  const borderSubtle = oklchToHex({ l: dark ? bgL + 0.13 : bgL - 0.1, c: bgC * 1.6, h: hue });
  const borderStrong = ensureContrast(
    { l: dark ? 0.55 : 0.68, c: bgC * 2 + 0.01, h: hue },
    surfaces,
    AA_UI,
    textDir,
  );
  const error = ensureContrast({ l: dark ? 0.72 : 0.52, c: 0.19, h: 27 }, surfaces, AA_TEXT, textDir);
  const success = ensureContrast({ l: dark ? 0.75 : 0.5, c: 0.15, h: 150 }, surfaces, AA_TEXT, textDir);

  const shadowAlpha = pick(0.08, 0.26, 0, ei) * (dark ? 2 : 1);
  const shadowBase = oklchToHex({ l: dark ? 0.05 : 0.28, c: lerp(0.005, chroma * 0.9, f), h: hue });
  const glowAlpha = 0.65 * E;
  const gradientAngle = lerp(180, 115, n);
  const surfaceAlpha = 1 - (dark ? 0.5 : 0.55) * N;

  const color: Tokens['color'] = {
    'color-bg': bg,
    'color-bg-2': bg2,
    'color-surface': rgba(surfaceSolid, surfaceAlpha),
    'color-surface-solid': surfaceSolid,
    'color-surface-2': surface2,
    'color-text': text,
    'color-text-muted': textMuted,
    'color-accent': accent,
    'color-accent-2': accent2,
    'color-on-accent': onAccent,
    'color-accent-text': accentText,
    'color-accent-text-2': accentText2,
    'color-accent-soft': accentSoft,
    'color-border': rgba(borderSubtle, 1 - 0.35 * N),
    'color-border-strong': borderStrong,
    'color-focus': accentText,
    'color-error': error,
    'color-success': success,
    'color-shadow': rgba(shadowBase, shadowAlpha),
    'color-glow': rgba(accent, glowAlpha),
    'color-decor-1': rgba(accent, dark ? 0.55 : 0.45),
    'color-decor-2': rgba(accent2, dark ? 0.5 : 0.4),
    'gradient-accent': `linear-gradient(${round(gradientAngle, 1)}deg, ${accent}, ${accent2})`,
    'gradient-bg': `linear-gradient(${round(gradientAngle + 20, 1)}deg, ${bg}, ${bg2})`,
    'color-scheme': theme,
  };

  // ---------- Shape ----------
  const r = pick(8, 0, 30, tf);
  const asym = 0.9 * N;
  const shape: Tokens['shape'] = {
    'radius-a': px(r * (1 + asym)),
    'radius-b': px(r * (1 - asym * 0.85)),
    'radius-card-a': px(r * 1.35 * (1 + asym)),
    'radius-card-b': px(r * 1.35 * (1 - asym * 0.85)),
    'radius-sm': px(pick(5, 0, 14, tf)),
    'radius-round': px(pick(10, 0, 40, tf)),
    // E + T together turn borders into thick, brutalist strokes.
    'border-width': px(1 + 1.6 * E * T + 0.4 * S),
  };

  // ---------- Typography (Recursive variable font) ----------
  const wght = pick(520, 900, 300, ei);
  // T switches headings to spaced capitals, fully on from ~80 % T.
  const capsRamp = smoothstep((T - 0.3) / 0.5);
  // Overlaid lower/upper layers are unreadable when mixed: keep the cross-fade very short.
  const caps = smoothstep((capsRamp - 0.45) / 0.1);
  const type: Tokens['type'] = {
    'font-wght': num(wght, 1),
    'font-wght-strong': num(Math.min(1000, wght + pick(180, 100, 220, ei)), 1),
    'font-casl': num(F),
    'font-slnt': num(-15 * P, 2),
    'font-mono': num(T * (0.5 + 0.5 * S)),
    'font-size': px(pick(15, 17.5, 13.5, ei)),
    'font-size-heading': px(pick(22, 40, 17, ei)),
    'line-height': num(lerp(1.42, 1.62, 0.5 * f + 0.5 * (1 - e))),
    'letter-spacing': `${round(0.004 + 0.035 * P - 0.006 * E + 0.012 * I, 4)}em`,
    'letter-spacing-heading': `${round(-0.015 + 0.065 * capsRamp + 0.03 * P - 0.015 * F, 4)}em`,
    caps: num(caps),
  };

  // ---------- Depth ----------
  const sy = pick(3, 12, 0, ei);
  const sb = pick(8, 18, 0, ei) * lerp(1, 2.8, f);
  const spread = -lerp(0, 4, f);
  const sc = color['color-shadow'];
  // Hard offset shadow (neo-brutalism) for E + T profiles.
  const hard = E * T;
  const hardOff = 7 * hard;
  const hc = rgba(dark ? accent : text, 0.92 * hard);
  const hardShadow = (k: number) => `${px(hardOff * k)} ${px(hardOff * k)} 0 0 ${hc}`;
  const glowBlur = 34 * E;
  const depth: Tokens['depth'] = {
    'shadow-sm': `${hardShadow(0.5)}, 0 ${px(sy * 0.4)} ${px(sb * 0.5)} ${px(spread * 0.5)} ${sc}`,
    'shadow-md': `${hardShadow(1)}, 0 ${px(sy)} ${px(sb)} ${px(spread)} ${sc}`,
    'shadow-lg': `${hardShadow(1.4)}, 0 ${px(sy * 2.2)} ${px(sb * 2.2)} ${px(spread * 1.5)} ${sc}`,
    glow: `0 0 ${px(glowBlur)} ${color['color-glow']}`,
    blur: px(26 * N),
    'decor-opacity': num(N * (dark ? 0.7 : 0.85)),
    'pattern-opacity': num(N * 0.5),
    'grain-opacity': num(0.1 * N + 0.08 * F),
    'grid-opacity': num(J * (dark ? 0.28 : 0.22)),
  };

  // ---------- Space ----------
  const unit = pick(4, 6.4, 3, ei);
  const space: Tokens['space'] = {
    scale: num(pick(1, 1.2, 0.88, ei)),
    'space-1': px(unit),
    'space-2': px(unit * 2),
    'space-3': px(unit * 3),
    'space-4': px(unit * 4),
    'space-6': px(unit * 6),
    'space-8': px(unit * 8),
    'control-height': px(pick(38, 52, 30, ei)),
    'control-px': px(pick(14, 28, 9, ei)),
    'section-gap': px(pick(22, 44, 12, ei)),
  };

  // ---------- Motion ----------
  const mp = reduced ? 0 : P;
  // ease-out (J and neutral) → strongly overshooting "back" curve (P).
  const bezier = [lerp(0.16, 0.34, mp), lerp(1, 1.8, mp), lerp(0.3, 0.64, mp), 1].map((v) => round(v, 3));
  const motion: Tokens['motion'] = {
    duration: reduced ? '1ms' : `${Math.round(pick(220, 110, 620, jp))}ms`,
    'duration-slow': reduced ? '1ms' : `${Math.round(pick(360, 180, 900, jp))}ms`,
    ease: `cubic-bezier(${bezier.join(', ')})`,
    'hover-lift': px(reduced ? 0 : Math.max(0, 1 + 2.5 * E + 2.5 * P - 0.8 * J - 0.8 * I)),
    'hover-scale': num(reduced ? 1 : 1.008 + 0.06 * P - 0.008 * J, 4),
    'press-scale': num(reduced ? 1 : 1 - (0.02 + 0.06 * P - 0.012 * J), 4),
  };

  // ---------- Disorder ----------
  const chaos: Tokens['chaos'] = {
    chaos: num(mp),
    'chaos-rotate': `${round(mp * 3.5, 3)}deg`,
    'chaos-shift': px(mp * 14),
  };

  return { color, shape, type, depth, space, motion, chaos };
}

/** Flattens the token groups into CSS custom properties (`--name: value`). */
export function toCssVars(tokens: Tokens): Record<string, string> {
  const out: Record<string, string> = {};
  for (const group of Object.values(tokens)) {
    for (const [k, v] of Object.entries(group)) out[`--${k}`] = v;
  }
  return out;
}
