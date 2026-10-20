import { useEffect, useState } from 'react';
import { LANGUAGES, useI18n } from '../i18n';
import { useToast } from './Toast';
import { asset } from '../lib/assets';

const NAV = [
  ['mechanism', 'nav.idea'],
  ['results', 'nav.results'],
  ['tradeoff', 'nav.cost'],
  ['outages', 'nav.outages'],
  ['literature', 'nav.map'],
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="segmented lang-switch" role="group" aria-label={t('langSwitch.aria')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={l.code === lang ? 'active' : ''}
          aria-pressed={l.code === lang}
          lang={l.code}
          title={l.name}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useI18n();
  const toast = useToast();
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        }),
      { rootMargin: '-20% 0px -65% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label={t('brandAria')}>
        <span className="brand-mark">
          a<span>↗</span>
        </span>
        <span>
          RESEARCH
          <br />
          <b>ATLAS</b>
        </span>
      </a>
      <nav aria-label={t('nav.aria')}>
        {NAV.map(([id, key]) => (
          <a key={id} href={'#' + id} className={current === id ? 'current' : undefined}>
            {t(key)}
          </a>
        ))}
      </nav>
      <div className="topbar-tools">
        <LanguageSwitcher />
        <a
          className="small-btn"
          href={asset('downloads/Article_MT1_v6.pdf')}
          download="Article_MT1_v6.pdf"
          onClick={() => toast(t('toast.fileReady', { name: 'Article_MT1_v6.pdf' }))}
        >
          {t('pdfButton')} <span>↗</span>
        </a>
      </div>
    </header>
  );
}
