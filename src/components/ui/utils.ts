export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Demo-only: renders a component as if it were hovered or focused. */
export type ForcedState = 'hover' | 'focus' | undefined;

export const forcedClass = (state: ForcedState) => (state ? `is-${state}` : undefined);
