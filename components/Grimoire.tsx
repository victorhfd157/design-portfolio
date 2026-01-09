import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, Star, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Grimoire: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Mystical Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Floating Icon */}
                    <div className="flex justify-center mb-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative w-20 h-20 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm animate-float">
                                <BookOpen className="text-purple-300" size={32} />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 text-yellow-300/80 w-5 h-5 animate-pulse" />
                            <Star className="absolute bottom-0 -left-2 text-blue-300/80 w-4 h-4 animate-pulse delay-700" />
                        </div>
                    </div>

                    <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-16 tracking-tight drop-shadow-2xl">
                        <span className="bg-gradient-to-r from-white via-purple-100 to-white/70 bg-clip-text text-transparent">
                            {t.grimoire.title}
                        </span>
                    </h2>

                    <div className="relative group perspective-1000">
                        {/* Magical Glow Behind Card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />

                        <div className="relative p-10 md:p-16 border border-white/10 rounded-[2rem] bg-[#0a0a0f]/80 backdrop-blur-2xl shadow-2xl overflow-hidden group-hover:bg-[#0a0a0f]/90 transition-all duration-500">

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Moon size={100} className="text-purple-300 rotate-12" strokeWidth={0.5} />
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-8 left-8 w-32 h-32 border-t border-l border-white/10 rounded-tl-3xl rounded-none opacity-50" />
                            <div className="absolute bottom-8 right-8 w-32 h-32 border-b border-r border-white/10 rounded-br-3xl rounded-none opacity-50" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center space-y-10 px-2 md:px-0">
                                <p className="text-xl md:text-3xl lg:text-4xl text-gray-200 leading-relaxed font-serif tracking-wide max-w-3xl hyphens-none">
                                    <span className="text-5xl md:text-7xl absolute -top-10 -left-2 md:-left-10 text-purple-500/20 font-serif">"</span>
                                    {t.grimoire.text_1}
                                    <span className="text-5xl md:text-7xl absolute -bottom-14 -right-2 md:-right-10 text-purple-500/20 font-serif rotate-180">"</span>
                                </p>

                                <div className="flex items-center gap-4 w-full justify-center opacity-30">
                                    <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32" />
                                    <Star size={12} className="text-white" />
                                    <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32" />
                                </div>

                                <p className="text-lg md:text-xl text-gray-400 font-sans italic max-w-2xl bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
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
