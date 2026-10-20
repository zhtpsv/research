import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { useToast } from './Toast';
import SectionHead from './SectionHead';
import Segmented from './Segmented';
import BarChart from './charts/BarChart';
import { PROFILES, compareRows, name, thresholdValues } from '../lib/research';
import { download, toCsv } from '../lib/download';

function findingKey(profile, threshold) {
  if (profile === 'P2' && threshold === 200) return 'p2';
  if (profile === 'P3R') return 'p3r';
  if (profile === 'P3' && threshold === 200) return 'p3';
  if (profile === 'P1' && [200, 210].includes(threshold)) return 'p1';
  if (threshold <= 60) return 'low';
  if ([190, 210].includes(threshold) && ['P1', 'P2'].includes(profile)) return 'neighbor';
  return 'default';
}

export default function Results() {
  const { t, tr, fmt } = useI18n();
  const toast = useToast();
  const [profile, setProfile] = useState('P2');
  const [threshold, setThreshold] = useState(200);
  const [metric, setMetric] = useState('cost');

  const values = useMemo(() => thresholdValues(profile), [profile]);
  // original initThreshold(): keep the threshold if it exists for the profile, otherwise 200 or the first one
  const thr = values.includes(threshold) ? threshold : values.includes(200) ? 200 : values[0];
  const rows = useMemo(() => compareRows(profile, thr), [profile, thr]);

  const exportCsv = () => {
    const data = [
      ['profile', 'threshold_ms', 'control', 'collision_events', 'n', 'J_m2_s2', 'cruise_loss_m', 'cruise_backup_s', 'shared_reference'],
      ...rows.map((r) => [profile, thr, r.config, r.b.events, 400, r.b.impact_squared, r.cost ?? '', r.c?.fallback_s ?? '', r.shared]),
    ];
    const filename = `comparison_${profile}_${thr}ms.csv`;
    download(toCsv(data), filename, 'text/csv;charset=utf-8');
    toast(t('toast.fileReady', { name: filename }));
  };

  const th = t('results.th');
  return (
    <section className="results-section" id="results">
      <div className="wrap section">
        <SectionHead ns="results" />
        <div className="toolbar">
          <Segmented
            id="profiles"
            ariaLabel={t('results.profileAria')}
            options={PROFILES.map((p) => ({ value: p, label: p }))}
            value={profile}
            onChange={(p) => {
              // original initThreshold(): keep the threshold if the new profile has it, otherwise fall back to 200 / the first one
              const next = thresholdValues(p);
              setProfile(p);
              setThreshold(next.includes(thr) ? thr : next.includes(200) ? 200 : next[0]);
            }}
          />
          <label>
            {t('results.threshold')}
            <select id="threshold" value={thr} onChange={(e) => setThreshold(Number(e.target.value))}>
              {values.map((v) => (
                <option key={v} value={v}>
                  {v} {t('units.ms')}
                </option>
              ))}
            </select>
          </label>
          <button className="small-btn" id="export-comparison" onClick={exportCsv}>
            {t('results.exportCsv')}
          </button>
        </div>
        <p className="profile-description" id="profile-description">
          {tr(`results.profiles.${profile}`)}
        </p>
        <div className="charts-grid">
          <div className="chart-panel">
            <div className="panel-head">
              <h3>{t('results.collisions')}</h3>
              <span>{t('results.collisionsSub')}</span>
            </div>
            <BarChart rows={rows} metricKey="collision" ariaLabel={t('results.collisionAria')} />
          </div>
          <div className="chart-panel">
            <div className="panel-head">
              <h3 id="metric-title">{t(`results.metricTitles.${metric}`)}</h3>
              <select id="metric" aria-label={t('results.metricAria')} value={metric} onChange={(e) => setMetric(e.target.value)}>
                {['cost', 'impact_squared', 'fallback_s', 'entries'].map((m) => (
                  <option key={m} value={m}>
                    {t(`results.metrics.${m}`)}
                  </option>
                ))}
              </select>
            </div>
            <BarChart rows={rows} metricKey={metric} ariaLabel={t('results.metricChartAria')} />
          </div>
        </div>
        <div className="finding" id="comparison-finding" aria-live="polite">
          {tr(`results.findings.${findingKey(profile, thr)}`)}
        </div>
        <div className="table-shell">
          <table id="comparison-table">
            <caption className="sr-only">{t('results.tableCaption')}</caption>
            <thead>
              <tr>
                {th.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.config} className={['remote7', `stop7_${thr}`].includes(r.config) ? 'highlight' : ''}>
                  <td>
                    {name(r.config)}
                    {r.shared && <span className="ref-label">{t('results.sharedRef')}</span>}
                  </td>
                  <td>{r.b.events} / 400</td>
                  <td>{fmt(r.b.impact_squared, 3)}</td>
                  <td>{r.cost === null ? '—' : Math.abs(r.cost) < 0.005 ? '≈0' : fmt(r.cost, 3)}</td>
                  <td>{r.c ? fmt(r.c.fallback_s, 3) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">{t('results.note')}</p>
      </div>
    </section>
  );
}
