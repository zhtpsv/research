import { useI18n } from '../i18n';

export default function Footer() {
  const { t, tr } = useI18n();
  return (
    <footer className="wrap footer">
      <div>
        <a className="brand" href="#top">
          <span className="brand-mark">
            a<span>↗</span>
          </span>
          <span>
            RESEARCH
            <br />
            <b>ATLAS</b>
          </span>
        </a>
        <p>{tr('footer.subtitle')}</p>
      </div>
      <div>
        <span>ZHAKIYAN BAKTIYARULY · DAMIRLAN ZHETPISSOV</span>
        <p>{t('footer.org')}</p>
        <small>{tr('footer.note')}</small>
      </div>
    </footer>
  );
}
