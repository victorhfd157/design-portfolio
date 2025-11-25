import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Toggle Scrolled State
      setIsScrolled(window.scrollY > 50);

      // Calculate Progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (targetId: string) => {
    setIsMobileMenuOpen(false);

    if (targetId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (targetId === 'about') {
      navigate('/about');
      return;
    }

    // For sections like #works or #contact
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  const navLinks = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.works, id: 'works' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.contact, id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3 shadow-lg' : 'bg-transparent py-8'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center relative z-20">
        {/* Logo with Gothic Font */}
        <button
          onClick={() => handleNavigation('home')}
          className="text-3xl font-gothic text-white hover:text-brand-accent transition-colors focus:outline-none"
        >
          Victor<span className="text-brand-accent"> Duarte</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.id)}
              className={`text-xs uppercase tracking-[0.2em] font-medium relative group transition-colors focus:outline-none ${(location.pathname === '/about' && link.id === 'about') || (location.pathname === '/' && link.id === 'home' && window.scrollY < 500)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-brand-accent transition-all duration-300 ${(location.pathname === '/about' && link.id === 'about') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
              ></span>
            </button>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white transition-colors border border-white/10 rounded-full hover:border-brand-accent"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full"
          >
            <Globe size={14} />
            <span className={language === 'en' ? 'text-brand-accent font-bold' : ''}>EN</span>
            <span className="opacity-30">|</span>
            <span className={language === 'pt' ? 'text-brand-accent font-bold' : ''}>PT</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded-full"
          >
            <span className={language === 'en' ? 'text-brand-accent' : ''}>EN</span>
            <span className="opacity-30">|</span>
            <span className={language === 'pt' ? 'text-brand-accent' : ''}>PT</span>
          </button>
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible only when scrolled) */}
      <div className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-brand-accent via-purple-500 to-brand-accent transition-all duration-100 ease-out opacity-0 ${isScrolled ? 'opacity-100' : ''}`} style={{ width: `${scrollProgress * 100}%` }}></div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-gray-800 bg-brand-dark/95 backdrop-blur-xl h-screen">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.id)}
                className="text-3xl font-serif italic text-gray-300 hover:text-white focus:outline-none"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;