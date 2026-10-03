import { useId } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Choice.css';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: string;
  name?: string;
  options: RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  hideLegend?: boolean;
  forceState?: ForcedState;
  className?: string;
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
  orientation = 'vertical',
  hideLegend,
  forceState,
  className,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  return (
    <fieldset className={cx('ui-radio-group', `ui-radio-group--${orientation}`, className)} disabled={disabled}>
      <legend className={cx('ui-radio-group__legend', hideLegend && 'visually-hidden')}>{legend}</legend>
      <div className="ui-radio-group__options">
        {options.map((o, i) => (
          <label
            key={o.value}
            className={cx(
              'ui-choice',
              (disabled || o.disabled) && 'is-disabled',
              i === 0 && forcedClass(forceState),
            )}
          >
            <input
              type="radio"
              className="ui-choice__input"
              name={groupName}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
            />
            <span className="ui-choice__box ui-choice__box--radio" aria-hidden="true" />
            <span className="ui-choice__label">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
