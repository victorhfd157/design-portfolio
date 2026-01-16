import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { MoveRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import GoldenParticles from './GoldenParticles';
import AlchemyOrb from './AlchemyOrb';
import MagneticButton from './MagneticButton';

// Split Text Animation Component
const SplitText: React.FC<{ text: string; className?: string; delay?: number }> = ({
    text,
    className = '',
    delay = 0
}) => {
    return (
        <span className={className}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: delay + index * 0.03,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};

// Alchemical Counter Component
const AlchemyCounter: React.FC<{
    symbol: string;
    value: number;
    label: string;
    color: string;
}> = ({ symbol, value, label, color }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!ref.current || !inView) return;

        const controls = animate(0, value, {
            duration: 2,
            ease: 'easeOut',
            onUpdate(val) {
                if (ref.current) {
                    ref.current.textContent = Math.floor(val).toString();
                }
            },
        });

        return () => controls.stop();
    }, [value, inView]);

    return (
        <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
        >
            <div className="flex items-baseline gap-0.5">
                <span className={`text-lg font-serif italic ${color}`}>{symbol}</span>
                <span ref={ref} className="text-3xl md:text-4xl font-black text-white">0</span>
                <span className={`text-sm font-bold ${color}`}>⁺</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{label}</span>
        </motion.div>
    );
};

const HeroLab: React.FC = () => {
    const { t } = useLanguage();
    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll for flask fill effect
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxScroll = window.innerHeight * 0.5;
            setScrollProgress(Math.min(scrolled / maxScroll, 1));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f12 100%)' }}
        >
            {/* Background Layers */}
            <div className="absolute inset-0">
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,200,80,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,200,80,0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Radial Gradient from Center-Right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 80% at 70% 50%, rgba(255, 180, 50, 0.08) 0%, transparent 60%)',
                    }}
                />

                {/* Golden Particles */}
                <GoldenParticles count={70} />

                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

                    {/* Left Column: Text Content */}
                    <div className="flex flex-col justify-center order-2 lg:order-1">

                        {/* Badge */}
                        <motion.div
                            className="flex mb-8"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-amber-300/80 tracking-wider uppercase">
                                    {t.hero.badge}
                                </span>
                                <Sparkles size={12} className="text-amber-400" />
                            </div>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
                            <SplitText
                                text={t.hero.headline_1}
                                className="block font-black tracking-tighter text-white"
                                delay={0.3}
                            />
                            <SplitText
                                text={t.hero.headline_2}
                                className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"
                                delay={0.6}
                            />
                        </h1>

                        {/* Subheadline */}
                        <motion.p
                            className="text-base md:text-lg text-gray-400 max-w-md leading-relaxed mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                        >
                            {t.hero.subhead}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            className="flex flex-wrap gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                        >
                            <MagneticButton
                                onClick={() => scrollToSection('works')}
                                className="group relative px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm overflow-hidden"
                                strength={0.3}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative flex items-center gap-2 text-black group-hover:text-white transition-colors">
                                    {t.hero.cta_primary}
                                    <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </MagneticButton>

                            <MagneticButton
                                onClick={() => scrollToSection('contact')}
                                className="px-8 py-4 rounded-full border border-white/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                                strength={0.2}
                            >
                                <span className="font-serif italic text-gray-300 hover:text-amber-300 transition-colors">
                                    {t.hero.cta_secondary}
                                </span>
                            </MagneticButton>
                        </motion.div>

                        {/* Alchemical Stats */}
                        <div className="flex gap-8 md:gap-12">
                            <AlchemyCounter symbol="Xp" value={10} label="Years" color="text-amber-400" />
                            <AlchemyCounter symbol="Pr" value={50} label="Projects" color="text-purple-400" />
                            <AlchemyCounter symbol="St" value={300} label="Students" color="text-cyan-400" />
                        </div>
                    </div>

                    {/* Right Column: Orb */}
                    <motion.div
                        className="hidden lg:flex items-center justify-center order-1 lg:order-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    >
                        <AlchemyOrb />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator (Flask) */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                {/* Flask SVG */}
                <div className="relative w-6 h-10">
                    <svg viewBox="0 0 24 40" fill="none" className="w-full h-full">
                        {/* Flask Outline */}
                        <path
                            d="M8 4V14L2 28C1 30 2 32 4 32H20C22 32 23 30 22 28L16 14V4"
                            stroke="rgba(255, 200, 80, 0.4)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        {/* Flask Top */}
                        <rect x="7" y="2" width="10" height="3" rx="1" stroke="rgba(255, 200, 80, 0.4)" strokeWidth="1.5" fill="none" />
                        {/* Liquid Fill */}
                        <motion.path
                            d="M4 28L8 18V14H16V18L20 28C20.5 29 20 30 19 30H5C4 30 3.5 29 4 28Z"
                            fill="url(#liquidGradient)"
                            initial={{ clipPath: 'inset(100% 0 0 0)' }}
                            animate={{ clipPath: `inset(${100 - scrollProgress * 100}% 0 0 0)` }}
                            transition={{ duration: 0.1 }}
                        />
                        <defs>
                            <linearGradient id="liquidGradient" x1="12" y1="14" x2="12" y2="30" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="rgba(255, 200, 80, 0.8)" />
                                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Scroll to Transmute
                </span>
            </motion.div>
        </section>
    );
};

export default HeroLab;
