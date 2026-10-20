import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useToast } from './Toast';
import { useA11y } from '../a11y/A11yContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SectionHead from './SectionHead';
import Segmented from './Segmented';
import { CENTER_LINKS, DATA, GROUP_COLORS, INITIAL_POSITIONS, MAP_ROOT } from '../lib/research';
import { download } from '../lib/download';
import paperMeta from '../data/meta.json';

const NS = 'http://www.w3.org/2000/svg';
const clampScale = (s) => Math.max(0.55, Math.min(3, s));

export default function Literature() {
  const { t, tr } = useI18n();
  const toast = useToast();
  const { settings } = useA11y();
  const mobile = useMediaQuery('(max-width: 599px)');

  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState('topics');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [root, setRoot] = useState(MAP_ROOT);
  const [view, setView] = useState(() => ({ scale: window.innerWidth < 600 ? 1.55 : 1, tx: 0, ty: 0 }));

  const svgRef = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const drag = useRef(null);
  const moved = useRef(false);

  // ----- filtering ---------------------------------------------------------------------------
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.refs.filter(
      (r) =>
        (group === 'all' || r.group === Number(group)) &&
        (!q || `${r.citation} ${t(`refs.${r.id}.short`)} ${t(`refs.${r.id}.role`)} ${r.id}`.toLowerCase().includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, group, t]);
  const filteredIds = useMemo(() => new Set(visible.map((r) => r.id)), [visible]);

  // ----- pan / zoom / drag -------------------------------------------------------------------
  const zoom = useCallback((f) => setView((v) => ({ ...v, scale: clampScale(v.scale * f) })), []);
  const screenPoint = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(svgRef.current.getScreenCTM().inverse());
  const localPoint = (p) => {
    const { tx, ty, scale } = viewRef.current;
    return { x: (p.x - tx - 450) / scale + 450, y: (p.y - ty - 300) / scale + 300 };
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 || !e.isPrimary) return;
    const p = screenPoint(e);
    const id = e.target.closest('[data-node]')?.dataset.node;
    moved.current = false;
    drag.current = { id: id === undefined ? null : Number(id), start: p, tx: view.tx, ty: view.ty };
    svgRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const p = screenPoint(e);
    const dx = p.x - d.start.x;
    const dy = p.y - d.start.y;
    if (Math.hypot(dx, dy) > 3) moved.current = true;
    if (!moved.current) return;
    if (d.id !== null) {
      const q = localPoint(p);
      if (d.id === 0) setRoot({ x: q.x, y: q.y });
      else setPositions((pos) => ({ ...pos, [d.id]: [q.x, q.y] }));
    } else {
      setView((v) => ({ ...v, tx: d.tx + dx, ty: d.ty + dy }));
    }
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (d && !moved.current && d.id !== null) select(d.id);
    if (svgRef.current.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    setTimeout(() => {
      moved.current = false;
    }, 0);
  };
  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    const move = { ArrowLeft: [25, 0], ArrowRight: [-25, 0], ArrowUp: [0, 25], ArrowDown: [0, -25] }[e.key];
    if (move) {
      e.preventDefault();
      setView((v) => ({ ...v, tx: v.tx + move[0], ty: v.ty + move[1] }));
    }
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoom(1.2);
    }
    if (e.key === '-') {
      e.preventDefault();
      zoom(0.8);
    }
  };

  // Ctrl/⌘ + wheel zooms the map (needs a non-passive listener to call preventDefault)
  useEffect(() => {
    const el = svgRef.current;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoom(e.deltaY < 0 ? 1.1 : 0.9);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom]);

  const select = useCallback((id) => setSelected(id), []);
  const nodeKeys = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(id);
    }
  };

  // ----- save as SVG -------------------------------------------------------------------------
  const saveSvg = () => {
    const clone = svgRef.current.cloneNode(true);
    clone.setAttribute('xmlns', NS);
    clone.setAttribute('width', '1200');
    clone.setAttribute('height', '800');
    clone.querySelector('#map-viewport').removeAttribute('transform');
    clone.setAttribute('viewBox', '-65 -5 1040 650');
    const style = document.createElementNS(NS, 'style');
    style.textContent =
      'text{font-family:Arial,sans-serif}.map-node text{pointer-events:none}.map-node.dim{opacity:.13}.map-node.selected circle{stroke:#153c31;stroke-width:3}';
    clone.prepend(style);
    const caption = document.createElementNS(NS, 'text');
    caption.setAttribute('x', '-45');
    caption.setAttribute('y', '625');
    caption.setAttribute('fill', '#53644c');
    caption.setAttribute('font-size', '11');
    caption.textContent = mode === 'topics' ? t('literature.svgCaptionTopics') : t('literature.svgCaptionCitations');
    clone.append(caption);
    const filename = `literature_map_${mode}.svg`;
    download(new XMLSerializer().serializeToString(clone), filename, 'image/svg+xml;charset=utf-8');
    toast(t('toast.fileReady', { name: filename }));
  };

  const goToSource = (id) => {
    select(id);
    const reduce = settings.motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('literature')?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
  };

  // ----- drawing -----------------------------------------------------------------------------
  const refById = (id) => DATA.refs.find((x) => x.id === id);

  const edges = [];
  if (mode === 'citations') {
    DATA.refs.forEach((r) => {
      const [x, y] = positions[r.id];
      const dx = x - root.x;
      const dy = y - root.y;
      const len = Math.hypot(dx, dy);
      const rr = r.id === 3 ? 24 : 20;
      edges.push(
        <line
          key={'e' + r.id}
          x1={root.x + (dx / len) * 42}
          y1={root.y + (dy / len) * 42}
          x2={x - (dx / len) * (rr + 5)}
          y2={y - (dy / len) * (rr + 5)}
          stroke="#6a8f7b"
          strokeWidth={selected === r.id ? 2.6 : 1}
          strokeOpacity={filteredIds.has(r.id) ? (selected === 0 || selected === r.id ? 0.65 : 0.16) : 0.04}
          markerEnd="url(#map-arrow)"
        />,
      );
    });
  } else {
    CENTER_LINKS.forEach((id) => {
      const r = refById(id);
      const [x, y] = positions[id];
      edges.push(
        <line
          key={'c' + id}
          x1={root.x}
          y1={root.y}
          x2={x}
          y2={y}
          stroke={GROUP_COLORS[r.group]}
          strokeDasharray="3 8"
          strokeOpacity={filteredIds.has(id) ? 0.3 : 0.04}
        />,
      );
    });
    for (let g = 0; g < 4; g++) {
      const refs = DATA.refs.filter((r) => r.group === g);
      for (let i = 0; i < refs.length - 1; i++) {
        const a = refs[i];
        const b = refs[i + 1];
        const [x1, y1] = positions[a.id];
        const [x2, y2] = positions[b.id];
        edges.push(
          <line
            key={`g${g}-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={GROUP_COLORS[g]}
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeOpacity={filteredIds.has(a.id) && filteredIds.has(b.id) ? 0.5 : 0.05}
          />,
        );
      }
      if (refs.length > 2) {
        const a = refs[0];
        const b = refs[refs.length - 1];
        const [x1, y1] = positions[a.id];
        const [x2, y2] = positions[b.id];
        edges.push(
          <line
            key={`g${g}-loop`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={GROUP_COLORS[g]}
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity={filteredIds.has(a.id) && filteredIds.has(b.id) ? 0.35 : 0.04}
          />,
        );
      }
    }
  }

  const { scale, tx, ty } = view;
  const sel = selected === 0 ? null : refById(selected);

  return (
    <section className="wrap section" id="literature">
      <SectionHead ns="literature" />
      <div className="map-toolbar">
        <label className="search-field">
          <span>⌕</span>
          <input
            id="paper-search"
            placeholder={t('literature.searchPlaceholder')}
            aria-label={t('literature.searchAria')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select id="group-filter" aria-label={t('literature.groupAria')} value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="all">{t('literature.allTopics')}</option>
          {t('literature.groups').map((g, i) => (
            <option key={i} value={i}>
              {g}
            </option>
          ))}
        </select>
        <Segmented
          id="map-mode"
          ariaLabel={t('literature.modeAria')}
          options={[
            { value: 'topics', label: t('literature.modeTopics') },
            { value: 'citations', label: t('literature.modeCitations') },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>
      <div className="map-workspace">
        <div className="map-canvas">
          <div className="map-controls">
            <button id="zoom-in" aria-label={t('literature.zoomIn')} onClick={() => zoom(1.25)}>
              +
            </button>
            <button id="zoom-out" aria-label={t('literature.zoomOut')} onClick={() => zoom(0.8)}>
              −
            </button>
            <button
              id="reset-map"
              aria-label={t('literature.reset')}
              onClick={() => setView({ scale: 1, tx: 0, ty: 0 })}
            >
              ⤢
            </button>
          </div>
          <svg
            id="literature-map"
            ref={svgRef}
            viewBox="0 0 900 600"
            role="img"
            aria-label={t('literature.mapAria')}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
            onKeyDown={onKeyDown}
          >
            <defs>
              <marker id="map-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0L6 3L0 6" fill="#6a8f7b" />
              </marker>
            </defs>
            <g id="map-viewport" transform={`translate(${tx} ${ty}) translate(450 300) scale(${scale}) translate(-450 -300)`}>
              <g id="map-edges">{edges}</g>
              <g id="map-nodes">
                {DATA.refs.map((r) => {
                  const [x, y] = positions[r.id];
                  const isVisible = filteredIds.has(r.id);
                  const radius = r.id === 3 || r.id === 5 || r.id === 15 ? 24 : 20;
                  const c = GROUP_COLORS[r.group];
                  const short = t(`refs.${r.id}.short`);
                  return (
                    <g
                      key={r.id}
                      transform={`translate(${x} ${y})`}
                      className={`map-node${selected === r.id ? ' selected' : ''}${!isVisible ? ' dim' : ''}`}
                      data-node={r.id}
                      tabIndex={isVisible ? 0 : -1}
                      role="button"
                      aria-label={t('literature.nodeAria', { id: r.id, short, year: r.year })}
                      onClick={() => {
                        if (!moved.current) select(r.id);
                      }}
                      onKeyDown={nodeKeys(r.id)}
                    >
                      <circle r={radius} fill={c} fillOpacity=".15" stroke={c} strokeWidth="1.4" />
                      <text x="0" y="4" textAnchor="middle" fontSize="12" fill={c} fontFamily="Consolas,monospace">
                        [{r.id}]
                      </text>
                      <text x="0" y={radius + 19} textAnchor="middle" fontSize={mobile ? 17 : 13} fill="#314d3b">
                        {short}
                      </text>
                      <text x="0" y={radius + 34} textAnchor="middle" fontSize={mobile ? 13 : 10} fill="#7d887a">
                        {r.year}
                      </text>
                      <title>{r.citation}</title>
                    </g>
                  );
                })}
                <g
                  transform={`translate(${root.x} ${root.y})`}
                  className={'map-node center' + (selected === 0 ? ' selected' : '')}
                  data-node="0"
                  tabIndex={0}
                  role="button"
                  aria-label={t('literature.centerAria')}
                  onClick={() => {
                    if (!moved.current) select(0);
                  }}
                  onKeyDown={nodeKeys(0)}
                >
                  <circle r="42" fill="#237868" stroke="#1b584b" strokeWidth="1.5" />
                  <text x="0" y="-2" textAnchor="middle" fontSize="12" fill="white">COMMAND</text>
                  <text x="0" y="14" textAnchor="middle" fontSize="12" fill="white">AGE</text>
                  <text x="0" y="65" textAnchor="middle" fontSize={mobile ? 14 : 11} fill="#237868">
                    {t('literature.centerLabel')}
                  </text>
                </g>
              </g>
            </g>
          </svg>
          <div className="map-hint">{t('literature.hint')}</div>
        </div>
        <aside id="paper-detail" aria-live="polite">
          {sel ? (
            <>
              <span className="paper-number">{t('literature.sourceKicker', { id: sel.id, year: sel.year })}</span>
              <h3>{t(`refs.${sel.id}.short`)}</h3>
              <p className="paper-citation">{sel.citation}</p>
              <p className="paper-role">{t(`refs.${sel.id}.role`)}</p>
              <a className="primary" href={sel.url} target="_blank" rel="noopener noreferrer">
                {t('literature.originalPub')}
              </a>
              <span className="mini-badge" style={{ color: GROUP_COLORS[sel.group] }}>
                {t('literature.groups')[sel.group]}
              </span>
              <p className="note">{t('literature.nodeNote')}</p>
            </>
          ) : (
            <>
              <span className="paper-number">{t('literature.centerKicker')}</span>
              <h3>{t('literature.centerTitle')}</h3>
              <p className="paper-citation">{paperMeta.title}</p>
              <p className="paper-role">{t('literature.centerRole')}</p>
              <a className="primary" href="#article">
                {t('literature.readArticle')}
              </a>
              <span className="mini-badge">{t('literature.confirmedRefs')}</span>
              <p className="note">{t('literature.centerNote')}</p>
            </>
          )}
        </aside>
      </div>
      <div className="map-footer">
        <div className="legend" id="map-legend">
          {t('literature.groupsShort').map((g, i) => (
            <span key={i}>
              <i style={{ background: GROUP_COLORS[i] }}></i>
              {g}
            </span>
          ))}
        </div>
        <button className="text-link" id="save-map" onClick={saveSvg}>
          {t('literature.saveSvg')}
        </button>
      </div>
      <p className="note map-disclaimer">{tr('literature.disclaimer')}</p>
      <div className="source-toolbar">
        <h3>
          {t('literature.bibliography')} <span id="source-count">{visible.length}</span>
        </h3>
        <button
          id="clear-search"
          className="text-link"
          onClick={() => {
            setQuery('');
            setGroup('all');
          }}
        >
          {t('literature.clearFilters')}
        </button>
      </div>
      <div id="source-list" className="source-list">
        {visible.length ? (
          visible.map((r) => (
            <div key={r.id} className={`source-item${selected === r.id ? ' selected' : ''}`} data-ref={r.id}>
              <span>[{r.id}]</span>
              <button aria-label={t('literature.showOnMap', { id: r.id })} onClick={() => goToSource(r.id)}>
                <strong>{t(`refs.${r.id}.short`)}</strong>
                <small>{r.citation}</small>
              </button>
              <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={t('literature.openOriginal', { id: r.id })}>
                ↗
              </a>
            </div>
          ))
        ) : (
          <p className="no-results">{t('literature.noResults')}</p>
        )}
      </div>
    </section>
  );
}
