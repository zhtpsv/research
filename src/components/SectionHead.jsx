import { useI18n } from '../i18n';

/** The recurring "eyebrow + h2 + lead paragraph" header of every section. */
export default function SectionHead({ ns }) {
  const { t, tr } = useI18n();
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{t(`${ns}.eyebrow`)}</span>
        <h2>{tr(`${ns}.title`)}</h2>
      </div>
      <p>{t(`${ns}.lead`)}</p>
    </div>
  );
}
