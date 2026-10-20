import { useI18n } from '../i18n';

export default function Hero() {
  const { t, tr } = useI18n();
  return (
    <section className="hero wrap" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="live-dot"></span> {t('hero.eyebrow')}
        </div>
        <h1>{tr('hero.title')}</h1>
        <p className="hero-lead">{t('hero.lead')}</p>
        <div className="hero-actions">
          <a className="primary" href="#results">
            {t('hero.explore')} <span>↘</span>
          </a>
          <a className="text-link" href="#literature">
            {t('hero.openMap')} ↗
          </a>
        </div>
        <div className="byline">
          <strong>Zhakiyan Baktiyaruly · Damirlan Zhetpissov</strong>
          <span>{t('hero.affiliation')}</span>
        </div>
      </div>
      <div className="hero-art" aria-label={t('hero.artAria')}>
        <div className="art-caption">
          <span>STATE → NETWORK → ACTION</span>
          <span>01 / CONCEPT</span>
        </div>
        <svg viewBox="0 0 560 480" role="img" aria-label={t('hero.svgAria')}>
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="#d9dfd7" strokeWidth=".6" />
            </pattern>
            <marker id="heroArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0 0L6 3L0 6" fill="#237868" />
            </marker>
          </defs>
          <rect width="560" height="480" fill="url(#grid)" />
          <circle cx="280" cy="229" r="168" fill="none" stroke="#adc4b6" strokeDasharray="4 8" />
          <circle cx="280" cy="229" r="125" fill="none" stroke="#c5d4c7" />
          <path d="M112 344V115H282" fill="none" stroke="#237868" strokeWidth="2" markerEnd="url(#heroArrow)" />
          <path d="M370 137V344H285" fill="none" stroke="#ba6f43" strokeWidth="2" strokeDasharray="7 6" />
          <g transform="translate(233 75)">
            <rect width="163" height="78" rx="12" fill="#fcfcf6" stroke="#237868" />
            <rect x="16" y="17" width="24" height="8" rx="2" fill="#237868" />
            <rect x="16" y="32" width="24" height="8" rx="2" fill="#b6cfbf" />
            <text x="57" y="31" fontSize="14" fill="#183e35">REMOTE</text>
            <text x="57" y="52" fontSize="12" fill="#6a7a70">{t('hero.controller')}</text>
          </g>
          <g transform="translate(190 212)">
            <rect width="182" height="80" rx="40" fill="#f5f4ee" stroke="#c7d2c7" />
            <text x="91" y="30" textAnchor="middle" fill="#6a7a70" fontSize="12">{t('hero.commandAge')}</text>
            <text x="91" y="59" textAnchor="middle" fill="#1c4c40" fontSize="27" fontFamily="monospace">A(t) &gt; τ ?</text>
          </g>
          <path d="M62 378H494" stroke="#bcc9bd" strokeWidth="44" />
          <path d="M62 378H494" stroke="#f8faf3" strokeWidth="2" strokeDasharray="18 16" />
          <g transform="translate(94 324)">
            <rect width="145" height="48" rx="15" fill="#237868" />
            <path d="M30 0L43-19H95L113 0" fill="#398775" />
            <path d="M51-14H87L98-1H41Z" fill="#dae8d8" />
            <circle cx="33" cy="47" r="11" fill="#173b32" />
            <circle cx="113" cy="47" r="11" fill="#173b32" />
          </g>
          <g transform="translate(388 304)">
            <rect width="111" height="51" rx="10" fill="#f7eedc" stroke="#ba6f43" />
            <text x="55" y="22" textAnchor="middle" fontSize="11" fill="#8a5132">LOCAL BACKUP</text>
            <text x="55" y="39" textAnchor="middle" fontSize="10" fill="#8a5132">{t('hero.onboard')}</text>
          </g>
          <text x="65" y="440" fontSize="12" fill="#6a7a70">{t('hero.delivered')}</text>
        </svg>
        <div className="art-bottom">
          <span className="dot teal"></span> {t('hero.legendRemote')} <span className="dot orange"></span> {t('hero.legendLocal')}
        </div>
      </div>
    </section>
  );
}
