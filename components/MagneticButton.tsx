import React, { useRef, useEffect, useState } from 'react';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    strength = 0.3
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;

            // Calculate distance from center
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            const maxDistance = 100; // Magnetic field radius

            if (distance < maxDistance) {
                const pullStrength = (1 - distance / maxDistance) * strength;
                setPosition({
                    x: distanceX * pullStrength,
                    y: distanceY * pullStrength,
                });
                setIsHovering(true);
            } else {
                setPosition({ x: 0, y: 0 });
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => {
            setPosition({ x: 0, y: 0 });
            setIsHovering(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return (
        <button
            ref={buttonRef}
            className={className}
            onClick={onClick}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
            }}
        >
            {children}
        </button>
    );
};

export default MagneticButton;
