import React, { useState, useEffect, useRef } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speedX: number;
    speedY: number;
    delay: number;
}

interface GoldenParticlesProps {
    count?: number;
}

const GoldenParticles: React.FC<GoldenParticlesProps> = ({ count = 60 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [particles, setParticles] = useState<Particle[]>([]);

    // Generate particles on mount
    useEffect(() => {
        const generated: Particle[] = [];
        for (let i = 0; i < count; i++) {
            generated.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                delay: Math.random() * 5,
            });
        }
        setParticles(generated);
    }, [count]);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => {
                // Calculate offset based on mouse position (particles move away from cursor)
                const distX = (mousePos.x - particle.x / 100) * 30;
                const distY = (mousePos.y - particle.y / 100) * 30;

                return (
                    <div
                        key={particle.id}
                        className="absolute rounded-full transition-transform duration-1000 ease-out"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            opacity: particle.opacity,
                            background: `radial-gradient(circle, rgba(255, 215, 100, 1) 0%, rgba(255, 180, 50, 0.5) 50%, transparent 100%)`,
                            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 200, 80, 0.6)`,
                            transform: `translate(${-distX}px, ${-distY}px)`,
                            animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${particle.delay}s`,
                        }}
                    />
                );
            })}

            {/* CSS Keyframes */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    );
};

export default GoldenParticles;
