import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight, Play, Presentation } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 50, y: 50 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate 3D tilt based on mouse position
  const tiltX = isHovering ? (mousePosition.y - 50) * 0.15 : 0;
  const tiltY = isHovering ? (mousePosition.x - 50) * -0.15 : 0;

  return (
    <motion.div
      ref={cardRef}
      data-cursor="view"
      className="project-card group relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2rem] cursor-pointer bg-[#0a0a0a] border border-white/5 transition-all duration-700"
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-white/10 to-transparent group-hover:from-brand-accent/50 group-hover:to-purple-500/50 transition-colors duration-700 -z-10" />

      {/* Animated Glow Effect */}
      <div
        className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.4), transparent 50%)`,
        }}
      />

      {/* Spotlight Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1), transparent)`,
        }}
      />

      {/* Image Container with Zoom Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-[calc(2rem-1px)]">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1 filter grayscale-[20%] contrast-[1.1] group-hover:grayscale-0"
        />
        {/* Cinematic Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-10"></div>
      </div>

      {/* Gradient Overlay - Always visible but stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500 z-20"></div>

      {/* Content Container */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-30">

        {/* Top Section: Category & Arrow */}
        <div className="flex justify-between items-start">
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {project.categories.slice(0, 2).map((cat, index) => (
              <motion.span
                key={cat}
                className="inline-block px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-300 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Interactive Content Indicator */}
          {project.embedUrl && (project.contentType === 'presentation' || project.contentType === 'video') && (
            <motion.div
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-accent/90 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-brand-accent/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {project.contentType === 'video' ? (
                <Play size={18} className="text-white fill-white" />
              ) : (
                <Presentation size={18} className="text-white" />
              )}
            </motion.div>
          )}

          <motion.div
            className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 ease-out shadow-xl"
            whileHover={{ rotate: 45 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <ArrowUpRight size={20} className="text-white group-hover:text-black transition-colors duration-300" />
          </motion.div>
        </div>

        {/* Bottom Section: Title & Tags */}
        <motion.div
          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl sm:text-3xl font-serif font-medium text-white leading-tight mb-3 group-hover:text-brand-accent transition-colors duration-300 drop-shadow-lg">
            {project.title}
          </h3>

          <motion.div
            className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100"
            initial="hidden"
            whileHover="visible"
          >
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider text-gray-400 font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;