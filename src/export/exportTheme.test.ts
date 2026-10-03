import { describe, expect, it } from 'vitest';
import { computeTokens, toCssVars } from '../tokens/computeTokens';
import { NEUTRAL_AXES } from '../tokens/types';
import { toCss, toJson } from './exportTheme';

const tokens = computeTokens(NEUTRAL_AXES, 'light');

describe('export', () => {
  it('produces a :root block with every variable', () => {
    const css = toCss(tokens);
    expect(css.startsWith(':root {\n')).toBe(true);
    expect(css.trimEnd().endsWith('}')).toBe(true);
    for (const [k, v] of Object.entries(toCssVars(tokens))) expect(css).toContain(`  ${k}: ${v};`);
  });

  it('produces structured JSON with the same values', () => {
    const data = JSON.parse(toJson(tokens, { profile: 'ENFP' }));
    expect(data.profile).toBe('ENFP');
    expect(Object.keys(data)).toEqual(
      expect.arrayContaining(['colors', 'shapes', 'typography', 'shadows', 'spacing', 'motion']),
    );
    expect(data.colors['color-accent']).toBe(tokens.color['color-accent']);
    expect(data.typography['font-wght']).toBe(tokens.type['font-wght']);
  });
});
