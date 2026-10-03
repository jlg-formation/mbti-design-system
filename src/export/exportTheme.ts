import { toCssVars } from '../tokens/computeTokens';
import type { Tokens } from '../tokens/types';

export function toCss(tokens: Tokens): string {
  const lines = Object.entries(toCssVars(tokens)).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

const JSON_GROUPS: Record<keyof Tokens, string> = {
  color: 'colors',
  shape: 'shapes',
  type: 'typography',
  depth: 'shadows',
  space: 'spacing',
  motion: 'motion',
  chaos: 'disorder',
};

export function toJson(tokens: Tokens, meta: Record<string, unknown> = {}): string {
  const out: Record<string, unknown> = { ...meta };
  for (const [group, label] of Object.entries(JSON_GROUPS) as [keyof Tokens, string][]) {
    out[label] = tokens[group];
  }
  return JSON.stringify(out, null, 2) + '\n';
}

export function downloadText(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
