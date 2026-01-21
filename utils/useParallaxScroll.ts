import { useEffect, useState, useRef } from 'react';

export const useParallaxScroll = (speed: number = 0.5) => {
    const [offset, setOffset] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const scrolled = window.scrollY;
            const elementTop = rect.top + scrolled;
            const windowHeight = window.innerHeight;

            // Only calculate parallax when element is in viewport
            if (scrolled + windowHeight > elementTop && scrolled < elementTop + rect.height) {
                const parallaxOffset = (scrolled - elementTop) * speed;
                setOffset(parallaxOffset);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { offset, ref: elementRef };
};

export const useScrollParallax = (multiplier: number = 0.5) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY * multiplier);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [multiplier]);

    return scrollY;
};
