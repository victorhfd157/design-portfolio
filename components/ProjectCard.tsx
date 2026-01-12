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
  return (
    <div
      className="group relative w-full h-full overflow-hidden rounded-[2rem] cursor-pointer bg-neutral-900 border border-white/5"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700 z-10" />
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-20" />

      {/* Content Container */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-30">

        {/* Top Header: Categories & Status */}
        <div className="flex justify-between items-start w-full">
          {/* Categories Pills */}
          <div className="flex flex-wrap gap-2">
            {project.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="px-3 py-1 text-[10px] uppercase tracking-widest font-medium text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                {cat}
              </span>
            ))}
          </div>

          {/* Type Indicator / Live Demo Badge */}
          {project.embedUrl && (project.contentType === 'presentation' || project.contentType === 'video') && (
            <motion.div
              className="px-3 py-1.5 bg-gradient-to-r from-brand-accent/90 to-purple-600/90 backdrop-blur-md rounded-full border border-white/30 flex items-center gap-2 shadow-lg shadow-brand-accent/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {project.contentType === 'video' ? (
                <Play size={12} className="text-white" fill="currentColor" />
              ) : (
                <Presentation size={12} className="text-white" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Demo</span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </div>


        {/* Bottom Content: Title & Arrow */}
        <div className="flex items-end justify-between gap-4">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white leading-tight mb-2 group-hover:text-brand-accent transition-colors duration-300">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-3 overflow-hidden h-auto opacity-100 md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-300 font-mono tracking-wide">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Floating Arrow Action */}
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
            <ArrowUpRight className="text-white group-hover:text-black transition-colors duration-300" size={20} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;