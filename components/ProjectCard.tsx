import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight, Play, Presentation, Sparkles } from 'lucide-react';
import { getCategoryColor, isNewProject } from '../utils/categoryHelpers';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const showNewBadge = project.year && isNewProject(`${project.year}-01-01`);
  const divRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full h-full overflow-hidden rounded-[2rem] cursor-pointer bg-neutral-900 border border-white/5"
    >
      {/* SPOTLIGHT EFFECT LAYER */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* BORDER GLOW LAYER */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.3), transparent 40%)`,
          maskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
          maskComposite: 'exclude',
          padding: '1px',
          borderRadius: '2rem'
        }}
      />

      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700 z-10" />
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
      </div>


      {/* Hover Overlay - Subtle Lighten */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500 z-20 pointer-events-none" />

      {/* Top Badges (Floating) */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="flex flex-wrap gap-2">
          {project.categories.slice(0, 1).map((cat) => (
            <span key={cat} className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-white bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              {cat}
            </span>
          ))}
        </div>

        {/* Live Demo Badge */}
        {project.embedUrl && (project.contentType === 'presentation' || project.contentType === 'video') && (
          <div className="px-3 py-1.5 bg-brand-accent/90 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 shadow-lg shadow-brand-accent/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Clean Gradient Overlay - Only at bottom for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none z-20" />

      {/* Content - Clean Bottom Layout */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-30 flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-tight group-hover:text-brand-accent transition-colors duration-300 line-clamp-2 transform translate-y-1 group-hover:translate-y-0 text-shadow-lg">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-300 font-mono tracking-wide transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-brand-accent font-bold">{project.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span className="truncate text-gray-400 group-hover:text-white transition-colors">{project.tags[0]}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:scale-110 transition-all duration-300 shadow-lg shrink-0">
          <ArrowUpRight className="text-white transition-transform duration-300 group-hover:rotate-45" size={20} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;