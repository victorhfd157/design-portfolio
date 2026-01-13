import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, Star, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Grimoire: React.FC = () => {
    const { t } = useLanguage();

    return (

        <section className="py-24 md:py-32 relative overflow-hidden flex flex-col justify-center items-center">
            {/* Mystical Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Floating Icon */}
                    <div className="flex justify-center mb-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
                            <div className="relative w-20 h-20 rounded-full bg-[#0a0a0f]/50 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md animate-float group-hover:border-purple-400/30 transition-colors duration-500">
                                <BookOpen className="text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" size={32} />
                            </div>
                            <Sparkles className="absolute -top-1 -right-1 text-yellow-300 w-5 h-5 animate-pulse drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]" />
                            <Star className="absolute bottom-0 -left-1 text-blue-300 w-4 h-4 animate-pulse delay-700 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]" />
                        </div>
                    </div>

                    <h2 className="text-center text-4xl md:text-6xl font-serif text-white mb-16 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-purple-100 to-white/70 bg-clip-text text-transparent drop-shadow-2xl">
                            {t.grimoire.title}
                        </span>
                    </h2>

                    <div className="relative group perspective-1000">
                        {/* Magical Glow Behind Card */}
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse-slow" />

                        <div className="relative p-10 md:p-14 border border-white/10 rounded-[2rem] bg-[#0a0a0f]/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-700 group-hover:border-white/20 group-hover:shadow-[0_0_60px_rgba(139,92,246,0.15)]">

                            {/* Top Sheen */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                <Moon size={120} className="text-purple-300 rotate-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" strokeWidth={0.5} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center space-y-10 px-2 md:px-6">
                                <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 leading-relaxed font-serif tracking-wide max-w-3xl hyphens-none drop-shadow-lg">
                                    <span className="text-6xl md:text-8xl absolute -top-8 -left-4 md:-left-12 text-purple-500/20 font-serif leading-none select-none">"</span>
                                    {t.grimoire.text_1}
                                    <span className="text-6xl md:text-8xl absolute -bottom-12 -right-4 md:-right-12 text-purple-500/20 font-serif rotate-180 leading-none select-none">"</span>
                                </p>

                                <div className="flex items-center gap-4 w-full justify-center opacity-40">
                                    <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full max-w-[100px]" />
                                    <Star size={14} className="text-purple-300 animate-spin-slow" />
                                    <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full max-w-[100px]" />
                                </div>

                                <p className="text-lg md:text-xl text-gray-300 font-light font-sans max-w-2xl leading-relaxed">
                                    {t.grimoire.text_2}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Grimoire;
