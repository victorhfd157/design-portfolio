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
            {/* Simple Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-brand-accent" />
                        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                            The Digital Alchemist Laboratory
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                        {t.alchemist_lab.title}
                    </h2>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore my core areas of expertise through interactive stations
                    </p>
                </motion.div>

                {/* Active Station Detail Panel */}
                <AnimatePresence mode="wait">
                    {activeData && activeContent && (
                        <motion.div
                            key={activeStation}
                            className="mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className={`relative rounded-3xl bg-gradient-to-br ${activeData.color} p-[2px]`}>
                                <div className="bg-black/95 backdrop-blur-xl rounded-[calc(1.5rem-2px)] p-8 md:p-12 relative">
                                    {/* Close button */}
                                    <button
                                        onClick={() => setActiveStation(null)}
                                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all z-10"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex items-start gap-6 mb-8">
                                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${activeData.color} flex items-center justify-center shadow-lg`}>
                                            <activeData.icon size={48} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeContent.title}</h3>
                                            <p className="text-sm font-mono uppercase tracking-wider text-gray-400">{activeData.subtitle}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 text-lg leading-relaxed mb-10">
                                        {activeContent.description}
                                    </p>

                                    {/* Skills Grid */}
                                    <div className="mb-10">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                                            <Layers size={16} />
                                            Expertise Levels
                                        </h4>
                                        <div className="grid gap-5">
                                            {activeData.skills.map((skill, idx) => (
                                                <motion.div
                                                    key={skill.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-white font-medium">{skill.name}</span>
                                                        <span className="text-gray-400 font-mono text-sm">{skill.level}%</span>
                                                    </div>
                                                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${activeData.color}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${skill.level}%` }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                                <FlaskConical size={14} />
                                                {activeContent.ingredients_title}
                                            </h4>
                                            <ul className="space-y-2">
                                                {activeContent.ingredients.map((item: string, idx: number) => (
                                                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                                        <Zap size={12} className="text-brand-accent mt-1 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                                <Sparkles size={14} />
                                                {activeContent.potion_title}
                                            </h4>
                                            <p className="text-white italic text-lg leading-relaxed">
                                                "{activeContent.potion}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Station Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stations.map((station, index) => {
                        const isActive = activeStation === station.key;
                        return (
                            <motion.div
                                key={station.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => setActiveStation(isActive ? null : station.key)}
                                className="cursor-pointer group"
                            >
                                <div className={`
                                    relative rounded-2xl p-8 h-full
                                    bg-gradient-to-br from-white/10 to-white/[0.02]
                                    border-2 transition-all duration-300
                                    ${isActive
                                        ? `${station.borderColor} shadow-2xl`
                                        : 'border-white/20 hover:border-white/40'
                                    }
                                    backdrop-blur-sm
                                `}>
                                    {/* Icon */}
                                    <div className={`
                                        w-20 h-20 rounded-xl mb-6 flex items-center justify-center
                                        bg-gradient-to-br ${station.color}
                                        shadow-lg transition-transform duration-300
                                        group-hover:scale-110
                                    `}>
                                        <station.icon size={36} className="text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {station.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-mono uppercase tracking-wider mb-6">
                                        {station.subtitle}
                                    </p>

                                    {/* Mini skills preview */}
                                    <div className="space-y-3 mb-6">
                                        {station.skills.slice(0, 3).map((skill, idx) => (
                                            <div key={idx}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-500">{skill.name}</span>
                                                    <span className="text-xs text-gray-600 font-mono">{skill.level}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${station.color}`}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${skill.level}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action hint */}
                                    <div className={`
                                        flex items-center gap-2 text-xs font-medium
                                        ${isActive ? 'text-white' : 'text-brand-accent'}
                                        transition-colors duration-300
                                    `}>
                                        <span>{isActive ? 'Active Station' : 'Click to explore'}</span>
                                        <Zap size={14} />
                                    </div>

                                    {/* Subtle glow on hover */}
                                    <div className={`
                                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl
                                        bg-gradient-to-br ${station.color}
                                    `} />
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
