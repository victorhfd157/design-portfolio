import React from 'react';
import { Palette, Cpu, BarChart3, Star, Layers, Code } from 'lucide-react';

interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  skills: string[];
  color: string;
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'creative',
    title: 'Visual Alchemy',
    subtitle: 'Design & Creation',
    icon: Palette,
    color: 'text-pink-400',
    skills: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe InDesign',
      'Adobe Premiere Pro',
      'Wordpress',
      'CSS e HTML'
    ]
  },
  {
    id: 'tech',
    title: 'Digital Intellect',
    subtitle: 'AI & Innovation',
    icon: Cpu,
    color: 'text-cyan-400',
    skills: [
      'Aplicação de IA no Design',
      'IA aplicada ao E-learning',
      'Prompt Engineering',
      'Ferramentas de E-learning (Articulate)',
      'Moodle'
    ]
  },
  {
    id: 'strategy',
    title: 'Structural Logic',
    subtitle: 'Data & Strategy',
    icon: BarChart3,
    color: 'text-purple-400',
    skills: [
      'Microsoft PowerPoint',
      'Power BI',
      'Microsoft Excel',
      'Liderança Estratégica',
      'Gestão de Projetos'
    ]
  }
];

const SkillsStatic: React.FC = () => {
  return (
    <div className="w-full relative">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SKILL_GROUPS.map((group, idx) => (
          <div 
            key={group.id}
            className="group relative flex flex-col h-full animate-fade-in"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Glass Card */}
            <div className="flex-1 glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/5">
              
              {/* Decorative Gradient Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${group.color.split('-')[1]}-500/10 to-transparent blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 transition-opacity duration-500 opacity-50`}></div>

              {/* Header */}
              <div className="relative z-10 mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <group.icon className={`${group.color} opacity-80`} size={28} />
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{`0${idx + 1}`}</span>
                </div>
                <h3 className="text-2xl font-serif text-white italic mb-1">{group.title}</h3>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{group.subtitle}</p>
              </div>

              {/* Skills List */}
              <ul className="space-y-4 relative z-10">
                {group.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-3 text-gray-300 group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/item:bg-white transition-colors"></div>
                    <span className="text-sm font-light tracking-wide group-hover/item:text-white transition-colors duration-300">
                      {skill}
                    </span>
                    {/* Hover Line */}
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover/item:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </li>
                ))}
              </ul>

              {/* Bottom decorative icon */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                 <Layers size={48} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Label */}
      <div className="mt-8 flex justify-center opacity-60">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-500">
            <Star size={10} className="text-brand-accent" />
            <span>Harmonized Skillset</span>
            <Star size={10} className="text-brand-accent" />
        </div>
      </div>
    </div>
  );
};

export default SkillsStatic;