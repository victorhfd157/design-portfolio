import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2rem] cursor-pointer bg-brand-gray/20">
      
      {/* Image */}
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 filter grayscale-[20%] group-hover:grayscale-0"
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
      
      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        
        {/* Top Right Arrow */}
        <div className="self-end translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
             <ArrowUpRight size={24} className="text-black" />
          </div>
        </div>

        {/* Bottom Text */}
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-brand-accent font-gothic text-2xl mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-2 group-hover:translate-y-0">
            {project.category}
          </p>
          <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-2">
            {project.title}
          </h3>
          <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
             <div className="flex flex-wrap gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-gray-300">
                    {tag}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Border Internal (Glass effect) */}
      <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none group-hover:border-white/20 transition-colors"></div>
    </div>
  );
};

export default ProjectCard;