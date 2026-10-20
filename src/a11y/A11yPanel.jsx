import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';
import { TEXT_SIZES, useA11y } from './A11yContext';
import { useSpeech } from './useSpeech';

function Icon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="4.6" r="1.9" fill="currentColor" stroke="none" />
      <path d="M4.8 8.6 12 9.8l7.2-1.2" />
      <path d="M12 9.8V15" />
      <path d="M8.8 21 12 15l3.2 6" />
    </svg>
  );
}

function Switch({ checked, onChange, children }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={'a11y-switch' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
      <span className="a11y-switch-label">{children}</span>
      <span className="a11y-switch-track" aria-hidden="true">
        <span className="a11y-switch-thumb" />
      </span>
    </button>
  );
}

function Levels({ id, label, value, onChange }) {
  const { t } = useI18n();
  const items = [t('a11y.levelOff'), t('a11y.level1'), t('a11y.level2')];
  return (
    <div className="a11y-row">
      <span className="a11y-row-label" id={'lv-' + id}>
        {label}
      </span>
      <div className="segmented" role="group" aria-labelledby={'lv-' + id}>
        {items.map((it, i) => (
          <button key={i} type="button" className={value === i ? 'active' : ''} aria-pressed={value === i} onClick={() => onChange(i)}>
            {it}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function A11yPanel() {
  const { t, speechLang } = useI18n();
  const { settings, set, reset, stepSize } = useA11y();
  const { speaking, speak, stop, available } = useSpeech(speechLang);
  const [open, setOpen] = useState(false);
  const fab = useRef(null);
  const panel = useRef(null);

  // Alt + A toggles the panel, Esc closes it
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // focus management: into the panel on open, back to the button on close
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) panel.current?.focus();
    else if (wasOpen.current) fab.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const sizeIndex = Math.max(0, TEXT_SIZES.indexOf(settings.size));

  return createPortal(
    <div className="a11y-root">
      <button
        ref={fab}
        type="button"
        className="a11y-fab"
        aria-label={t('a11y.open')}
        aria-expanded={open}
        aria-controls="a11y-panel"
        title={`${t('a11y.open')} (Alt + A)`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon />
      </button>

      {open && (
        <div id="a11y-panel" ref={panel} className="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title" tabIndex={-1}>
          <div className="a11y-head">
            <h2 id="a11y-title">{t('a11y.title')}</h2>
            <button type="button" className="a11y-close" aria-label={t('a11y.close')} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="a11y-body">
            <section className="a11y-group" aria-labelledby="a11y-g-size">
              <h3 id="a11y-g-size">{t('a11y.textSize')}</h3>
              <div className="a11y-size">
                <button type="button" aria-label={t('a11y.smaller')} disabled={sizeIndex === 0} onClick={() => stepSize(-1)}>
                  A<span>−</span>
                </button>
                <output aria-live="polite">{t('a11y.textSizeValue', { value: settings.size })}</output>
                <button type="button" aria-label={t('a11y.larger')} disabled={sizeIndex === TEXT_SIZES.length - 1} onClick={() => stepSize(1)}>
                  A<span>+</span>
                </button>
              </div>
            </section>

            <section className="a11y-group" aria-labelledby="a11y-g-contrast">
              <h3 id="a11y-g-contrast">{t('a11y.contrast')}</h3>
              <div className="segmented" role="group" aria-labelledby="a11y-g-contrast">
                {[
                  ['off', t('a11y.contrastOff')],
                  ['high', t('a11y.contrastHigh')],
                  ['dark', t('a11y.contrastDark')],
                ].map(([v, label]) => (
                  <button key={v} type="button" className={settings.contrast === v ? 'active' : ''} aria-pressed={settings.contrast === v} onClick={() => set({ contrast: v })}>
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="a11y-group" aria-labelledby="a11y-g-spacing">
              <h3 id="a11y-g-spacing">{t('a11y.spacing')}</h3>
              <Levels id="lh" label={t('a11y.lineHeight')} value={settings.lh} onChange={(lh) => set({ lh })} />
              <Levels id="ls" label={t('a11y.letterSpacing')} value={settings.ls} onChange={(ls) => set({ ls })} />
              <Levels id="ws" label={t('a11y.wordSpacing')} value={settings.ws} onChange={(ws) => set({ ws })} />
            </section>

            <section className="a11y-group" aria-labelledby="a11y-g-display">
              <h3 id="a11y-g-display">{t('a11y.display')}</h3>
              <Switch checked={settings.font} onChange={(font) => set({ font })}>{t('a11y.readableFont')}</Switch>
              <Switch checked={settings.links} onChange={(links) => set({ links })}>{t('a11y.underlineLinks')}</Switch>
              <Switch checked={settings.headings} onChange={(headings) => set({ headings })}>{t('a11y.highlightHeadings')}</Switch>
              <Switch checked={settings.gray} onChange={(gray) => set({ gray })}>{t('a11y.grayscale')}</Switch>
              <Switch checked={settings.noimg} onChange={(noimg) => set({ noimg })}>{t('a11y.hideImages')}</Switch>
              <Switch checked={settings.motion} onChange={(motion) => set({ motion })}>{t('a11y.reduceMotion')}</Switch>
              <Switch checked={settings.cursor} onChange={(cursor) => set({ cursor })}>{t('a11y.bigCursor')}</Switch>
              <Switch checked={settings.focus} onChange={(focus) => set({ focus })}>{t('a11y.focusRing')}</Switch>
              <Switch checked={settings.guide} onChange={(guide) => set({ guide })}>{t('a11y.readingGuide')}</Switch>
            </section>

            <section className="a11y-group" aria-labelledby="a11y-g-tools">
              <h3 id="a11y-g-tools">{t('a11y.tools')}</h3>
              {available ? (
                <>
                  <button type="button" className="primary a11y-speak" onClick={speaking ? stop : speak}>
                    {speaking ? '■ ' + t('a11y.speakStop') : '▶ ' + t('a11y.speak')}
                  </button>
                  <p className="a11y-hint">{t('a11y.speakHint')}</p>
                </>
              ) : (
                <p className="a11y-hint">{t('a11y.speakUnsupported')}</p>
              )}
            </section>
          </div>

          <div className="a11y-foot">
            <button type="button" className="outline" onClick={reset}>
              {t('a11y.reset')}
            </button>
            <p className="a11y-hint">
              {t('a11y.saved')} {t('a11y.shortcutHint')}
            </p>
          </div>
        </div>
      )}
    </div>,
    document.getElementById('overlay-root'),
  );
}
