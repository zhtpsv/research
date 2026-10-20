import { useRef } from 'react';
import { useContainerWidth } from '../../hooks/useContainerWidth';
import { useI18n } from '../../i18n';
import { useA11y } from '../../a11y/A11yContext';
import { DATA, name, wilson } from '../../lib/research';

const CONFIGS = ['off', 'stop3_200', 'stop4_200', 'stop7_200', 'local_fallback200', 'remote7'];
const SHORT = ['Off', 'S3', 'S4', 'S7', 'Sw3', 'R7'];

/** Collisions inside the overlap / no-overlap groups of the random outage profile (port of renderStrata()). */
export default function StrataChart({ mode }) {
  const { t, fmt } = useI18n();
  const { chartFont: k } = useA11y();
  const holder = useRef(null);
  const width = useContainerWidth(holder);

  const w = Math.max(280, width);
  const mobile = width < 550;
  const h = 350;
  const left = 43,
    right = 16,
    top = 28,
    bot = 58;
  const pw = w - left - right;
  const ph = h - top - bot;
  const rate = mode === 'rate';
  const max = rate ? 0.6 : 100;
  const Y = (v) => top + ph - (v / max) * ph;
  const gw = pw / 6;
  const bw = Math.min(26, gw * 0.28);

  return (
    <div id="strata-chart" className="large-chart" ref={holder}>
      {width > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={t('outages.inGroups')}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const v = (max * i) / 5;
            return (
              <g key={i}>
                <line x1={left} y1={Y(v)} x2={w - right} y2={Y(v)} stroke="#dce3d6" strokeWidth="1" />
                <text x={left - 7} y={Y(v) + 4} textAnchor="end" fill="#6d766b" fontSize={10 * k}>
                  {rate ? Math.round(v * 100) : Math.round(v)}
                </text>
              </g>
            );
          })}
          {CONFIGS.map((conf, i) => (
            <g key={conf}>
              {['overlap', 'no_overlap'].map((stratum, j) => {
                const r = DATA.strata.find((x) => x.stratum === stratum && x.config === conf);
                const n = Number(r.n);
                const events = Number(r.events);
                const value = rate ? events / n : events;
                const x = left + gw * (i + 0.5) + (j ? 2 : -bw - 2);
                const y = Y(value);
                const [lo, hi] = rate ? wilson(events, n) : [0, 0];
                return (
                  <g key={stratum}>
                    <rect
                      x={x}
                      y={y}
                      width={bw}
                      height={Math.max(1, top + ph - y)}
                      rx={2}
                      fill={j ? '#c57445' : '#237868'}
                      tabIndex={0}
                      role="img"
                      aria-label={t('outages.barAria', {
                        name: name(conf),
                        group: j ? t('outages.groupNoOverlap') : t('outages.groupOverlap'),
                        events,
                        n,
                      })}
                    >
                      <title>{`${name(conf)}: ${events}/${n}, ${fmt((events / n) * 100, 2)}%`}</title>
                    </rect>
                    {rate && <line x1={x + bw / 2} x2={x + bw / 2} y1={Y(lo)} y2={Y(hi)} stroke="#435748" strokeWidth="1" />}
                    <text x={x + bw / 2} y={y - 7} textAnchor="middle" fill="#314b3d" fontSize={(mobile ? 9 : 11) * k}>
                      {events}
                    </text>
                  </g>
                );
              })}
              <text x={left + gw * (i + 0.5)} y={top + ph + 22} textAnchor="middle" fill="#6d766b" fontSize={(mobile ? 10 : 11) * k}>
                {mobile ? SHORT[i] : name(conf)}
              </text>
            </g>
          ))}
          <text x={left} y={13} textAnchor="start" fill="#6d766b" fontSize={(mobile ? 9 : 10) * k}>
            {rate ? t('outages.axisRate') : t('outages.axisCount')}
          </text>
          <text x={w / 2} y={h - 9} textAnchor="middle" fill="#6d766b" fontSize={9 * k}>
            {mobile ? t('outages.footerShort') : t('outages.footerFull')}
          </text>
        </svg>
      )}
    </div>
  );
}
