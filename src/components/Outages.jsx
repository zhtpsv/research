import { useState } from 'react';
import { useI18n } from '../i18n';
import SectionHead from './SectionHead';
import Segmented from './Segmented';
import StrataChart from './charts/StrataChart';

export default function Outages() {
  const { t, tr } = useI18n();
  const [mode, setMode] = useState('rate');
  return (
    <section className="outage-section" id="outages">
      <div className="wrap section">
        <SectionHead ns="outages" />
        <div className="exposure-band">
          <div className="exposure-number">
            <b>
              186<span>/ 400</span>
            </b>
            <p>{tr('outages.exposureText')}</p>
          </div>
          <div>
            <div className="exposure-bar">
              <span style={{ width: '46.5%' }}>{t('outages.overlapShare')}</span>
              <span>{t('outages.noOverlapShare')}</span>
            </div>
            <div className="range-ends">
              <span>{t('outages.withOverlap')}</span>
              <span>{t('outages.withoutOverlap')}</span>
            </div>
            <p className="note">{t('outages.exposureNote')}</p>
          </div>
        </div>
        <div className="toolbar">
          <h3>{t('outages.inGroups')}</h3>
          <Segmented
            id="strata-mode"
            ariaLabel={t('outages.modeAria')}
            options={[
              { value: 'rate', label: t('outages.modeRate') },
              { value: 'count', label: t('outages.modeCount') },
            ]}
            value={mode}
            onChange={setMode}
          />
        </div>
        <div className="legend">
          <span><i style={{ background: '#237868' }}></i>{t('outages.legendOverlap')}</span>
          <span><i style={{ background: '#c57445' }}></i>{t('outages.legendNoOverlap')}</span>
        </div>
        <StrataChart mode={mode} />
        <div className="interpretation-grid">
          <div>
            <span className="micro">{t('outages.equalForce')}</span>
            <strong>51 + 2 = 53</strong>
            <p>{t('outages.equalForceText')}</p>
          </div>
          <div>
            <span className="micro">{t('outages.strongBackup')}</span>
            <strong>81 + 16 = 97</strong>
            <p>{t('outages.strongBackupText')}</p>
          </div>
        </div>
        <p className="note">{t('outages.note')}</p>
      </div>
    </section>
  );
}
