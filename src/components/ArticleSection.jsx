import { useI18n } from '../i18n';
import { useToast } from './Toast';
import SectionHead from './SectionHead';
import ArticleText from './ArticleText';
import { DATA } from '../lib/research';
import { download, toCsv } from '../lib/download';
import { asset } from '../lib/assets';

export default function ArticleSection() {
  const { t } = useI18n();
  const toast = useToast();

  const notify = (filename) => toast(t('toast.fileReady', { name: filename }));
  const exportAll = () => {
    const keys = [...new Set(DATA.summary.flatMap(Object.keys))];
    const filename = 'all_268_summary_cells_v6.csv';
    download(toCsv([keys, ...DATA.summary.map((r) => keys.map((k) => r[k] ?? ''))]), filename, 'text/csv;charset=utf-8');
    notify(filename);
  };

  return (
    <section className="reader-section" id="article">
      <div className="wrap section">
        <SectionHead ns="article" />
        <div className="download-row">
          <a
            className="primary"
            href={asset('downloads/Article_MT1_v6.pdf')}
            download="Article_MT1_v6.pdf"
            onClick={() => notify('Article_MT1_v6.pdf')}
          >
            {t('article.dlPdf')}
          </a>
          <a
            className="outline"
            href={asset('downloads/MT1_v6_Source_Package.zip')}
            download="MT1_v6_Source_Package.zip"
            onClick={() => notify('MT1_v6_Source_Package.zip')}
          >
            {t('article.dlZip')}
          </a>
          <button className="outline" id="all-data" onClick={exportAll}>
            {t('article.dlCsv')}
          </button>
        </div>
        <details className="article-reader">
          <summary>
            {t('article.readFull')} <span>+</span>
          </summary>
          <ArticleText />
        </details>
        <div className="limits">
          <h3>{t('article.limitsTitle')}</h3>
          <div>
            {t('article.limits').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="audit-note">{t('article.audit')}</div>
      </div>
    </section>
  );
}
