import React, { useState } from 'react';
import { ChevronRight, Cpu, Palette, BarChart3, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SkillGroup {
  id: string;
  titleKey: 'creative' | 'tech' | 'strategy';
  icon: React.ElementType;
  color: string;
  skills: { name: string; level: number }[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'creative',
    titleKey: 'creative',
    icon: Palette,
    color: 'text-pink-400 bg-pink-500',
    skills: [
      { name: 'Photoshop & Illustrator', level: 95 },
      { name: 'Adobe Premiere Pro', level: 85 },
      { name: 'Wordpress & CMS', level: 90 },
      { name: 'CSS & HTML', level: 80 }
    ]
  },
  {
    id: 'tech',
    titleKey: 'tech',
    icon: Cpu,
    color: 'text-cyan-400 bg-cyan-500',
    skills: [
      { name: 'Generative AI & Prompts', level: 92 },
      { name: 'AI for E-learning', level: 88 },
      { name: 'Articulate & Moodle', level: 85 },
      { name: 'Automation Workflows', level: 75 }
    ]
  },
  {
    id: 'strategy',
    titleKey: 'strategy',
    icon: BarChart3,
    color: 'text-purple-400 bg-purple-500',
    skills: [
      { name: 'Instructional Design', level: 95 },
      { name: 'Data (PowerBI/Excel)', level: 85 },
      { name: 'Project Leadership', level: 90 },
      { name: 'Branding Strategy', level: 88 }
    ]
  }
];

const SkillsList: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string>('creative');
  const { t } = useLanguage();

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="relative pl-6 border-l border-white/10 space-y-2">
        
        {/* Decorative 'DNA' Line */}
        <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-accent/0 via-brand-accent/50 to-brand-accent/0"></div>

        {SKILL_GROUPS.map((group) => {
          const isActive = activeGroup === group.id;

          return (
            <div 
              key={group.id}
              className={`relative transition-all duration-500 ease-in-out ${isActive ? 'py-4' : 'py-1'}`}
              onMouseEnter={() => setActiveGroup(group.id)}
            >
              {/* Group Header */}
              <div 
                className={`flex items-center gap-4 cursor-pointer group transition-all duration-300 ${isActive ? 'opacity-100 translate-x-2' : 'opacity-50 hover:opacity-80'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 ${isActive ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/20' : ''}`}>
                  <group.icon size={18} className={`${isActive ? group.color.split(' ')[0] : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1">
                  <h4 className={`text-lg font-serif italic ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {t.skills[group.titleKey]}
                  </h4>
                  {isActive && (
                    <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mt-2"></div>
                  )}
                </div>

                <ChevronRight 
                  size={16} 
                  className={`text-gray-600 transition-transform duration-300 ${isActive ? 'rotate-90 text-brand-accent' : ''}`} 
                />
              </div>

              {/* Expanded Content */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
              >
                <div className="pl-[3.5rem] pr-2 space-y-4">
                  {group.skills.map((skill, idx) => (
                    <div key={idx} className="group/skill">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-sm text-gray-300 font-light">{skill.name}</span>
                        <span className="text-[10px] text-gray-600 font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${group.color.split(' ')[1]}`} 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pl-8 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest opacity-60">
        <Star size={10} className="text-brand-accent animate-pulse" />
        <span>{t.skills.hover_reveal}</span>
      </div>
    </div>
  );
};

export default SkillsList;