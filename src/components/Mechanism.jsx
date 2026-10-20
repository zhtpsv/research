import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import SectionHead from './SectionHead';

export default function Mechanism() {
  const { t, tr } = useI18n();
  const [age, setAge] = useState(120);
  const [mode, setMode] = useState('7');
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  // "Animate the age": the original stepped the slider by 10 ms every 160 ms
  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setInterval(() => setAge((a) => (a + 10) % 410), 160);
    return () => clearInterval(timer.current);
  }, [playing]);

  const stale = age > 200;
  const finalText = stale ? (mode === 'switch' ? t('mechanism.finalSwitch') : t('mechanism.finalStop')) : t('mechanism.finalNormal');
  const status = stale
    ? mode === 'switch'
      ? t('mechanism.statusSwitch', { age })
      : t('mechanism.statusStop', { age, mode })
    : t('mechanism.statusOk', { age });

  return (
    <section className="wrap section" id="mechanism">
      <SectionHead ns="mechanism" />
      <div className="mechanism-grid">
        <div className="rule-box">
          <div className="rule-flow">
            <span>{t('mechanism.flowState')}</span>
            <i>→</i>
            <span>{t('mechanism.flowRemote')}</span>
            <i>→</i>
            <span id="rule-final" style={{ background: stale ? '#f2dfce' : '#e7eddf' }}>
              {finalText}
            </span>
          </div>
          <div className="age-scale">
            <div
              className="age-scale-fill"
              id="age-fill"
              style={{ width: age / 4 + '%', background: stale ? '#c57445' : '#237868' }}
            ></div>
            <div className="age-marker">
              <span>τ = 200 {t('units.ms')}</span>
            </div>
          </div>
          <div className="range-label">
            <label htmlFor="age">{t('mechanism.ageLabel')}</label>
            <output id="age-value" htmlFor="age">
              {age} {t('units.ms')}
            </output>
          </div>
          <input
            type="range"
            id="age"
            min="0"
            max="400"
            step="10"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <div className="range-ends">
            <span>{t('mechanism.ageFresh')}</span>
            <span>{t('mechanism.ageStale')}</span>
          </div>
          <div className="control-row">
            <label>
              {t('mechanism.backupLabel')}
              <select id="backup-rule" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="7">{t('mechanism.optStop7')}</option>
                <option value="3">{t('mechanism.optStop3')}</option>
                <option value="switch">{t('mechanism.optSwitch')}</option>
              </select>
            </label>
            <button className="outline" id="play-age" aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
              {playing ? t('mechanism.pause') : t('mechanism.play')}
            </button>
          </div>
          <div
            className="rule-status"
            id="rule-status"
            aria-live="polite"
            style={{ borderColor: stale ? '#c57445' : '#237868' }}
          >
            {status}
          </div>
          <p className="note">{tr('mechanism.note')}</p>
        </div>
        <div className="question-stack">
          {t('mechanism.faq').map((item, i) => (
            <details key={i} open={i === 0 ? true : undefined}>
              <summary>{item.q}</summary>
              <p>{tr(`mechanism.faq.${i}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
