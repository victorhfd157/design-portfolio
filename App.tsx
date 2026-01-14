import React, { useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ScrollProgress from './components/ScrollProgress';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import SEO from './components/SEO';
import OnboardingModal from './components/OnboardingModal';

import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { useEasterEggs, displayConsoleArt } from './utils/useEasterEggs';
import Layout from './components/Layout';
// Lazy load the game to avoid bundle bloating
const DefendersGame = React.lazy(() => import('./components/games/defenders/DefendersGame'));
const LinguaQuestGame = React.lazy(() => import('./components/games/linguaquest/LinguaQuestGame'));

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const { handleSecretClick } = useEasterEggs();

  useEffect(() => {
    displayConsoleArt();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <SEO />
            <ScrollToTop />
            <ScrollProgress />
            <OnboardingModal />
            <Layout>
              <Suspense fallback={
                <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white font-mono">
                  LOADING ASSETS...
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/game/defenders" element={<DefendersGame />} />
                  <Route path="/game/linguaquest" element={<LinguaQuestGame />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;