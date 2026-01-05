import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type CursorState = 'default' | 'pointer' | 'view' | 'drag';

const CustomCursor: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorState, setCursorState] = useState<CursorState>('default');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        // Detect what element is being hovered
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
                setCursorState('pointer');
            } else if (target.closest('[data-cursor="view"]') || target.closest('.project-card')) {
                setCursorState('view');
            } else if (target.closest('[data-cursor="drag"]')) {
                setCursorState('drag');
            } else {
                setCursorState('default');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Hide on mobile/touch devices
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice || !isVisible) {
        return null;
    }

    const cursorVariants = {
        default: {
            scale: 1,
            opacity: 1,
        },
        pointer: {
            scale: 1.5,
            opacity: 0.8,
        },
        view: {
            scale: 2,
            opacity: 0.6,
        },
        drag: {
            scale: 0.8,
            opacity: 1,
        },
    };

    return (
        <>
            {/* Outer cursor - follows with delay */}
            <motion.div
                className="pointer-events-none fixed z-[9999] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5,
                }}
            >
                <motion.div
                    className="w-10 h-10 border-2 border-white rounded-full"
                    variants={cursorVariants}
                    animate={cursorState}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 400,
                    }}
                >
                    {cursorState === 'view' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            VIEW
                        </motion.div>
                    )}
                    {cursorState === 'drag' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            DRAG
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            {/* Inner cursor - fast dot */}
            <motion.div
                className="pointer-events-none fixed z-[9999] w-1 h-1 bg-white rounded-full mix-blend-difference"
                animate={{
                    x: mousePosition.x - 2,
                    y: mousePosition.y - 2,
                }}
                transition={{
                    type: 'spring',
                    damping: 50,
                    stiffness: 1000,
                    mass: 0.1,
                }}
            />
        </>
    );
};

export default CustomCursor;
