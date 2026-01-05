import React, { useRef, useEffect } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    connections: number[];
}

interface ParticleBackgroundProps {
    particleCount?: number;
    color?: string;
    connectionDistance?: number;
    mouseInteraction?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    particleCount = 80,
    color = '99, 102, 241', // RGB for brand-accent
    connectionDistance = 150,
    mouseInteraction = true,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles
        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.3,
                    connections: [],
                });
            }
        };
        initParticles();

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        if (mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Keep within bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));

                // Mouse interaction - attract particles
                if (mouseInteraction) {
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const force = (150 - distance) / 150;
                        particle.vx += (dx / distance) * force * 0.1;
                        particle.vy += (dy / distance) * force * 0.1;
                    }
                }

                // Apply slight friction
                particle.vx *= 0.98;
                particle.vy *= 0.98;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
                ctx.fill();

                // Draw connections to nearby particles
                particles.forEach((otherParticle, j) => {
                    if (i >= j) return; // Avoid duplicate lines

                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });

                // Connect to mouse if close
                if (mouseInteraction) {
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (mouseInteraction) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [particleCount, color, connectionDistance, mouseInteraction]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
};

export default ParticleBackground;
