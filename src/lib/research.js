import summary from '../data/summary.json';
import refs from '../data/refs.json';
import strata from '../data/strata.json';

export const DATA = { summary, refs, strata };

export const PROFILES = ['P0', 'P1', 'P2', 'P3', 'P3R'];

const index = new Map(summary.map((x) => [[x.profile, x.scenario, x.config].join('|'), x]));
export const get = (p, sc, c) => index.get([p, sc, c].join('|'));

export function wilson(events, n = 400) {
  const z = 1.959963984540054;
  const p = events / n;
  const den = 1 + (z * z) / n;
  const mid = (p + (z * z) / (2 * n)) / den;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return [Math.max(0, mid - half), Math.min(1, mid + half)];
}

const confNames = { off: 'Off', remote7: 'Remote 7', local3: 'Local 3', local7: 'Local 7', local_fallback200: 'Switch 3' };
export function name(c) {
  if (c.startsWith('stop')) return 'Stop ' + c.match(/^stop(\d)/)[1];
  return confNames[c] || c;
}

const COLORS = {
  off: '#a5afa1',
  remote7: '#1a5147',
  local3: '#7186a3',
  local7: '#4c6d89',
  stop3: '#237868',
  stop4: '#c57445',
  stop7: '#8b8d53',
  local_fallback200: '#a48a6c',
};
export function color(c) {
  return COLORS[c.split('_')[0]] || COLORS[c] || '#237868';
}

export const GROUP_COLORS = ['#237868', '#c57445', '#7186a3', '#94815b'];

export function thresholdValues(profile) {
  const values = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 400];
  return values.filter((t) => get(profile, 'brake', `stop3_${t}`));
}

export function compareRows(profile, threshold) {
  const configs = [
    'off',
    `stop3_${threshold}`,
    `stop4_${threshold}`,
    `stop7_${threshold}`,
    ...(threshold === 200 ? ['local_fallback200'] : []),
    'local3',
    'local7',
    'remote7',
  ];
  return configs
    .map((config) => {
      let b = get(profile, 'brake', config);
      let c = get(profile, 'cruise', config);
      const shared = !b && config.startsWith('local') && profile === 'P3R';
      if (shared) {
        b = get('P0', 'brake', config);
        c = get('P0', 'cruise', config);
      }
      if (!b) return null;
      const base = get(profile, 'cruise', 'off');
      return { config, b, c, shared, cost: c ? base.distance_m - c.distance_m : null };
    })
    .filter(Boolean);
}

export function sweepPoints(sweepProfile) {
  const base = get(sweepProfile, 'cruise', 'off').distance_m;
  const a = summary
    .filter(
      (r) =>
        r.profile === sweepProfile &&
        r.scenario === 'brake' &&
        /^stop[347]_/.test(r.config) &&
        get(sweepProfile, 'cruise', r.config),
    )
    .map((r) => ({
      config: r.config,
      threshold: Number(r.config.split('_')[1]),
      events: r.events,
      rate: r.rate,
      cost: base - get(sweepProfile, 'cruise', r.config).distance_m,
    }));
  ['off', 'remote7', 'local3', 'local7'].forEach((c) => {
    const r = get(sweepProfile, 'brake', c);
    a.push({ config: c, threshold: null, events: r.events, rate: r.rate, cost: base - get(sweepProfile, 'cruise', c).distance_m });
  });
  return a;
}

// Initial layout of the literature map (hand-curated in the original)
export const INITIAL_POSITIONS = {
  1: [100, 120], 2: [195, 66], 3: [302, 150], 5: [104, 252], 18: [227, 278], 19: [375, 65],
  4: [615, 85], 6: [735, 155], 7: [623, 229], 8: [822, 266], 9: [768, 62], 10: [790, 370],
  11: [277, 435], 12: [384, 516], 13: [521, 505], 14: [636, 417], 15: [737, 512], 16: [461, 390],
  17: [163, 513], 20: [81, 398],
};
export const MAP_ROOT = { x: 450, y: 260 };
// Dotted thematic links from the centre to these sources
export const CENTER_LINKS = [3, 6, 15, 20];

export const audit = Object.freeze({
  mainRuns: summary.reduce((a, r) => a + r.n, 0),
  cells: summary.length,
  physicalCases: 400,
  references: refs.length,
});
