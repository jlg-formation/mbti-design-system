import { useId } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Switch.css';

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  forceState?: ForcedState;
}

export function Switch({ label, checked, onChange, disabled, forceState }: SwitchProps) {
  const id = useId();
  return (
    <div className={cx('ui-switch', disabled && 'is-disabled')}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cx('ui-switch__track', forcedClass(forceState))}
        onClick={() => onChange(!checked)}
      >
        <span className="ui-switch__thumb" aria-hidden="true" />
      </button>
      <label htmlFor={id} className="ui-switch__label">
        {label}
      </label>
    </div>
  );
}
