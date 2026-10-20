import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ru from './ru';
import en from './en';
import kk from './kk';
import { parseRich } from './rich';

export const LANGUAGES = [
  { code: 'ru', label: 'RU', name: 'Русский', locale: 'ru-RU', speech: 'ru-RU' },
  { code: 'en', label: 'EN', name: 'English', locale: 'en-US', speech: 'en-US' },
  { code: 'kk', label: 'KK', name: 'Қазақша', locale: 'ru-RU', speech: 'kk-KZ' },
];

const DICTS = { ru, en, kk };
const STORAGE_KEY = 'research-atlas:lang';

function lookup(dict, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

function detectInitialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && DICTS[q]) return q;
  } catch {}
  try {
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (s && DICTS[s]) return s;
  } catch {}
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'ru';
  const short = nav.slice(0, 2).toLowerCase();
  return DICTS[short] ? short : 'ru';
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);
  const meta = LANGUAGES.find((l) => l.code === lang);

  const setLang = useCallback((code) => {
    if (!DICTS[code]) return;
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', code);
      window.history.replaceState(null, '', url);
    } catch {}
  }, []);

  // <html lang>, <title>, meta description follow the language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].meta.title;
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', DICTS[lang].meta.description);
  }, [lang]);

  const value = useMemo(() => {
    const dict = DICTS[lang];
    const locale = meta.locale;
    const interpolate = (str, params) =>
      params ? str.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m)) : str;

    /** plain string (or array / object) by dotted path, falls back to Russian */
    const t = (path, params) => {
      let v = lookup(dict, path);
      if (v === undefined) v = lookup(ru, path);
      if (typeof v === 'string') return interpolate(v, params);
      return v === undefined ? path : v;
    };
    /** same, but renders inline markup (<b>, <em>, <br> …) into React nodes */
    const tr = (path, params) => {
      const v = t(path, params);
      return typeof v === 'string' ? parseRich(v) : v;
    };
    const formatters = new Map();
    const fmt = (n, d = 2) => {
      const k = d;
      if (!formatters.has(k))
        formatters.set(k, new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }));
      return formatters.get(k).format(Number(n));
    };
    return { lang, setLang, locale, speechLang: meta.speech, t, tr, fmt };
  }, [lang, meta, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
