import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Field.css';
import './DatePicker.css';

const WEEKDAYS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const WEEKDAYS_LONG = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
const longFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
/** Monday = 0. */
const weekday = (d: Date) => (d.getDay() + 6) % 7;

function monthGrid(month: Date): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -weekday(first));
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
}

export interface DatePickerProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
  disabled?: boolean;
  forceState?: ForcedState;
}

export function DatePicker({ label, value, onChange, disabled, forceState }: DatePickerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<Date>(value ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const focusGrid = useRef(false);
  const today = new Date();

  useEffect(() => {
    if (!open || !focusGrid.current) return;
    focusGrid.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [open, focused]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const pick = (d: Date) => {
    onChange(d);
    close();
  };

  const onGridKey = (e: KeyboardEvent) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -weekday(focused)),
      End: () => addDays(focused, 6 - weekday(focused)),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      focusGrid.current = true;
      setFocused(moves[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(focused);
    }
  };

  const weeks = monthGrid(focused);
  const titleId = `${id}-title`;

  return (
    <div ref={rootRef} className={cx('ui-field', 'ui-datepicker', disabled && 'is-disabled')}>
      <span id={`${id}-label`} className="ui-field__label">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={cx('ui-input', 'ui-datepicker__trigger', forcedClass(forceState))}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        disabled={disabled}
        onClick={() => {
          setFocused(value ?? new Date());
          focusGrid.current = !open;
          setOpen(!open);
        }}
      >
        <span id={`${id}-value`} className={cx(!value && 'ui-select__placeholder')}>
          {value ? shortFmt.format(value) : 'jj/mm/aaaa'}
        </span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="ui-datepicker__icon">
          <rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="ui-datepicker__panel ui-popover"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              close();
            }
          }}
        >
          <div className="ui-datepicker__header">
            <button
              type="button"
              className="ui-datepicker__nav"
              aria-label="Mois précédent"
              onClick={() => setFocused(addMonths(focused, -1))}
            >
              ‹
            </button>
            <h3 id={titleId} className="ui-datepicker__title" aria-live="polite">
              {monthFmt.format(focused)}
            </h3>
            <button
              type="button"
              className="ui-datepicker__nav"
              aria-label="Mois suivant"
              onClick={() => setFocused(addMonths(focused, 1))}
            >
              ›
            </button>
          </div>
          <table ref={gridRef} role="grid" aria-labelledby={titleId} className="ui-datepicker__grid" onKeyDown={onGridKey}>
            <thead>
              <tr>
                {WEEKDAYS.map((d, i) => (
                  <th key={d} scope="col" abbr={WEEKDAYS_LONG[i]}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week[0].toISOString()}>
                  {week.map((day) => {
                    const outside = day.getMonth() !== focused.getMonth();
                    const isSelected = !!value && sameDay(day, value);
                    return (
                      <td key={day.toISOString()} role="gridcell" aria-selected={isSelected}>
                        <button
                          type="button"
                          tabIndex={sameDay(day, focused) ? 0 : -1}
                          aria-label={longFmt.format(day)}
                          aria-current={sameDay(day, today) ? 'date' : undefined}
                          className={cx(
                            'ui-datepicker__day',
                            outside && 'is-outside',
                            isSelected && 'is-selected',
                            sameDay(day, today) && 'is-today',
                          )}
                          onClick={() => pick(day)}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
