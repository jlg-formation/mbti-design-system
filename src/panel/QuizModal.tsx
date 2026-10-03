import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { RadioGroup } from '../components/ui/RadioGroup';
import { QUIZ, QUIZ_SCALE, scoreQuiz } from '../content/quiz';
import type { Axes } from '../tokens/types';

const SCALE_OPTIONS = QUIZ_SCALE.map((label, i) => ({ value: String(i + 1), label }));

export interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  onResult: (axes: Axes) => void;
}

export function QuizModal({ open, onClose, onResult }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answered = QUIZ.filter((q) => answers[q.id]).length;
  const complete = answered === QUIZ.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Trouve ton profil"
      description="8 affirmations, sans bonne ni mauvaise réponse. Indique à quel point chacune te ressemble : l’interface se transformera selon tes réponses."
      footer={
        <>
          <span className="quiz__progress" aria-live="polite">
            {answered} / {QUIZ.length}
          </span>
          <Button variant="ghost" onClick={() => setAnswers({})}>
            Effacer
          </Button>
          <Button
            disabled={!complete}
            onClick={() => {
              onResult(scoreQuiz(answers));
              setAnswers({});
            }}
          >
            Voir mon interface
          </Button>
        </>
      }
    >
      <ol className="quiz">
        {QUIZ.map((q, i) => (
          <li key={q.id} className="quiz__item" data-testid={`quiz-${q.id}`}>
            <RadioGroup
              legend={`${i + 1}. ${q.text}`}
              name={`quiz-${q.id}`}
              orientation="horizontal"
              options={SCALE_OPTIONS}
              value={answers[q.id] ? String(answers[q.id]) : undefined}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
            />
          </li>
        ))}
      </ol>
    </Modal>
  );
}
