import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SKILLS_DATA } from '../constants';
import { Layers, Cpu, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MappedSkill {
  name: string;
  level: number;
  category: 'Design' | 'Tech' | 'Strategy';
  color: string;
  glow: string;
}

const SkillsChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  // State for rendering
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // Refs for Physics/Smoothing (LERP)
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Categorize and map data styles
  const mappedSkills: MappedSkill[] = useMemo(() => {
    return SKILLS_DATA.map((skill) => {
      let category: MappedSkill['category'] = 'Tech';
      let color = 'bg-blue-400';
      let glow = 'shadow-[0_0_15px_rgba(96,165,250,0.6)]';

      // Match categories based on English or Portuguese terms
      if (['Adobe', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere', 'Design', 'Visual'].some(k => skill.name.includes(k))) {
        category = 'Design';
        color = 'bg-pink-500';
        glow = 'shadow-[0_0_15px_rgba(236,72,153,0.6)]';
      } else if (['Leadership', 'Liderança', 'Instructional', 'Instrucional', 'Education', 'Educação', 'Branding'].some(k => skill.name.includes(k))) {
        category = 'Strategy';
        color = 'bg-purple-500';
        glow = 'shadow-[0_0_15px_rgba(168,85,247,0.6)]';
      } else {
        category = 'Tech'; // Default for AI, Code, Data
        color = 'bg-cyan-400';
        glow = 'shadow-[0_0_15px_rgba(34,211,238,0.6)]';
      }

      return { ...skill, category, color, glow };
    });
  }, []);

  // Distribute skills into orbits
  const orbits = useMemo(() => {
    const designSkills = mappedSkills.filter(s => s.category === 'Design');
    const techSkills = mappedSkills.filter(s => s.category === 'Tech');
    const strategySkills = mappedSkills.filter(s => s.category === 'Strategy');

    return [
      { id: 'inner', skills: designSkills, duration: '40s', radius: 100, direction: 'normal' },
      { id: 'middle', skills: techSkills, duration: '50s', radius: 170, direction: 'reverse' },
      { id: 'outer', skills: strategySkills, duration: '60s', radius: 240, direction: 'normal' },
    ];
  }, [mappedSkills]);

  // Animation Loop for Smooth Rotation
  useEffect(() => {
    const animate = () => {
      // Linear Interpolation (LERP): Move current towards target by a small factor (0.05 = 5% per frame)
      const easing = 0.05; 
      
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * easing;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * easing;

      setRotation({
        x: currentRotation.current.x,
        y: currentRotation.current.y
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Normalized coordinates (-1 to 1)
    const sensitivity = 40; 
    
    const x = (e.clientX - left - width / 2) / sensitivity;
    const y = (e.clientY - top - height / 2) / sensitivity;
    
    // Invert Y for natural "look" feel, Limit max rotation to avoid flipping
    targetRotation.current = { 
      x: Math.max(-15, Math.min(15, -y)), 
      y: Math.max(-15, Math.min(15, x)) 
    };
  };

  const handleMouseLeave = () => {
    // Slowly return to center
    targetRotation.current = { x: 0, y: 0 };
  };

  // Translations for Legend
  const legendLabels = {
    Design: language === 'en' ? 'Design' : 'Design',
    Tech: language === 'en' ? 'Tech' : 'Tecnologia',
    Strategy: language === 'en' ? 'Strategy' : 'Estratégia'
  };

  return (
    <div 
      className="w-full h-full min-h-[600px] relative flex items-center justify-center font-sans perspective-1000 overflow-hidden cursor-move"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Legend */}
      <div className="absolute top-0 right-0 md:top-6 md:right-6 z-30 flex flex-row md:flex-col gap-3 pointer-events-none w-full md:w-auto justify-center md:justify-start pt-4 md:pt-0">
        {[
          { id: 'Design', icon: Layers, color: 'text-pink-400', bg: 'bg-pink-500' },
          { id: 'Tech', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500' },
          { id: 'Strategy', icon: Compass, color: 'text-purple-400', bg: 'bg-purple-500' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-white/10 ${hoveredCategory && hoveredCategory !== cat.id ? 'opacity-30' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className={`w-2 h-2 rounded-full ${cat.bg} shadow-[0_0_8px] ${cat.color.replace('text', 'shadow')}`}></div>
            <span className={`text-xs font-bold uppercase tracking-widest ${cat.color}`}>
              {legendLabels[cat.id as keyof typeof legendLabels]}
            </span>
          </button>
        ))}
      </div>

      {/* 3D Container with Interpolated Rotation */}
      <div 
        className="relative w-full h-full flex items-center justify-center preserve-3d will-change-transform"
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        
        {/* Core Star */}
        <div className="absolute z-10 w-24 h-24 rounded-full bg-brand-dark border border-brand-accent/50 shadow-[0_0_80px_rgba(99,102,241,0.5)] flex items-center justify-center animate-pulse-slow preserve-3d">
           <div className="w-20 h-20 rounded-full bg-brand-accent/10 flex items-center justify-center backdrop-blur-sm border border-white/5">
              <Sparkles className="text-brand-accent animate-spin-slow" size={32} />
           </div>
           {/* Core Rings */}
           <div className="absolute w-[120%] h-[120%] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}></div>
           <div className="absolute w-[150%] h-[150%] border border-dashed border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Orbits */}
        {orbits.map((orbit) => (
          <div
            key={orbit.id}
            className={`absolute rounded-full border border-white/10 flex items-center justify-center preserve-3d transition-all duration-500
              ${hoveredCategory && !orbit.skills.some(s => s.category === hoveredCategory) ? 'opacity-5 blur-sm' : 'opacity-100'}
            `}
            style={{ 
              width: orbit.radius * 2, 
              height: orbit.radius * 2,
              animation: `spin ${orbit.duration} linear infinite ${orbit.direction}`,
              borderStyle: orbit.id === 'middle' ? 'dashed' : 'solid'
            }}
          >
            {/* Orbit Track Highlight on Hover */}
            <div className={`absolute inset-0 rounded-full border border-transparent transition-colors duration-500 ${hoveredCategory === orbit.skills[0]?.category ? 'border-white/20' : ''}`}></div>

            {/* Skills on Orbit */}
            {orbit.skills.map((skill, i) => {
              const total = orbit.skills.length;
              const angle = (360 / total) * i;
              
              return (
                <div
                  key={skill.name}
                  className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-6 flex items-center justify-center group/skill preserve-3d"
                  style={{
                    transformOrigin: `50% ${orbit.radius}px`,
                    transform: `rotate(${angle}deg)`, 
                  }}
                >
                  {/* Counter-rotate container to keep skill upright relative to viewport */}
                  <div 
                    className="relative cursor-pointer preserve-3d"
                    style={{ animation: `counter-spin ${orbit.duration} linear infinite ${orbit.direction === 'normal' ? 'reverse' : 'normal'}` }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                     {/* Planet Node */}
                     <div 
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${skill.color} ${skill.glow} transition-all duration-300 group-hover/skill:scale-[2.5] group-hover/skill:shadow-[0_0_25px_white] relative z-20`}
                     ></div>
                     
                     {/* Tooltip - Improved Visibility */}
                     <div 
                        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-4 py-2 bg-[#0a0a0a] border border-white/20 rounded-lg text-white text-xs whitespace-nowrap shadow-2xl transition-all duration-300 pointer-events-none z-50 flex flex-col items-center
                        ${hoveredSkill === skill.name ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}
                     >
                       <span className="font-bold text-sm tracking-wide">{skill.name}</span>
                       <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${skill.color}`} 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                       </div>
                       
                       {/* Triangle Arrow */}
                       <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/20"></div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default SkillsChart;