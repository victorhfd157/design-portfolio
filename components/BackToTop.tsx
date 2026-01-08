import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 100vh
            setIsVisible(window.scrollY > window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-4 z-40 w-14 h-14 md:w-12 md:h-12 flex items-center justify-center bg-brand-accent hover:bg-brand-accent/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border border-white/10"
                    aria-label="Back to top"
                >
                    <ArrowUp size={24} className="md:w-5 md:h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
