import React, { useState } from 'react';
import { ChevronRight, Cpu, Palette, BarChart3, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SkillGroup {
  id: string;
  titleKey: 'creative' | 'tech' | 'strategy';
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  skills: { name: string; level: number }[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'creative',
    titleKey: 'creative',
    icon: Palette,
    gradient: 'from-pink-500 to-purple-600',
    accentColor: 'text-pink-400',
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
    gradient: 'from-cyan-500 to-blue-600',
    accentColor: 'text-cyan-400',
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
    gradient: 'from-purple-500 to-indigo-600',
    accentColor: 'text-purple-400',
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
      {/* Enhanced Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
        <div className="relative">
          <Sparkles className="text-brand-accent animate-pulse" size={20} />
          <div className="absolute inset-0 blur-md bg-brand-accent/50 animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="relative pl-8 border-l-2 border-white/10 space-y-3">

        {/* Animated DNA Line */}
        <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-accent/0 via-brand-accent/70 to-brand-accent/0 animate-pulse" />

        {SKILL_GROUPS.map((group, index) => {
          const isActive = activeGroup === group.id;
          const Icon = group.icon;

          return (
            <div
              key={group.id}
              className={`relative transition-all duration-500 ease-out ${isActive ? 'mb-6' : 'mb-0'}`}
              onMouseEnter={() => setActiveGroup(group.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow on Active */}
              {isActive && (
                <div className={`absolute -left-8 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${group.gradient} blur-sm animate-pulse`} />
              )}

              {/* Group Header */}
              <div
                className={`flex items-center gap-4 cursor-pointer group transition-all duration-300 ${isActive ? 'opacity-100 translate-x-3' : 'opacity-60 hover:opacity-90 hover:translate-x-1'
                  }`}
              >
                {/* Icon with Gradient Background */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive
                  ? `bg-gradient-to-br ${group.gradient} shadow-lg scale-110 rotate-3`
                  : 'bg-white/5 scale-100 rotate-0'
                  }`}>
                  {isActive && (
                    <div className={`absolute -inset-1 bg-gradient-to-br ${group.gradient} blur-lg opacity-50 animate-pulse`} />
                  )}
                  <Icon size={22} className={isActive ? 'text-white relative z-10' : 'text-gray-500'} />
                </div>

                <div className="flex-1">
                  <h4 className={`text-xl font-serif italic transition-all duration-300 ${isActive ? 'text-white font-bold' : 'text-gray-500 font-normal'
                    }`}>
                    {t.skills[group.titleKey]}
                  </h4>
                  {isActive && (
                    <div className={`h-[2px] w-24 bg-gradient-to-r ${group.gradient} mt-2 rounded-full animate-pulse`} />
                  )}
                </div>

                <ChevronRight
                  size={18}
                  className={`transition-all duration-500 ${isActive ? `rotate-90 ${group.accentColor}` : 'text-gray-600 rotate-0'
                    }`}
                />
              </div>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-out ${isActive ? 'max-h-[400px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="pl-16 pr-4 space-y-5">
                  {group.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="group/skill"
                      style={{
                        animation: isActive ? `fadeInUp 0.5s ease-out ${idx * 100}ms both` : 'none'
                      }}
                    >
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-gray-200 font-medium transition-colors group-hover/skill:text-white">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500 font-mono tabular-nums">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                        {/* Shimmer Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{
                            animation: 'shimmer 3s infinite',
                            animationDelay: `${idx * 200}ms`
                          }}
                        />

                        {/* Progress Fill */}
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${group.gradient} relative overflow-hidden shadow-lg transition-all duration-1000 ease-out`}
                          style={{
                            width: `${skill.level}%`,
                          }}
                        >
                          {/* Inner Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />

                          {/* Animated Shimmer */}
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            style={{
                              animation: 'slideShimmer 2s infinite',
                              animationDelay: `${idx * 300}ms`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Hint */}
      <div className="mt-10 pl-8 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest opacity-60">
        <Star size={10} className="text-brand-accent animate-pulse" />
        <span>{t.skills.hover_reveal}</span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes slideShimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default SkillsList;