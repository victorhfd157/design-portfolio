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

                    <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9] md:leading-[0.85] break-words hyphens-none">
                        <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent filter drop-shadow-2xl block">
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
                            className="mb-20 perspective-1000"
                            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                        >
                            <div className="relative rounded-[2.5rem] p-[1px] overflow-hidden group">
                                {/* Living Gradient Border */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${activeData.color} opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-1000 animate-pulse-slow`} />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                                <div className="relative bg-[#050505]/95 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-12 overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">

                                    {/* Background Decor */}
                                    <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${activeData.color} rounded-full blur-[120px] opacity-20 pointer-events-none`} />
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                                    {/* Close button - Premium Sticky */}
                                    <button
                                        onClick={() => setActiveStation(null)}
                                        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-black/20 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:rotate-90 duration-300 z-50 border border-white/5 hover:border-white/20 backdrop-blur-xl group/close"
                                    >
                                        <X size={20} className="group-hover/close:scale-110 transition-transform" />
                                    </button>

                                    <div className="flex flex-col gap-10 md:gap-16 relative z-10">

                                        {/* Header Identity & Narrative */}
                                        <div className="text-center md:text-left">
                                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                                                {/* Orbital Icon Animation */}
                                                <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
                                                    <div className={`absolute inset-0 rounded-full border-2 border-dashed ${activeData.borderColor} opacity-30 animate-spin-slow`} />
                                                    <div className={`absolute inset-[-4px] rounded-full border border-white/10 opacity-20`} />
                                                    <div className={`
                                                        absolute inset-2 rounded-2xl flex items-center justify-center
                                                        bg-gradient-to-br ${activeData.color} shadow-[0_0_30px_rgba(0,0,0,0.3)]
                                                        transform rotate-3 group-hover:rotate-6 transition-transform duration-700
                                                    `}>
                                                        <activeData.icon size={48} className="text-white drop-shadow-xl md:w-16 md:h-16" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4 max-w-2xl">
                                                    <h3 className="text-3xl xs:text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] hyphens-none">
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                                                            {activeContent.title}
                                                        </span>
                                                    </h3>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${activeData.bgColor} border ${activeData.borderColor} border-opacity-30`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeData.color} animate-pulse`} />
                                                        <p className="text-xs font-mono uppercase tracking-widest text-white/90">{activeData.subtitle}</p>
                                                    </div>

                                                    <p className="text-base md:text-xl text-gray-300 leading-relaxed font-light mt-4 md:pr-10">
                                                        {activeContent.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                                            {/* Column 1: Ingredients & Potion */}
                                            <div className="space-y-8">
                                                {/* Ingredients Chips */}
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 border-b border-white/5 pb-2">
                                                        <FlaskConical size={14} className="text-brand-accent" />
                                                        {activeContent.ingredients_title}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeContent.ingredients.map((item: string, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className={`
                                                                    px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-300
                                                                    bg-white/5 border border-white/5 hover:border-white/20 
                                                                    hover:bg-white/10 transition-all cursor-default
                                                                    flex items-center gap-2 group/chip w-full md:w-auto
                                                                `}
                                                            >
                                                                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeData.color} opacity-50 group-hover/chip:opacity-100 shrink-0`} />
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Rare Potion Card */}
                                                <div className="relative group/card overflow-hidden rounded-xl bg-black/40 border border-white/10 p-6 md:p-8 hover:border-white/20 transition-all duration-500">
                                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${activeData.color} opacity-10 blur-[60px] transition-opacity duration-500`} />
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2 relative z-10">
                                                        <Sparkles size={14} className="text-amber-400" />
                                                        {activeContent.potion_title}
                                                    </h4>
                                                    <p className="text-lg md:text-2xl font-serif italic text-white/90 leading-loose relative z-10">
                                                        "{activeContent.potion}"
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Column 2: Mastery */}
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                                                    <Layers size={14} className="text-brand-accent" />
                                                    Mastery Levels
                                                </h4>
                                                <div className="space-y-6">
                                                    {activeData.skills.map((skill, idx) => (
                                                        <div key={skill.name} className="group/skill relative">
                                                            <div className="flex justify-between mb-2 items-center">
                                                                <span className="text-sm md:text-base font-medium text-gray-200 group-hover/skill:text-white transition-colors">{skill.name}</span>
                                                                <span className="text-xs font-mono text-brand-accent px-2 py-0.5 rounded bg-white/5">{skill.level}%</span>
                                                            </div>
                                                            {/* Custom Tech Progress Bar */}
                                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className={`h-full bg-gradient-to-r ${activeData.color} relative shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${skill.level}%` }}
                                                                    transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1), type: "spring", stiffness: 50, damping: 20 }}
                                                                >
                                                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_white]" />
                                                                </motion.div>
                                                            </div>
                                                        </div>
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

                {/* Scroll Indicator Mobile */}
                <div className="md:hidden flex items-center justify-center gap-2 mb-4 animate-pulse">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Swipe to Explore</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 h-1 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                {/* Station Cards Grid - Horizontal Scroll on Mobile (Better Centering & No Clipping) */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-12 md:py-0 w-[calc(100%+2rem)] md:w-full -mx-4 md:mx-0 scrollbar-hide px-0 md:px-0 before:shrink-0 before:w-[12.5vw] after:shrink-0 after:w-[12.5vw] md:before:content-none md:after:content-none">
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
                                className="w-[75vw] shrink-0 md:min-w-0 md:w-auto h-full snap-center"
                            >
                                <div className={`
                                    relative h-full rounded-2xl p-8 cursor-pointer overflow-hidden group
                                    border border-white/5 hover:border-white/20 transition-all duration-500
                                    ${isActive ? 'ring-1 ring-brand-accent shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-white/[0.08]' : 'bg-white/[0.02]'}
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
