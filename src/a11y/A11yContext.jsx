import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const TEXT_SIZES = [100, 115, 130, 150, 175, 200];

export const DEFAULTS = {
  size: 100, // % of normal text size
  contrast: 'off', // off | high | dark
  lh: 0, // line height level 0-2
  ls: 0, // letter spacing level 0-2
  ws: 0, // word spacing level 0-2
  font: false, // plain readable font
  links: false, // underline links
  headings: false, // highlight headings
  gray: false,
  noimg: false,
  motion: false, // stop animations
  cursor: false,
  focus: false,
  guide: false, // reading ruler
};

const STORAGE_KEY = 'research-atlas:a11y';
const A11yContext = createContext(null);

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    }
  } catch {}
  return { ...DEFAULTS };
}

/** Writes the settings to <html>: a CSS variable for text size plus data-attributes/classes that a11y.css reacts to. */
function apply(s) {
  const root = document.documentElement;
  root.style.setProperty('--fs', String(s.size / 100));
  root.dataset.a11yContrast = s.contrast;
  root.dataset.a11yLh = String(s.lh);
  root.dataset.a11yLs = String(s.ls);
  root.dataset.a11yWs = String(s.ws);
  const flags = { font: s.font, links: s.links, headings: s.headings, gray: s.gray, noimg: s.noimg, motion: s.motion, cursor: s.cursor, focus: s.focus };
  Object.entries(flags).forEach(([k, v]) => root.classList.toggle('a11y-' + k, Boolean(v)));
  const touched = JSON.stringify(s) !== JSON.stringify(DEFAULTS);
  root.classList.toggle('a11y-active', touched);
}

export function A11yProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    apply(settings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const set = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  const reset = useCallback(() => setSettings({ ...DEFAULTS }), []);
  const stepSize = useCallback(
    (dir) =>
      setSettings((s) => {
        const i = Math.max(0, TEXT_SIZES.indexOf(s.size));
        const next = TEXT_SIZES[Math.min(TEXT_SIZES.length - 1, Math.max(0, i + dir))];
        return { ...s, size: next };
      }),
    [],
  );

  const value = useMemo(
    () => ({
      settings,
      set,
      reset,
      stepSize,
      // Factor for text inside SVG charts (capped so that chart labels keep fitting)
      chartFont: Math.min(settings.size / 100, 1.3),
    }),
    [settings, set, reset, stepSize],
  );
  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside <A11yProvider>');
  return ctx;
}
