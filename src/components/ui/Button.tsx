import type { ButtonHTMLAttributes } from 'react';
import { cx, forcedClass, type ForcedState } from './utils';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  forceState?: ForcedState;
}

export function Button({ variant = 'primary', forceState, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx('ui-btn', `ui-btn--${variant}`, forcedClass(forceState), className)} {...rest} />;
}
