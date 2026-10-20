import { useI18n } from '../i18n';

export default function StatStrip() {
  const { t, tr } = useI18n();
  return (
    <section className="stat-strip wrap" aria-label={t('stats.aria')}>
      <div>
        <strong>{t('stats.runsValue')}</strong>
        <span>{t('stats.runs')}</span>
      </div>
      <div>
        <strong>400</strong>
        <span>{t('stats.cases')}</span>
      </div>
      <div>
        <strong>5</strong>
        <span>{t('stats.profiles')}</span>
      </div>
      <div>
        <strong>20</strong>
        <span>{t('stats.sources')}</span>
      </div>
      <p>{tr('stats.note')}</p>
    </section>
  );
}
