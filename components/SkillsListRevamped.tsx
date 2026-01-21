import React, { useState } from 'react';
import { Cpu, Palette, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SkillGroup {
    id: string;
    titleKey: 'creative' | 'tech' | 'strategy';
    icon: React.ElementType;
    gradient: string;
    borderColor: string;
    skills: { name: string; level: number }[];
}

const SKILL_GROUPS: SkillGroup[] = [
    {
        id: 'creative',
        titleKey: 'creative',
        icon: Palette,
        gradient: 'from-pink-500 to-purple-600',
        borderColor: 'border-pink-500/30',
        skills: [
            { name: 'Photoshop & Illustrator', level: 98 },
            { name: 'After Effects & Premiere', level: 92 },
            { name: 'Figma & Adobe XD', level: 90 },
            { name: 'InDesign & Typography', level: 95 }
        ]
    },
    {
        id: 'tech',
        titleKey: 'tech',
        icon: Cpu,
        gradient: 'from-cyan-500 to-blue-600',
        borderColor: 'border-cyan-500/30',
        skills: [
            { name: 'Generative AI & Diffusion', level: 95 },
            { name: 'WordPress & Drupal CMS', level: 92 },
            { name: 'HTML & CSS', level: 85 },
            { name: 'Power BI & Analytics', level: 88 }
        ]
    },
    {
        id: 'strategy',
        titleKey: 'strategy',
        icon: BarChart3,
        gradient: 'from-purple-500 to-indigo-600',
        borderColor: 'border-purple-500/30',
        skills: [
            { name: 'Instructional Design', level: 98 },
            { name: 'EdTech & E-learning', level: 95 },
            { name: 'Branding Strategy', level: 92 },
            { name: 'Gamification & Microlearning', level: 90 }
        ]
    }
];

const SkillsListRevamped: React.FC = () => {
    const { t } = useLanguage();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-brand-accent" size={20} />
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    Technical Proficiency
                </h3>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SKILL_GROUPS.map((group, index) => {
                    const isHovered = hoveredCard === group.id;
                    const Icon = group.icon;

                    return (
                        <div
                            key={group.id}
                            className="group relative"
                            onMouseEnter={() => setHoveredCard(group.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Glow Effect */}
                            <div
                                className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-br ${group.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                            />

                            {/* Card */}
                            <div
                                className={`relative h-full glass-panel rounded-2xl border ${group.borderColor} p-6 backdrop-blur-xl transition-all duration-500 ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
                                    }`}
                            >
                                {/* Icon Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div
                                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : 'rotate-0'
                                            }`}
                                    >
                                        <Icon size={26} className="text-white" />
                                    </div>

                                    {/* Particle Effect */}
                                    {isHovered && (
                                        <div className="absolute top-6 right-6">
                                            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h4 className="text-xl font-serif italic text-white mb-6 font-bold">
                                    {t.skills[group.titleKey]}
                                </h4>

                                {/* Skills List */}
                                <div className="space-y-5">
                                    {group.skills.map((skill, idx) => (
                                        <div key={idx} className="group/skill">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm text-gray-200 font-medium">
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono tabular-nums">
                                                    {skill.level}%
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                {/* Animated Background */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

                                                {/* Progress Fill */}
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${group.gradient} transition-all duration-1000 ease-out relative overflow-hidden`}
                                                    style={{
                                                        width: isHovered ? `${skill.level}%` : '0%',
                                                        transitionDelay: `${idx * 100}ms`
                                                    }}
                                                >
                                                    {/* Shimmer Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Hover Indicator */}
                                <div
                                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-widest transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'
                                        }`}
                                >
                                    Hover to reveal
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Shimmer animation */}
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    );
};

export default SkillsListRevamped;
