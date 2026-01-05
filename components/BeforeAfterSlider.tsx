import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After',
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none group"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* After Image (Full) */}
            <div className="absolute inset-0">
                <img
                    src={afterImage}
                    alt={afterLabel}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                {/* After Label */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-brand-accent/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    {afterLabel}
                </div>
            </div>

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt={beforeLabel}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                {/* Before Label */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-col-resize z-10"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="flex gap-1">
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                    </div>
                </div>

                {/* Arrows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
                    <motion.div
                        className="text-white text-2xl font-bold pointer-events-none"
                        animate={{ x: [-5, 0, -5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        ←
                    </motion.div>
                    <motion.div
                        className="text-white text-2xl font-bold pointer-events-none"
                        animate={{ x: [5, 0, 5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.div>
                </div>
            </div>

            {/* Instruction Text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Drag to compare
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
