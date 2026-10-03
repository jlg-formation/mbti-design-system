/** Text cross-faded into spaced capitals by `--caps`, so the switch stays continuous. */
export function MorphCaps({ children }: { children: string }) {
  return (
    <span className="morph-caps">
      <span className="morph-caps__base">{children}</span>
      <span className="morph-caps__upper" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
