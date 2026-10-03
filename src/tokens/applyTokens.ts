let previous: Record<string, string> = {};

/** Writes only the custom properties that changed since the last call. */
export function applyCssVars(vars: Record<string, string>, el: HTMLElement = document.documentElement) {
  for (const [name, value] of Object.entries(vars)) {
    if (previous[name] !== value) el.style.setProperty(name, value);
  }
  previous = vars;
}
