import { useId, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { clamp } from '../../tokens/math';
import { cx, forcedClass, type ForcedState } from './utils';
import './Slider.css';

export interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (v: number) => string;
  forceState?: ForcedState;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  formatValue = String,
  forceState,
}: SliderProps) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const ratio = (value - min) / (max - min);

  const set = (v: number) => {
    const snapped = Math.round((v - min) / step) * step + min;
    onChange(clamp(Number(snapped.toFixed(6)), min, max));
  };

  const fromPointer = (e: PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect();
    set(min + ((e.clientX - rect.left) / rect.width) * (max - min));
  };

  const onKey = (e: KeyboardEvent) => {
    const big = (max - min) / 10;
    const map: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + big,
      PageDown: value - big,
      Home: min,
      End: max,
    };
    if (e.key in map) {
      e.preventDefault();
      set(map[e.key]);
    }
  };

  return (
    <div className={cx('ui-slider', disabled && 'is-disabled')}>
      <div className="ui-slider__header">
        <span id={`${id}-label`} className="ui-slider__label">
          {label}
        </span>
        <output className="ui-slider__value" aria-hidden="true">
          {formatValue(value)}
        </output>
      </div>
      <div
        ref={trackRef}
        className="ui-slider__track"
        style={{ '--ratio': ratio } as CSSProperties}
        onPointerDown={(e) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus();
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e);
        }}
      >
        <div className="ui-slider__fill" />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={`${id}-label`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          aria-disabled={disabled || undefined}
          className={cx('ui-slider__thumb', forcedClass(forceState))}
          onKeyDown={disabled ? undefined : onKey}
        />
      </div>
    </div>
  );
}
