import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles } from 'lucide-react';

const Grimoire: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="py-24 relative">
            <div className="max-w-4xl mx-auto text-center px-6 relative z-10">

                {/* Floating Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a2e] border border-purple-500/30 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-float">
                    <BookOpen className="text-purple-300" size={28} />
                </div>

                <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 italic tracking-wide drop-shadow-lg">
                    {t.grimoire.title}
                </h2>

                <div className="relative group">
                    {/* Magical Glow Behind */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative p-10 md:p-16 border border-white/10 rounded-2xl bg-[#0f0f16] backdrop-blur-xl shadow-2xl overflow-hidden">

                        {/* Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500/30 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <Sparkles className="absolute -top-4 -left-4 text-purple-400/50 animate-pulse" size={20} />
                            <Sparkles className="absolute -bottom-4 -right-4 text-blue-400/50 animate-pulse delay-700" size={20} />

                            <p className="text-2xl md:text-3xl font-light text-gray-200 leading-relaxed mb-8 font-serif">
                                <span className="text-5xl md:text-6xl float-left mr-3 mt-[-10px] text-purple-400 font-gothic">"</span>
                                {t.grimoire.text_1}
                            </p>

                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8"></div>

                            <p className="text-xl text-gray-400 font-serif italic">
                                {t.grimoire.text_2}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grimoire;
