import { useId, type InputHTMLAttributes } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Field.css';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  forceState?: ForcedState;
}

export function TextInput({ label, hint, error, forceState, className, ...rest }: TextInputProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const message = error ?? hint;
  return (
    <div className={cx('ui-field', error && 'has-error', rest.disabled && 'is-disabled', className)}>
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={cx('ui-input', forcedClass(forceState))}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? descId : undefined}
        {...rest}
      />
      {message && (
        <p id={descId} className={cx('ui-field__message', error && 'ui-field__message--error')}>
          {error && <span aria-hidden="true">⚠ </span>}
          {message}
        </p>
      )}
    </div>
  );
}
