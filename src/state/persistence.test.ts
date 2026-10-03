import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadInitialState,
  parseUrl,
  resolveInitialState,
  saveState,
  serializeStored,
  serializeUrl,
  STORAGE_KEY,
} from './persistence';

describe('URL state', () => {
  it('parses percent values and theme', () => {
    expect(parseUrl('?ei=72&sn=30&tf=85&jp=40&theme=dark')).toEqual({
      axes: { ei: 0.72, sn: 0.3, tf: 0.85, jp: 0.4 },
      theme: 'dark',
    });
  });

  it('ignores invalid values and clamps out-of-range ones', () => {
    expect(parseUrl('?ei=abc&sn=150&tf=-5&theme=pink')).toEqual({ axes: { sn: 1, tf: 0 }, theme: undefined });
  });

  it('serializes while keeping unrelated parameters', () => {
    const s = serializeUrl({ axes: { ei: 0.724, sn: 0.3, tf: 0.85, jp: 0.4 }, theme: 'dark' }, '?ref=cv');
    expect(s).toBe('?ref=cv&ei=72&sn=30&tf=85&jp=40&theme=dark');
  });
});

describe('initial state priority', () => {
  const stored = serializeStored({ axes: { ei: 0.1, sn: 0.2, tf: 0.3, jp: 0.4 }, theme: 'dark' });

  it('prefers the URL, then storage, then defaults', () => {
    expect(resolveInitialState('?ei=90', stored, 'light')).toEqual({
      axes: { ei: 0.9, sn: 0.2, tf: 0.3, jp: 0.4 },
      theme: 'dark',
    });
    expect(resolveInitialState('', null, 'light')).toEqual({
      axes: { ei: 0.5, sn: 0.5, tf: 0.5, jp: 0.5 },
      theme: 'light',
    });
  });

  it('survives corrupted storage', () => {
    expect(resolveInitialState('', '{nope', 'dark').theme).toBe('dark');
  });
});

describe('saveState / loadInitialState', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '/');
  });

  it('round-trips through localStorage and replaces the URL without adding history entries', () => {
    const before = history.length;
    saveState({ axes: { ei: 0.2, sn: 0.8, tf: 0.6, jp: 0.1 }, theme: 'dark' });
    expect(history.length).toBe(before);
    expect(location.search).toBe('?ei=20&sn=80&tf=60&jp=10&theme=dark');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).theme).toBe('dark');

    history.replaceState(null, '', '/');
    expect(loadInitialState()).toEqual({ axes: { ei: 0.2, sn: 0.8, tf: 0.6, jp: 0.1 }, theme: 'dark' });
  });
});
