import type { CSSProperties, ReactNode } from 'react';
import { MorphCaps } from '../components/MorphCaps';
import './DemoCard.css';

/** Stable pseudo-random value in [-1, 1] so each card leans its own way on the P side. */
const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

export interface DemoCardProps {
  index: number;
  title: string;
  description: string;
  children: ReactNode;
  states?: ReactNode;
  wide?: boolean;
}

export function DemoCard({ index, title, description, children, states, wide }: DemoCardProps) {
  const id = `demo-${index}`;
  const style = { '--seed': seeded(index), '--seed-2': seeded(index + 100) } as CSSProperties;
  return (
    <section className={`demo-card${wide ? ' demo-card--wide' : ''}`} style={style} aria-labelledby={id}>
      <header className="demo-card__header">
        <span className="demo-card__index" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <div>
          <h2 id={id} className="demo-card__title">
            <MorphCaps>{title}</MorphCaps>
          </h2>
          <p className="demo-card__description">{description}</p>
        </div>
      </header>
      <div className="demo-card__live">{children}</div>
      {states && (
        // Static previews of forced states: hidden from keyboard and screen readers to avoid duplicates.
        <div className="demo-card__states" inert>
          <h3 className="demo-card__states-title">États</h3>
          {states}
        </div>
      )}
    </section>
  );
}

export function StateItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="demo-state">
      <span className="demo-state__label">{label}</span>
      <div className="demo-state__content">{children}</div>
    </div>
  );
}
