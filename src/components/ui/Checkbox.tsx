import { useId, type InputHTMLAttributes } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Choice.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  forceState?: ForcedState;
}

export function Checkbox({ label, forceState, className, ...rest }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx('ui-choice', rest.disabled && 'is-disabled', forcedClass(forceState), className)}>
      <input id={id} type="checkbox" className="ui-choice__input" {...rest} />
      <span className="ui-choice__box ui-choice__box--check" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="ui-choice__mark">
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="ui-choice__label">{label}</span>
    </label>
  );
}
