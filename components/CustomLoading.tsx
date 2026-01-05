import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomLoadingProps {
    onLoadComplete?: () => void;
    duration?: number;
}

const funFacts = [
    "Pixel perfect designs are my obsession ✨",
    "Coffee + Code = Magic ☕",
    "Designing with passion since 2014 🎨",
    "Every project tells a unique story 📖",
    "Details make perfection 🔍",
];

const CustomLoading: React.FC<CustomLoadingProps> = ({
    onLoadComplete,
    duration = 2500
}) => {
    const [progress, setProgress] = useState(0);
    const [currentFact, setCurrentFact] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExiting(true);
                    setTimeout(() => {
                        onLoadComplete?.();
                    }, 800);
                    return 100;
                }
                return prev + (100 / (duration / 50));
            });
        }, 50);

        // Rotate fun facts
        const factInterval = setInterval(() => {
            setCurrentFact(prev => (prev + 1) % funFacts.length);
        }, 1500);

        return () => {
            clearInterval(interval);
            clearInterval(factInterval);
        };
    }, [duration, onLoadComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-brand-dark flex flex-col items-center justify-center"
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                    {/* Logo Animation */}
                    <motion.div
                        className="mb-12"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-gothic text-white"
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(99, 102, 241, 0.5)",
                                    "0 0 40px rgba(168, 85, 247, 0.5)",
                                    "0 0 20px rgba(99, 102, 241, 0.5)",
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Victor<span className="text-brand-accent">Duarte</span>
                        </motion.h1>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-80 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                        <motion.div
                            className="h-full bg-gradient-to-r from-brand-accent via-purple-500 to-pink-500"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>

                    {/* Percentage */}
                    <motion.div
                        className="text-white font-mono text-2xl mb-8"
                        key={progress.toFixed(0)}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {progress.toFixed(0)}%
                    </motion.div>

                    {/* Fun Facts */}
                    <div className="h-8">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentFact}
                                className="text-gray-400 text-sm italic text-center"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {funFacts[currentFact]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Floating Particles Background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-brand-accent/30 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CustomLoading;
