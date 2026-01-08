import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { EXPERIENCES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Timeline: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the timeline is scrolled past the center of the screen
        // Start filling when the top enters the center
        const startOffset = windowHeight / 2;
        const totalHeight = rect.height;
        const currentPos = startOffset - rect.top;

        let progress = currentPos / totalHeight;
        progress = Math.max(0, Math.min(1, progress));

        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative py-10">
      {/* Central Line - Static Background */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2"></div>

      {/* Central Line - Dynamic Beam Light */}
      <div
        className="absolute left-6 md:left-1/2 top-0 w-px bg-brand-accent md:-translate-x-1/2 shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-100 ease-out"
        style={{ height: `${scrollProgress * 100}%` }}
      ></div>

      {/* Beam Head Glow */}
      <div
        className="absolute left-6 md:left-1/2 w-1 h-8 bg-white/50 blur-md md:-translate-x-1/2 transition-all duration-100 ease-out"
        style={{ top: `${scrollProgress * 100}%`, transform: 'translateY(-100%) translateX(-50%)' }}
      ></div>

      <div className="space-y-12">
        {EXPERIENCES.map((exp, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={exp.id} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 animate-fade-in`} style={{ animationDelay: `${index * 200}ms` }}>

              {/* Dot - Lights up when passed */}
              <div
                className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full md:-translate-x-1/2 mt-6 z-10 transition-all duration-500 border-2 ${scrollProgress > (index / EXPERIENCES.length)
                    ? 'bg-brand-dark border-brand-accent shadow-[0_0_15px_rgba(99,102,241,0.8)] scale-110'
                    : 'bg-brand-dark border-white/10 scale-100'
                  }`}
              >
                <div className={`absolute inset-0 bg-brand-accent rounded-full animate-ping opacity-20 ${scrollProgress > (index / EXPERIENCES.length) ? 'block' : 'hidden'}`}></div>
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[calc(50%-2rem)] pl-10 md:pl-0 ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                <div className={`glass-panel p-6 rounded-2xl border transition-all duration-500 group hover:-translate-y-1 hover:shadow-2xl ${scrollProgress > (index / EXPERIENCES.length)
                    ? 'border-brand-accent/30 shadow-brand-accent/5'
                    : 'border-white/5'
                  }`}>
                  <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'} mb-4`}>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{exp.role[language]}</h3>
                    <p className="text-lg font-serif italic text-gray-400">{exp.company}</p>
                  </div>

                  <div className={`flex flex-wrap gap-4 text-xs font-mono text-gray-500 mb-6 uppercase tracking-wider ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {exp.period[language]}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {exp.location[language]}</span>
                  </div>

                  <p className="text-gray-300 font-light leading-relaxed text-sm mb-6">
                    {exp.description[language]}
                  </p>

                  <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    {exp.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-400 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer for the other side (Desktop only) */}
              <div className="hidden md:block w-[calc(50%-2rem)]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;