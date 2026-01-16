import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AlchemyOrb: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Outer Glow Rings */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                    boxShadow: isHovered
                        ? [
                            '0 0 60px 20px rgba(168, 85, 247, 0.3)',
                            '0 0 80px 30px rgba(99, 102, 241, 0.3)',
                            '0 0 60px 20px rgba(168, 85, 247, 0.3)',
                        ]
                        : [
                            '0 0 60px 20px rgba(255, 200, 80, 0.2)',
                            '0 0 80px 30px rgba(255, 180, 50, 0.2)',
                            '0 0 60px 20px rgba(255, 200, 80, 0.2)',
                        ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Middle Ring */}
            <motion.div
                className="absolute inset-4 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(255, 200, 80, 0.1), transparent)',
                }}
            />

            {/* Inner Orb */}
            <motion.div
                className="absolute inset-8 rounded-full overflow-hidden"
                animate={{
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
                style={{
                    background: isHovered
                        ? 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.8), rgba(99, 102, 241, 0.4), rgba(30, 30, 40, 0.8))'
                        : 'radial-gradient(circle at 30% 30%, rgba(255, 220, 120, 0.8), rgba(255, 180, 50, 0.4), rgba(30, 30, 40, 0.8))',
                    boxShadow: isHovered
                        ? 'inset 0 0 60px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
                        : 'inset 0 0 60px rgba(255, 200, 80, 0.5), 0 0 40px rgba(255, 200, 80, 0.3)',
                }}
            >
                {/* Shimmer Effect */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                            'linear-gradient(135deg, transparent 60%, rgba(255,255,255,0.1) 70%, transparent 80%)',
                            'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                        ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Core Glow */}
            <motion.div
                className="absolute inset-16 rounded-full"
                animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    background: isHovered
                        ? 'radial-gradient(circle, rgba(200, 150, 255, 0.8) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(255, 230, 150, 0.8) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                }}
            />

            {/* Floating Symbols (Alchemical) */}
            {['◇', '△', '○', '☿'].map((symbol, index) => (
                <motion.div
                    key={index}
                    className="absolute text-xl text-white/20 font-serif"
                    style={{
                        top: `${20 + index * 20}%`,
                        left: `${10 + index * 25}%`,
                    }}
                    animate={{
                        y: [0, -10, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 4 + index,
                        repeat: Infinity,
                        delay: index * 0.5,
                    }}
                >
                    {symbol}
                </motion.div>
            ))}
        </div>
    );
};

export default AlchemyOrb;
