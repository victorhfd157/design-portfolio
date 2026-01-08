import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Toggle Scrolled State
      setIsScrolled(currentScrollY > 50);

      // Scroll Direction Detection (hide navbar when scrolling down, show when scrolling up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up or at top
      }
      setLastScrollY(currentScrollY);

      // Calculate Scroll Progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));

      // Active Section Detection (only on home page)
      if (location.pathname === '/') {
        const sections = ['home', 'works', 'about', 'contact'];
        const offsets = sections.map(id => {
          const element = document.getElementById(id);
          return element ? { id, offset: element.offsetTop - 200 } : { id, offset: 0 };
        });

        for (let i = offsets.length - 1; i >= 0; i--) {
          if (currentScrollY >= offsets[i].offset) {
            setActiveSection(offsets[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, location.pathname]);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-panel py-3 shadow-lg' : 'bg-transparent py-8'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      style={{ transition: 'transform 0.3s ease-in-out, background-color 0.3s, padding 0.3s' }}
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
          {navLinks.map((link) => {
            const isActive = location.pathname === '/about' && link.id === 'about'
              || location.pathname === '/' && activeSection === link.id;

            return (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.id)}
                className={`text-xs uppercase tracking-[0.2em] font-medium relative group transition-colors focus:outline-none ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                ></span>
              </button>
            );
          })}

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

        {/* Mobile Toggle - Hidden as we use Bottom Nav now */}
        <div className="hidden md:hidden">
          {/* Kept hidden structure to avoid breaking layout if needed, or just remove */}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-100 ease-out ${isScrolled ? 'opacity-100' : 'opacity-0'
        }`}>
        <div
          className="h-full bg-gradient-to-r from-brand-accent via-purple-500 to-pink-500 transition-all duration-100 ease-out relative"
          style={{ width: `${scrollProgress * 100}%` }}
        >
          {/* Glowing dot at the end */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></div>
        </div>
      </div>

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