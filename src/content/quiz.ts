import { AXIS_KEYS, type AxisKey, type Axes } from '../tokens/types';

export interface QuizQuestion {
  id: string;
  axis: AxisKey;
  /** Which pole a "tout à fait moi" answer points to. */
  pole: 'left' | 'right';
  text: string;
}

export const QUIZ_SCALE = ['Pas du tout moi', 'Plutôt pas moi', 'Entre les deux', 'Plutôt moi', 'Tout à fait moi'];

export const QUIZ: QuizQuestion[] = [
  { id: 'q1', axis: 'ei', pole: 'left', text: 'Après une longue semaine, une soirée entre amis me ressource.' },
  { id: 'q2', axis: 'ei', pole: 'right', text: 'J’ai besoin de réfléchir seul avant de donner mon avis.' },
  { id: 'q3', axis: 'sn', pole: 'left', text: 'Je préfère des instructions précises à une idée vague à explorer.' },
  { id: 'q4', axis: 'sn', pole: 'right', text: 'Je me surprends souvent à imaginer comment les choses pourraient être.' },
  { id: 'q5', axis: 'tf', pole: 'left', text: 'Pour décider, je compare les arguments plutôt que les ressentis.' },
  { id: 'q6', axis: 'tf', pole: 'right', text: 'Je pense d’abord à ce que ma décision va changer pour les autres.' },
  { id: 'q7', axis: 'jp', pole: 'left', text: 'J’aime savoir à l’avance ce qui est prévu.' },
  { id: 'q8', axis: 'jp', pole: 'right', text: 'Je garde mes options ouvertes jusqu’au dernier moment.' },
];

/** Answers are 1..5 (index in QUIZ_SCALE + 1). Each axis is the mean of its questions, as a 0..1 value. */
export function scoreQuiz(answers: Record<string, number>, questions: QuizQuestion[] = QUIZ): Axes {
  const sums: Record<AxisKey, { total: number; count: number }> = {
    ei: { total: 0, count: 0 },
    sn: { total: 0, count: 0 },
    tf: { total: 0, count: 0 },
    jp: { total: 0, count: 0 },
  };
  for (const q of questions) {
    const a = answers[q.id];
    if (typeof a !== 'number' || a < 1 || a > 5) continue;
    const agreement = (a - 1) / 4;
    sums[q.axis].total += q.pole === 'right' ? agreement : 1 - agreement;
    sums[q.axis].count += 1;
  }
  const out = {} as Axes;
  for (const k of AXIS_KEYS) out[k] = sums[k].count ? sums[k].total / sums[k].count : 0.5;
  return out;
}
