import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlaskConical, Palette, Bot, BarChart3, ChevronDown, Sparkles, Feather, Database, GraduationCap } from 'lucide-react';

type StationKey = 'elearning' | 'design' | 'ai' | 'data';

const AlchemistLab: React.FC = () => {
    const { t } = useLanguage();
    const [activeStation, setActiveStation] = useState<StationKey | null>(null);

    const stations: { key: StationKey; icon: React.ElementType; color: string; secondaryColor: string; gradient: string; glow: string }[] = [
        {
            key: 'elearning',
            icon: GraduationCap,
            color: 'text-blue-400',
            secondaryColor: 'bg-blue-500/10',
            gradient: 'from-blue-500/20 to-purple-500/20',
            glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]'
        },
        {
            key: 'design',
            icon: Palette,
            color: 'text-pink-400',
            secondaryColor: 'bg-pink-500/10',
            gradient: 'from-pink-500/20 to-rose-500/20',
            glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]'
        },
        {
            key: 'ai',
            icon: Bot,
            color: 'text-cyan-400',
            secondaryColor: 'bg-cyan-500/10',
            gradient: 'from-cyan-500/20 to-blue-500/20',
            glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]'
        },
        {
            key: 'data',
            icon: BarChart3,
            color: 'text-emerald-400',
            secondaryColor: 'bg-emerald-500/10',
            gradient: 'from-emerald-500/20 to-teal-500/20',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
        },
    ];

    const toggleStation = (key: StationKey) => {
        setActiveStation(activeStation === key ? null : key);
    };

    return (
        <div className="py-20 relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center mb-20 relative z-10">
                <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <FlaskConical className="text-purple-400" size={32} />
                </div>
                <h2 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight">
                    {t.alchemist_lab.title}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
                {stations.map((station) => {
                    const isActive = activeStation === station.key;
                    const content = t.alchemist_lab.stations[station.key];

                    return (
                        <div
                            key={station.key}
                            className={`
                relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer group
                ${isActive
                                    ? `border-white/30 bg-gradient-to-br ${station.gradient} ${station.glow} scale-[1.02]`
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }
              `}
                            onClick={() => toggleStation(station.key)}
                        >
                            {/* Decorative Particles/Runes Background */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
                            </div>

                            {/* Card Header */}
                            <div className="p-8 flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                    ${station.secondaryColor} ${station.color} border border-white/10
                    transition-all duration-500 shadow-lg
                    ${isActive ? 'scale-110 rotate-3 shadow-white/10' : 'group-hover:scale-105'}
                  `}>
                                        <station.icon size={32} className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-serif text-white mb-2 transition-colors duration-300 ${isActive ? 'text-white drop-shadow-md' : 'group-hover:text-white'}`}>
                                            {content.title}
                                        </h3>
                                        <p className={`text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                            {content.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5
                  transition-all duration-500 ${isActive ? 'bg-white/20 rotate-180' : 'group-hover:bg-white/10'}
                `}>
                                    <ChevronDown size={20} className="text-white/70" />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <div
                                className={`
                  overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
                            >
                                <div className="p-8 pt-0 mx-2 mb-2">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

                                    <p className="text-gray-200 font-light leading-relaxed mb-8 text-lg">
                                        {content.description}
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                        {/* Ingredients */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest">
                                                <FlaskConical size={14} className={station.color} /> {content.ingredients_title}
                                            </h4>
                                            <ul className="space-y-3">
                                                {content.ingredients.map((item: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm group/item">
                                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${station.color} shadow-[0_0_5px_currentColor] opacity-70 group-hover/item:opacity-100 transition-opacity`}></span>
                                                        <span className="group-hover/item:text-white transition-colors">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Catalysts */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-widest">
                                                <Sparkles size={14} className="text-amber-300" /> {content.catalysts_title}
                                            </h4>
                                            <ul className="space-y-3">
                                                {content.catalysts.map((item: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm group/item">
                                                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-amber-300 shadow-[0_0_5px_currentColor] opacity-50 group-hover/item:opacity-100 transition-opacity"></span>
                                                        <span className="group-hover/item:text-white transition-colors">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Potion Result */}
                                    <div className={`
                    p-6 rounded-2xl border border-white/10 relative overflow-hidden group/potion
                    bg-black/40 backdrop-blur-md
                  `}>
                                        <div className={`absolute inset-0 opacity-0 group-hover/potion:opacity-20 transition-opacity duration-700 bg-gradient-to-r ${station.gradient}`}></div>
                                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transform group-hover/potion:scale-110 transition-transform duration-700">
                                            <Feather size={100} className="text-white" />
                                        </div>

                                        <h4 className="relative z-10 flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-3">
                                            <Feather size={14} className={station.color} /> {content.potion_title}
                                        </h4>
                                        <p className="relative z-10 text-white font-serif italic text-xl leading-relaxed drop-shadow-md">
                                            "{content.potion}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlchemistLab;
