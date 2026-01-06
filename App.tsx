import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import CustomCursor from './components/CustomCursor';
import SEO from './components/SEO';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEasterEggs, displayConsoleArt } from './utils/useEasterEggs';

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
        <Router>
          <SEO />
          <ScrollToTop />
          <div className="bg-brand-dark min-h-screen text-white selection:bg-brand-accent selection:text-white flex flex-col">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>

            <CustomCursor />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;