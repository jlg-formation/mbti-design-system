import { describe, expect, it } from 'vitest';
import { QUIZ, scoreQuiz } from './quiz';
import { profileAxes, PROFILES, typeCode } from './profiles';

const all = (value: number) => Object.fromEntries(QUIZ.map((q) => [q.id, value]));

describe('scoreQuiz', () => {
  it('gives 50 % everywhere for neutral answers', () => {
    expect(scoreQuiz(all(3))).toEqual({ ei: 0.5, sn: 0.5, tf: 0.5, jp: 0.5 });
  });

  it('cancels out when agreeing with both poles of an axis', () => {
    expect(scoreQuiz(all(5))).toEqual({ ei: 0.5, sn: 0.5, tf: 0.5, jp: 0.5 });
  });

  it('reaches the extremes when answers are fully consistent', () => {
    const answers: Record<string, number> = {};
    for (const q of QUIZ) answers[q.id] = q.pole === 'left' ? 5 : 1;
    expect(scoreQuiz(answers)).toEqual({ ei: 0, sn: 0, tf: 0, jp: 0 });
    for (const q of QUIZ) answers[q.id] = q.pole === 'right' ? 5 : 1;
    expect(scoreQuiz(answers)).toEqual({ ei: 1, sn: 1, tf: 1, jp: 1 });
  });

  it('averages the two questions of an axis into a continuous value', () => {
    // q1 (E) "plutôt moi" → 0.25 toward I ; q2 (I) "entre les deux" → 0.5
    const r = scoreQuiz({ ...all(3), q1: 4, q2: 3 });
    expect(r.ei).toBeCloseTo(0.375);
  });

  it('has 2 questions per axis', () => {
    for (const axis of ['ei', 'sn', 'tf', 'jp']) {
      expect(QUIZ.filter((q) => q.axis === axis)).toHaveLength(2);
    }
  });
});

describe('profiles', () => {
  it('has 16 unique profiles whose shortcut maps back to the same code', () => {
    expect(new Set(PROFILES.map((p) => p.code)).size).toBe(16);
    for (const p of PROFILES) expect(typeCode(profileAxes(p.code))).toBe(p.code);
  });
});
