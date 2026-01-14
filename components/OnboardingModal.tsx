import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Layers, ArrowRight, CheckCircle, Navigation, MonitorPlay, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const OnboardingModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        const seen = localStorage.getItem('portfolio_onboarding_seen');
        if (!seen) {
            setTimeout(() => setIsOpen(true), 1500);
        }

        const handleOpen = () => {
            setIsOpen(true);
            setStep(0);
        };
        window.addEventListener('openOnboarding', handleOpen);

        return () => window.removeEventListener('openOnboarding', handleOpen);
    }, []);

    const handleClose = (permanent: boolean) => {
        setIsOpen(false);
        if (permanent) {
            localStorage.setItem('portfolio_onboarding_seen', 'true');
        }
    };

    const content = {
        pt: {
            title: "Laboratório Digital",
            subtitle: "Guia de Sobrevivência",
            steps: [
                {
                    icon: <Eye size={48} className="text-brand-accent mb-4" />,
                    title: "Imersão Visual",
                    description: "Abro meus projetos em tela cheia para purificar sua visão. Foco total na estética, sem ruído."
                },
                {
                    icon: <MonitorPlay size={48} className="text-pink-500 mb-4" />,
                    title: "Experimentos Vivos",
                    description: "Estática é chata. Alterne para 'Live Demo' e jogue meus jogos ou teste os apps direto no navegador."
                },
                {
                    icon: <Layers size={48} className="text-blue-400 mb-4" />,
                    title: "A Fórmula Secreta",
                    description: "Quer ver a alquimia? Clique em 'View Details' para transmutar a tela e revelar o processo completo."
                },
                {
                    icon: <Navigation size={48} className="text-green-400 mb-4" />,
                    title: "Teletransporte",
                    description: "Use o rodapé para saltar entre universos (projetos) sem perder o ritmo."
                }
            ],
            next: "Próximo Passo",
            start: "Iniciar Jornada",
            dontShow: "Ocultar para sempre"
        },
        en: {
            title: "Digital Laboratory",
            subtitle: "Survival Guide",
            steps: [
                {
                    icon: <Eye size={48} className="text-brand-accent mb-4" />,
                    title: "Visual Immersion",
                    description: "I open projects in fullscreen to purify your vision. Total focus on aesthetics, zero noise."
                },
                {
                    icon: <MonitorPlay size={48} className="text-pink-500 mb-4" />,
                    title: "Live Experiments",
                    description: "Static is boring. Switch to 'Live Demo' to play my games or test apps right in the browser."
                },
                {
                    icon: <Layers size={48} className="text-blue-400 mb-4" />,
                    title: "The Secret Formula",
                    description: "Want the alchemy? Click 'View Details' to transmute the screen and reveal the full process."
                },
                {
                    icon: <Navigation size={48} className="text-green-400 mb-4" />,
                    title: "Teleportation",
                    description: "Use the footer to jump between universes (projects) without missing a beat."
                }
            ],
            next: "Next Step",
            start: "Start Journey",
            dontShow: "Dismiss forever"
        }
    };

    const currentContent = content[language];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => handleClose(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        {/* Header Actions: Language & Close */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                            <button
                                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-brand-accent transition-all flex items-center gap-1"
                            >
                                <Globe size={12} />
                                {language === 'pt' ? 'EN' : 'PT'}
                            </button>
                            <button
                                onClick={() => handleClose(false)}
                                className="p-3 -mr-2 text-gray-500 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Title Section */}
                        <div className="text-center mb-8 relative z-10">
                            <h2 className="text-xs font-mono text-brand-accent uppercase tracking-[0.3em] mb-2">{currentContent.subtitle}</h2>
                            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">{currentContent.title}</h1>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center">

                            <div className="min-h-[200px] flex flex-col items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step + language}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col items-center"
                                    >
                                        {currentContent.steps[step].icon}
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {currentContent.steps[step].title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-sm max-w-xs font-light">
                                            {currentContent.steps[step].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            <div className="flex gap-2 mb-8 mt-4">
                                {currentContent.steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${step === idx ? 'w-8 bg-brand-accent shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'w-2 bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => {
                                        if (step < currentContent.steps.length - 1) {
                                            setStep(step + 1);
                                        } else {
                                            handleClose(false);
                                        }
                                    }}
                                    className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {step < currentContent.steps.length - 1 ? (
                                        <>{currentContent.next} <ArrowRight size={18} /></>
                                    ) : (
                                        <>{currentContent.start} <CheckCircle size={18} /></>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleClose(true)}
                                    className="text-[10px] text-gray-500 hover:text-white transition-colors py-2 uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
                                >
                                    {currentContent.dontShow}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingModal;
