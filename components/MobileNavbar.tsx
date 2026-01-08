import React, { useState, useEffect } from 'react';
import { Home, Grid, User, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const MobileNavbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleNavigation = (targetId: string) => {
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

        // specific sections
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'home', icon: Home, label: t.nav.home },
        { id: 'works', icon: Grid, label: t.nav.works },
        { id: 'about', icon: User, label: t.nav.about },
        { id: 'contact', icon: Mail, label: t.nav.contact },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-4 right-4 z-50 md:hidden"
                >
                    <nav className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex justify-between items-center">
                        {navItems.map((item) => {
                            const isActive =
                                (item.id === 'home' && location.pathname === '/' && window.scrollY < 500) ||
                                (item.id === 'about' && location.pathname === '/about') ||
                                (item.id === 'works' && location.pathname === '/' && window.scrollY > 500 && window.scrollY < 2000) ||
                                (item.id === 'contact' && location.pathname === '/' && window.scrollY > 2000); // Rough estimate for scroll spy

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`flex flex-col items-center gap-1 transition-all duration-300 relative group ${isActive ? 'text-brand-accent' : 'text-gray-400'}`}
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-accent/20' : 'bg-transparent group-hover:bg-white/5'}`}>
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    {isActive && (
                                        <motion.span
                                            layoutId="navIndicator"
                                            className="absolute -bottom-2 w-1 h-1 bg-brand-accent rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileNavbar;
