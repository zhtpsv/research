import { useRef } from 'react';
import { useContainerWidth } from '../../hooks/useContainerWidth';
import { useI18n } from '../../i18n';
import { useA11y } from '../../a11y/A11yContext';
import { color, name, wilson } from '../../lib/research';

/**
 * Horizontal bar chart — a React port of the original `barChart()` SVG drawing.
 * metricKey: 'collision' (share with Wilson bars) | 'cost' | 'impact_squared' | 'fallback_s' | 'entries'
 */
export default function BarChart({ rows, metricKey, ariaLabel }) {
  const { t, fmt } = useI18n();
  const { chartFont: k } = useA11y();
  const holder = useRef(null);
  const width = useContainerWidth(holder);

  const collision = metricKey === 'collision';
  const metric = !collision;
  const values = rows.map((r) =>
    collision ? r.b.events / 400 : metricKey === 'cost' ? r.cost : metricKey === 'impact_squared' ? r.b.impact_squared : r.c?.[metricKey] ?? null,
  );

  const h = rows.length * 38 + 53;
  const w = Math.max(280, width);
  const left = w < 390 ? 77 : 91;
  const right = metric ? 64 : 85;
  const plot = w - left - right;
  const nonnull = values.filter((v) => v !== null);
  const max = collision ? Math.max(0.1, ...rows.map((r) => wilson(r.b.events)[1])) : Math.max(0.01, ...nonnull);
  const min = metric ? Math.min(0, ...nonnull) : 0;
  const span = (max - min) * 1.08;
  const X = (v) => left + ((v - min) / span) * plot;

  return (
    <div className="chart" ref={holder}>
      {width > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel}>
          {[0, 1, 2, 3, 4].map((i) => {
            const v = min + (span * i) / 4;
            return (
              <g key={i}>
                <line x1={X(v)} y1={12} x2={X(v)} y2={h - 35} stroke="#dce3d6" strokeWidth="1" />
                <text x={X(v)} y={h - 17} textAnchor="middle" fill="#6d766b" fontSize={9 * k}>
                  {collision ? Math.round(v * 100) + '%' : fmt(v, v > 10 ? 0 : 1)}
                </text>
              </g>
            );
          })}
          {rows.map((r, i) => {
            const y = i * 38 + 28;
            const v = values[i];
            const labelEl = (
              <>
                <text x={left - 10} y={y + 4} textAnchor="end" fill="#263e34" fontSize={(w < 390 ? 10 : 11) * k}>
                  {name(r.config)}
                </text>
                {r.shared && (
                  <text x={left - 10} y={y + 15} textAnchor="end" fill="#6d766b" fontSize={7 * k}>
                    {t('results.sharedShort')}
                  </text>
                )}
              </>
            );
            if (v === null) {
              return (
                <g key={r.config}>
                  {labelEl}
                  <text x={left + 8} y={y + 4} textAnchor="start" fill="#6d766b" fontSize={9 * k}>
                    {t('results.noCruise')}
                  </text>
                </g>
              );
            }
            const zero = X(0);
            const x = X(v);
            const tip = collision
              ? `${name(r.config)}: ${r.b.events} / 400, ${fmt(v * 100, 2)}%; 95% Wilson ${wilson(r.b.events)
                  .map((q) => fmt(q * 100, 2))
                  .join('–')}%`
              : `${name(r.config)}: ${v}`;
            const [lo, hi] = collision ? wilson(r.b.events) : [0, 0];
            const valueText = metric
              ? metricKey === 'cost' && Math.abs(v) < 0.005
                ? '≈0'
                : fmt(v, metricKey === 'entries' ? 2 : metricKey === 'impact_squared' ? 3 : 2)
              : `${r.b.events} · ${fmt(v * 100, 1)}%`;
            return (
              <g key={r.config}>
                <title>{tip}</title>
                {labelEl}
                <rect
                  x={Math.min(zero, x)}
                  y={y - 9}
                  width={Math.max(1, Math.abs(x - zero))}
                  height={18}
                  rx={2}
                  fill={color(r.config)}
                  opacity={0.92}
                />
                {collision && (
                  <>
                    <line x1={X(lo)} y1={y} x2={X(hi)} y2={y} stroke="#385346" strokeWidth="1" />
                    <line x1={X(hi)} y1={y - 4} x2={X(hi)} y2={y + 4} stroke="#385346" />
                  </>
                )}
                <text x={w - 4} y={y + 4} textAnchor="end" fill="#263e34" fontSize={10 * k}>
                  {valueText}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
