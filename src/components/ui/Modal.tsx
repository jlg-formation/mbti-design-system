import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './utils';
import './Modal.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current!;
    (dialog.querySelector<HTMLElement>('[data-autofocus]') ?? dialog).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.closest('[hidden]'));
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="ui-modal" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
        className={cx('ui-modal__dialog', `ui-modal__dialog--${size}`)}
      >
        <header className="ui-modal__header">
          <h2 id={`${id}-title`} className="ui-modal__title">
            {title}
          </h2>
          <button type="button" className="ui-modal__close" aria-label="Fermer" onClick={onClose}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        {description && (
          <p id={`${id}-desc`} className="ui-modal__description">
            {description}
          </p>
        )}
        {children && <div className="ui-modal__body">{children}</div>}
        {footer && <footer className="ui-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
