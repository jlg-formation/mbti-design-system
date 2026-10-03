import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from './utils';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
}

export function Tabs({ label, items, value, onChange }: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = items.filter((t) => !t.disabled);

  const onKey = (e: KeyboardEvent) => {
    const i = enabled.findIndex((t) => t.id === value);
    const targets: Record<string, number> = {
      ArrowRight: (i + 1) % enabled.length,
      ArrowLeft: (i - 1 + enabled.length) % enabled.length,
      Home: 0,
      End: enabled.length - 1,
    };
    if (!(e.key in targets)) return;
    e.preventDefault();
    const next = enabled[targets[e.key]];
    onChange(next.id);
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${baseId}-tab-${next.id}`)}`)?.focus();
  };

  return (
    <div className="ui-tabs">
      <div ref={listRef} role="tablist" aria-label={label} className="ui-tabs__list" onKeyDown={onKey}>
        {items.map((t) => {
          const selected = t.id === value;
          return (
            <button
              key={t.id}
              id={`${baseId}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              className={cx('ui-tabs__tab', selected && 'is-selected')}
              onClick={() => onChange(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          id={`${baseId}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${t.id}`}
          tabIndex={0}
          hidden={t.id !== value}
          className="ui-tabs__panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
