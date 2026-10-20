import { I18nProvider, useI18n } from './i18n';
import { A11yProvider } from './a11y/A11yContext';
import A11yPanel from './a11y/A11yPanel';
import ReadingGuide from './a11y/ReadingGuide';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import Hero from './components/Hero';
import StatStrip from './components/StatStrip';
import Mechanism from './components/Mechanism';
import Results from './components/Results';
import Tradeoff from './components/Tradeoff';
import Outages from './components/Outages';
import Literature from './components/Literature';
import ArticleSection from './components/ArticleSection';
import Footer from './components/Footer';

function Site() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip" href="#main">
        {t('skip')}
      </a>
      {/* `.site` is what the dark/grayscale accessibility filters are applied to */}
      <div className="site">
        <Header />
        <main id="main">
          <Hero />
          <StatStrip />
          <Mechanism />
          <Results />
          <Tradeoff />
          <Outages />
          <Literature />
          <ArticleSection />
        </main>
        <Footer />
      </div>
      <A11yPanel />
      <ReadingGuide />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <A11yProvider>
        <ToastProvider>
          <Site />
        </ToastProvider>
      </A11yProvider>
    </I18nProvider>
  );
}
