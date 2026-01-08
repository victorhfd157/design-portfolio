import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { FlaskConical, Palette, Bot, BarChart3, Sparkles, Code, Layers, Zap, X } from 'lucide-react';

type StationKey = 'elearning' | 'design' | 'ai' | 'data';

const AlchemistLab: React.FC = () => {
    const { t } = useLanguage();
    const [activeStation, setActiveStation] = useState<StationKey | null>(null);

    const stations = [
        {
            key: 'elearning' as StationKey,
            icon: Code,
            title: 'E-Learning',
            subtitle: 'Digital Education',
            color: 'from-blue-500 to-cyan-500',
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-500/20',
            skills: [
                { name: 'Moodle Architecture', level: 95 },
                { name: 'SCORM Engineering', level: 90 },
                { name: 'H5P Innovation', level: 85 },
                { name: 'Articulate Mastery', level: 88 },
            ]
        },
        {
            key: 'design' as StationKey,
            icon: Palette,
            title: 'Design',
            subtitle: 'Visual Alchemy',
            color: 'from-pink-500 to-purple-500',
            borderColor: 'border-pink-500',
            bgColor: 'bg-pink-500/20',
            skills: [
                { name: 'Figma Wizardry', level: 95 },
                { name: 'Adobe Creative Suite', level: 92 },
                { name: 'UI/UX Design', level: 93 },
                { name: '3D Design', level: 80 },
            ]
        },
        {
            key: 'ai' as StationKey,
            icon: Bot,
            title: 'Artificial Intelligence',
            subtitle: 'Neural Synthesis',
            color: 'from-cyan-500 to-teal-500',
            borderColor: 'border-cyan-500',
            bgColor: 'bg-cyan-500/20',
            skills: [
                { name: 'LLM Integration', level: 95 },
                { name: 'Image Generation', level: 92 },
                { name: 'Prompt Engineering', level: 90 },
                { name: 'AI Workflows', level: 88 },
            ]
        },
        {
            key: 'data' as StationKey,
            icon: BarChart3,
            title: 'Data & Analytics',
            subtitle: 'Insight Engine',
            color: 'from-emerald-500 to-green-500',
            borderColor: 'border-emerald-500',
            bgColor: 'bg-emerald-500/20',
            skills: [
                { name: 'Data Visualization', level: 88 },
                { name: 'Analytics', level: 85 },
                { name: 'Excel Mastery', level: 92 },
                { name: 'Business Intelligence', level: 80 },
            ]
        },
    ];

    const activeData = activeStation ? stations.find(s => s.key === activeStation) : null;
    const activeContent = activeStation ? t.alchemist_lab.stations[activeStation] : null;

    return (
        <div className="min-h-screen bg-brand-dark py-32 px-4 md:px-8 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-accent/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-blue-500/10 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '4s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-300">
                            The Digital Alchemist Laboratory
                        </span>
                    </div>

                    <h2 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85]">
                        <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent filter drop-shadow-2xl">
                            {t.alchemist_lab.title}
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        Explore my core areas of expertise through <span className="text-white font-medium">interactive stations</span> designed to showcase the fusion of creativity and logic.
                    </p>
                </motion.div>

                {/* Active Station Detail Panel */}
                <AnimatePresence mode="wait">
                    {activeData && activeContent && (
                        <motion.div
                            key={activeStation}
                            className="mb-20"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                        >
                            <div className={`relative rounded-[2rem] p-[1px] overflow-hidden group`}>
                                {/* Gradient Border Animation */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${activeData.color} opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500`} />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

                                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl">
                                    {/* Close button */}
                                    <button
                                        onClick={() => setActiveStation(null)}
                                        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all hover:rotate-90 duration-300 z-10 border border-transparent hover:border-white/20"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
                                        <div className="space-y-8">
                                            <div className="flex items-start gap-6">
                                                <div className={`
                                                    w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3
                                                    bg-gradient-to-br ${activeData.color}
                                                `}>
                                                    <activeData.icon size={48} className="text-white drop-shadow-md" />
                                                </div>
                                                <div className="flex-1 pt-2">
                                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{activeContent.title}</h3>
                                                    <div className={`inline-block px-3 py-1 rounded-md bg-${activeData.bgColor} border ${activeData.borderColor} border-opacity-30`}>
                                                        <p className="text-sm font-mono uppercase tracking-wider text-white/90">{activeData.subtitle}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                                    <FlaskConical size={14} />
                                                    {activeContent.ingredients_title}
                                                </h4>
                                                <ul className="space-y-3">
                                                    {activeContent.ingredients.map((item: string, idx: number) => (
                                                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-3 group/item">
                                                            <div className={`mt-1 p-1 rounded-full bg-white/5 group-hover/item:bg-${activeData.color.split(' ')[1]}/20 transition-colors`}>
                                                                <Zap size={10} className={`text-gray-400 group-hover/item:text-white transition-colors`} />
                                                            </div>
                                                            <span className="group-hover/item:text-white transition-colors">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${activeData.color} opcode-10 blur-3xl rounded-full translate-x-10 -translate-y-10`} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2 relative z-10">
                                                    <Sparkles size={14} />
                                                    {activeContent.potion_title}
                                                </h4>
                                                <p className="text-white italic text-lg leading-relaxed relative z-10">
                                                    "{activeContent.potion}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <p className="text-xl text-gray-300 leading-relaxed font-light border-l-2 border-white/10 pl-6">
                                                {activeContent.description}
                                            </p>

                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
                                                    <Layers size={16} />
                                                    Mastery Levels
                                                </h4>
                                                <div className="grid gap-6">
                                                    {activeData.skills.map((skill, idx) => (
                                                        <motion.div
                                                            key={skill.name}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="group/skill"
                                                        >
                                                            <div className="flex justify-between mb-2">
                                                                <span className="text-gray-200 font-medium group-hover/skill:text-white transition-colors">{skill.name}</span>
                                                                <span className="text-gray-500 font-mono text-sm">{skill.level}%</span>
                                                            </div>
                                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                                                <motion.div
                                                                    className={`h-full bg-gradient-to-r ${activeData.color} relative overflow-hidden`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${skill.level}%` }}
                                                                    transition={{ duration: 1.2, delay: idx * 0.1, type: "spring" }}
                                                                >
                                                                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ width: '50%', transform: 'skewX(-20deg)' }} />
                                                                </motion.div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Station Cards Grid - Horizontal Scroll on Mobile (App-like feel) */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
                    {stations.map((station, index) => {
                        const isActive = activeStation === station.key;
                        return (
                            <motion.div
                                key={station.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={() => setActiveStation(isActive ? null : station.key)}
                                className="min-w-[85vw] md:min-w-0 h-full snap-center"
                            >
                                <div className={`
                                    relative h-full rounded-2xl p-8 cursor-pointer overflow-hidden group
                                    border border-white/5 hover:border-white/20 transition-all duration-500
                                    ${isActive ? 'ring-2 ring-offset-2 ring-offset-black ring-white/50' : ''}
                                `}>
                                    {/* Glass Background */}
                                    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 group-hover:bg-white/[0.06]" />

                                    {/* Gradient Blobs (Hover) */}
                                    <div className={`
                                        absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px]
                                        bg-gradient-to-br ${station.color}
                                        opacity-0 group-hover:opacity-60 transition-opacity duration-700
                                    `} />
                                    <div className={`
                                        absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[80px]
                                        bg-gradient-to-br ${station.color}
                                        opacity-0 group-hover:opacity-40 transition-opacity duration-700
                                    `} />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className={`
                                            w-16 h-16 rounded-xl mb-8 flex items-center justify-center
                                            bg-gradient-to-br ${station.color}
                                            shadow-lg transform transition-all duration-500
                                            group-hover:scale-110 group-hover:rotate-3
                                        `}>
                                            <station.icon size={32} className="text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                            {station.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-6 group-hover:text-gray-400 transition-colors">
                                            {station.subtitle}
                                        </p>

                                        {/* Visual Divider / Progress Bars Mockup */}
                                        <div className="mt-auto space-y-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                            {station.skills.slice(0, 3).map((skill, idx) => (
                                                <div key={idx} className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${station.color}`}
                                                        style={{ width: `${skill.level}%` }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`
                                            mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest
                                            text-gray-500 group-hover:text-white transition-colors duration-300
                                        `}>
                                            <span>Explore</span>
                                            <Zap size={12} className="group-hover:text-brand-accent transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

};

export default AlchemistLab;
