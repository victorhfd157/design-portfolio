import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScrollProgress: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrolled = (scrollPx / winHeightPx) * 100;

            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent via-purple-500 to-pink-500 z-[200] origin-left"
            style={{ scaleX: scrollProgress / 100 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
        />
    );
};

export default ScrollProgress;
