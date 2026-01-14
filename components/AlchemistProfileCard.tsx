
import React, { useRef, useState } from "react";
import { Linkedin, Mail, Zap } from 'lucide-react';

const AlchemistProfileCard: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (reduced to 4deg for softer effect)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4; // Reduced from -10
        const rotateY = ((x - centerX) / centerX) * 4;   // Reduced from 10

        setRotation({ x: rotateX, y: rotateY });
        setGlowPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 }); // Reset rotation
    };

    return (
        <div
            className="relative w-full aspect-[3/4] perspective-1000"
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                className="w-full h-full relative rounded-[20px] transition-all duration-300 ease-out preserve-3d group"
                style={{
                    transform: isHovering
                        ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.01)`
                        : 'rotateX(0deg) rotateY(0deg) scale(1)',
                    boxShadow: isHovering
                        ? '0 15px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99, 102, 241, 0.2)'
                        : '0 10px 30px rgba(0,0,0,0.3)',
                }}
            >
                {/* Animated Border Gradient */}
                <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-r from-brand-accent via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>

                {/* Main Card Content */}
                <div className="absolute inset-0 bg-[#1a1a1a] rounded-[20px] overflow-hidden border border-white/10">

                    {/* Background Image/Texture */}
                    <div className="absolute inset-0">
                        <img
                            src="/avatar.jpg"
                            alt="Digital Alchemist"
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
                    </div>

                    {/* Holographic Sheen/Glow Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(circle at ${glowPosition.x}px ${glowPosition.y}px, rgba(255,255,255,0.4) 0%, transparent 60%)`
                        }}
                    />

                    {/* Card Content Elements - Lifted off surface */}
                    <div className="absolute bottom-0 left-0 w-full p-6 transform translate-z-20 transition-transform duration-300 group-hover:translate-z-[50px]">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 backdrop-blur-md mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                            <Zap size={14} className="text-brand-accent" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent text-shadow-glow">Level 99 Alchemist</span>
                        </div>

                        <h3 className="text-3xl font-serif font-bold text-white mb-1 drop-shadow-lg">Victor Duarte</h3>
                        <p className="text-sm text-gray-300 font-light mb-4">Creative Developer & Designer</p>

                        {/* Social Row */}
                        <div className="flex gap-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                            <a href="https://www.linkedin.com/in/victorhfduarte/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all border border-white/5 backdrop-blur-sm">
                                <Linkedin size={18} className="text-white" />
                            </a>
                            <a href="mailto:victorhfduarte@gmail.com" className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all border border-white/5 backdrop-blur-sm">
                                <Mail size={18} className="text-white" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AlchemistProfileCard;
