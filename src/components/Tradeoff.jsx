import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import SectionHead from './SectionHead';
import Segmented from './Segmented';
import SweepChart from './charts/SweepChart';
import { name, sweepPoints } from '../lib/research';

export default function Tradeoff() {
  const { t, tr, fmt } = useI18n();
  const [profile, setProfile] = useState('P1');
  // null = initial hint, 'reset' = profile just changed, otherwise a selected point
  const [detail, setDetail] = useState(null);
  const points = useMemo(() => sweepPoints(profile), [profile]);
  const selectedIndex = detail && detail !== 'reset' ? points.findIndex((p) => p.config === detail.config) : -1;

  let detailNode;
  if (detail === null) detailNode = t('tradeoff.detailInitial');
  else if (detail === 'reset') detailNode = t('tradeoff.detailReset');
  else {
    const label = name(detail.config) + (detail.threshold ? ` · ${detail.threshold} ${t('units.ms')}` : '');
    detailNode = (
      <>
        {tr('tradeoff.detailLine', {
          name: label,
          profile,
          events: detail.events,
          rate: fmt(detail.rate * 100, 2),
          cost: fmt(detail.cost, 3),
        })}
        {detail.threshold ? t('tradeoff.detailThreshold') : t('tradeoff.detailArch')}
      </>
    );
  }

  return (
    <section className="wrap section" id="tradeoff">
      <SectionHead ns="tradeoff" />
      <div className="toolbar">
        <Segmented
          id="sweep-profiles"
          ariaLabel={t('tradeoff.profileAria')}
          options={[
            { value: 'P1', label: t('tradeoff.p1') },
            { value: 'P2', label: t('tradeoff.p2') },
          ]}
          value={profile}
          onChange={(p) => {
            setProfile(p);
            setDetail('reset');
          }}
        />
        <div className="legend">
          <span><i style={{ background: '#237868' }}></i>Stop 3</span>
          <span><i style={{ background: '#c57445' }}></i>Stop 4</span>
          <span><i style={{ background: '#8b8d53' }}></i>Stop 7</span>
          <span><i className="ref-dot"></i>{t('tradeoff.alternatives')}</span>
        </div>
      </div>
      <SweepChart points={points} onSelect={setDetail} />
      <label className="sweep-selector">
        {t('tradeoff.pointLabel')}
        <select
          id="sweep-point"
          aria-label={t('tradeoff.pointAria')}
          value={selectedIndex >= 0 ? String(selectedIndex) : ''}
          onChange={(e) => {
            if (e.target.value !== '') setDetail(points[Number(e.target.value)]);
          }}
        >
          <option value="">{t('tradeoff.pointPlaceholder')}</option>
          {points.map((p, i) => (
            <option key={p.config} value={i}>
              {name(p.config)}
              {p.threshold ? ` · ${p.threshold} ${t('units.ms')}` : ''} — {p.events}/400 · {fmt(p.cost, 3)} {t('units.m')}
            </option>
          ))}
        </select>
      </label>
      <div className="sweep-detail" id="sweep-detail" aria-live="polite">
        {detailNode}
      </div>
      <p className="note">{t('tradeoff.note')}</p>
    </section>
  );
}
