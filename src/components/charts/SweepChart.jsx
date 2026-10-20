import { useMemo, useRef } from 'react';
import { useContainerWidth } from '../../hooks/useContainerWidth';
import { useI18n } from '../../i18n';
import { useA11y } from '../../a11y/A11yContext';
import { color, name } from '../../lib/research';

/** Collisions vs. cruise-distance loss for every available paired threshold (port of renderSweep()). */
export default function SweepChart({ points, onSelect }) {
  const { t, fmt } = useI18n();
  const { chartFont: k } = useA11y();
  const holder = useRef(null);
  const width = useContainerWidth(holder);

  const w = Math.max(280, width);
  const mobile = width < 550;
  const h = mobile ? 330 : 370;
  const left = 43,
    right = 17,
    top = 28,
    bottom = 55;
  const pw = w - left - right;
  const ph = h - top - bottom;
  const X = (v) => left + ((v + 3) / 116) * pw;
  const Y = (v) => top + ph - (v / 0.35) * ph;

  const xTicks = [0, 25, 50, 75, 100];
  const yTicks = useMemo(() => {
    const a = [];
    for (let v = 0; v <= 0.35 + 0.0001; v += 0.05) a.push(v);
    return a;
  }, []);

  const callouts = [
    ['off', 'Off', -11],
    ['local3', 'Local 3', -11],
    ['remote7', 'Remote 7 / Local 7', -18],
  ];

  return (
    <div id="sweep-chart" className="large-chart" ref={holder}>
      {width > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={t('tradeoff.chartAria')}>
          {xTicks.map((v) => (
            <g key={'x' + v}>
              <line x1={X(v)} y1={top} x2={X(v)} y2={top + ph} stroke="#dce3d6" strokeWidth="1" />
              <text x={X(v)} y={top + ph + 19} textAnchor="middle" fill="#6d766b" fontSize={10 * k}>
                {v}
              </text>
            </g>
          ))}
          {yTicks.map((v) => (
            <g key={'y' + v}>
              <line x1={left} y1={Y(v)} x2={w - right} y2={Y(v)} stroke="#dce3d6" strokeWidth="1" />
              <text x={left - 8} y={Y(v) + 4} textAnchor="end" fill="#6d766b" fontSize={10 * k}>
                {Math.round(v * 100)}
              </text>
            </g>
          ))}
          <text x={left} y={13} textAnchor="start" fill="#6d766b" fontSize={10 * k}>
            {t('tradeoff.axisY')}
          </text>
          <text x={w / 2} y={h - 9} textAnchor="middle" fill="#6d766b" fontSize={(mobile ? 9 : 11) * k}>
            {t('tradeoff.axisX')}
          </text>
          {points.map((p) => {
            const x = X(p.cost);
            const y = Y(p.rate);
            const select = () => onSelect(p);
            return (
              <g
                key={p.config}
                className="data-point"
                tabIndex={0}
                role="button"
                aria-label={t('tradeoff.pointAriaLabel', {
                  name: name(p.config),
                  thr: p.threshold || '',
                  events: p.events,
                  cost: fmt(p.cost, 3),
                })}
                onClick={select}
                onFocus={select}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select();
                  }
                }}
              >
                {p.threshold ? (
                  <circle cx={x} cy={y} r={mobile ? 4 : 4.5} fill={color(p.config)} />
                ) : (
                  <rect x={x - 4} y={y - 4} width={8} height={8} fill="#fffefa" stroke="#244d3f" strokeWidth="1.5" />
                )}
                <title>
                  {name(p.config)}
                  {p.threshold ? ` ${p.threshold} ${t('units.ms')}` : ''}: {p.events}/400, {fmt(p.cost, 3)} {t('units.m')}
                </title>
              </g>
            );
          })}
          {callouts.map(([c, label, dy]) => {
            const p = points.find((q) => q.config === c);
            if (!p) return null;
            const x = X(p.cost);
            const y = Y(p.rate);
            return (
              <g key={'c' + c}>
                <text x={x + 10} y={y + dy} textAnchor="start" fill="#345346" fontSize={(mobile ? 9 : 10) * k}>
                  {label}
                </text>
                <line x1={x + 4} y1={y - 3} x2={x + 8} y2={y + dy + 2} stroke="#dce3d6" strokeWidth="1" />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
