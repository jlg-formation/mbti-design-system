import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Field.css';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  forceState?: ForcedState;
}

export function Select({ label, options, value, onChange, placeholder = 'Choisir…', disabled, forceState }: SelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const choose = (i: number) => {
    onChange(options[i].value);
    close();
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = (now - t.at > 600 ? '' : t.text) + e.key.toLowerCase();
          t.at = now;
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div ref={rootRef} className={cx('ui-field', 'ui-select', disabled && 'is-disabled')}>
      <span id={labelId} className="ui-field__label">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={cx('ui-input', 'ui-select__trigger', forcedClass(forceState))}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${id}-value`}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKey}
      >
        <span id={`${id}-value`} className={cx(!selected && 'ui-select__placeholder')}>
          {selected?.label ?? placeholder}
        </span>
        <svg className="ui-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${id}-opt-${active}`}
          className="ui-select__list ui-popover"
          onKeyDown={onListKey}
          onBlur={(e) => {
            if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
          }}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={o.value === value}
              className={cx('ui-select__option', i === active && 'is-active')}
              onPointerMove={() => setActive(i)}
              onClick={() => choose(i)}
            >
              {o.label}
              {o.value === value && (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="ui-select__check">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
