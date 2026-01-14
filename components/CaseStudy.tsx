import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { CaseStudy, Language } from '../types';
import { Check, Target, Zap, ArrowRight, Lightbulb, AlertTriangle, ChevronDown, ChevronUp, Minus } from 'lucide-react';

interface CaseStudyProps {
    caseStudy: CaseStudy;
    language: Language;
    isMobile?: boolean;
    onNextProject?: () => void;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
};

// Section Component Wrapper for consistency
const Section = ({ id, title, children, className = "" }: { id: string, title?: string, children: React.ReactNode, className?: string }) => (
    <section id={id} className={`scroll-mt-32 ${className}`}>
        {title && (
            <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{title}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-brand-accent to-transparent rounded-full"></div>
            </div>
        )}
        {children}
    </section>
);

const CaseStudySection: React.FC<CaseStudyProps> = ({ caseStudy, language, isMobile = false, onNextProject }) => {
    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [activeSection, setActiveSection] = useState('overview');
    const [isExpanded, setIsExpanded] = useState(false);

    // Handle Active Section on Scroll
    useEffect(() => {
        if (!isExpanded) return;
        // Scroll spy logic could go here if needed
    }, [isExpanded]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    const handleExpand = () => {
        setIsExpanded(true);
        // Smooth scroll to the details section after a brief delay for animation start
        setTimeout(() => {
            const details = document.getElementById('case-study-details');
            if (details) {
                details.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'context', label: 'Context' },
        { id: 'challenge', label: 'Challenge' },
        { id: 'solution', label: 'Solution' },
        { id: 'process', label: 'Process' },
        { id: 'decisions', label: 'Key Decisions' },
        { id: 'results', label: 'Results' }
    ];

    return (
        <div className="relative text-left">
            {!isMobile && (
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent to-purple-500 origin-left z-[60]"
                    style={{ scaleX, opacity: isExpanded ? 1 : 0 }}
                />
            )}

            <div className={`flex flex-col lg:flex-row gap-0 lg:gap-16 pt-8 ${!isMobile ? 'max-w-7xl mx-auto' : ''}`}>

                {/* STICKY NAVIGATION (Desktop Only) */}
                {!isMobile && (
                    <aside className={`hidden lg:block w-64 shrink-0 transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 px-3">Contents</h4>
                                <nav className="space-y-1">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`text-sm block w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${activeSection === item.id
                                                ? 'bg-white/10 text-white font-medium translate-x-1'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Metadata in Sidebar */}
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                                {caseStudy.role && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">My Role</p>
                                        <p className="text-sm text-white font-medium">{caseStudy.role[language]}</p>
                                    </div>
                                )}
                                {caseStudy.duration && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timeline</p>
                                        <p className="text-sm text-white font-medium">{caseStudy.duration[language]}</p>
                                    </div>
                                )}
                            </div>

                            {/* Collapse Button (Sticky Sidebar) */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                aria-label="Collapse details"
                                aria-controls="case-study-details"
                                aria-expanded={isExpanded}
                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-accent transition-colors px-3 pt-4 border-t border-white/10 w-full"
                            >
                                <ChevronUp size={14} />
                                Collapse Details
                            </button>
                        </div>
                    </aside>
                )}

                {/* MAIN CONTENT COLUMN */}
                <div className="flex-1 min-w-0 space-y-12 lg:pb-32">

                    {/* HERO / OVERVIEW SECTION - ALWAYS VISIBLE */}
                    <Section id="overview" className="mt-0 space-y-8">
                        {/* Mobile Metadata (Visible only on Mobile) */}
                        {isMobile && (
                            <div className="grid grid-cols-2 gap-4 mb-8 bg-white/5 p-5 rounded-2xl border border-white/10">
                                {caseStudy.role && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role</p>
                                        <p className="text-sm text-white font-medium">{caseStudy.role[language]}</p>
                                    </div>
                                )}
                                {caseStudy.duration && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timeline</p>
                                        <p className="text-sm text-white font-medium">{caseStudy.duration[language]}</p>
                                    </div>
                                )}
                                {caseStudy.team && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Team</p>
                                        <p className="text-sm text-white font-medium">{caseStudy.team[language]}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {caseStudy.tldr && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
                                    <div className="absolute top-0 right-0 p-8 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
                                    <div className="flex items-center gap-2 mb-3 text-red-400 relative z-10">
                                        <AlertTriangle size={16} />
                                        <h4 className="font-bold text-xs uppercase tracking-wide">Problem</h4>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed text-balance relative z-10">{caseStudy.tldr.problem[language]}</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
                                    <div className="absolute top-0 right-0 p-8 bg-brand-accent/10 rounded-full blur-xl group-hover:bg-brand-accent/20 transition-colors"></div>
                                    <div className="flex items-center gap-2 mb-3 text-brand-accent relative z-10">
                                        <Lightbulb size={16} />
                                        <h4 className="font-bold text-xs uppercase tracking-wide">Solution</h4>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed text-balance relative z-10">{caseStudy.tldr.solution[language]}</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                                    <div className="flex items-center gap-2 mb-3 text-green-400 relative z-10">
                                        <Check size={16} />
                                        <h4 className="font-bold text-xs uppercase tracking-wide">Result</h4>
                                    </div>
                                    <p className="text-sm text-white font-medium leading-relaxed text-balance relative z-10">{caseStudy.tldr.result[language]}</p>
                                </div>
                            </motion.div>
                        )}
                    </Section>

                    {/* EXPAND BUTTON */}
                    {!isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 border-t border-white/5 mt-8"
                        >
                            <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                                Want to dive deeper into the process, decisions, and technical details?
                            </p>
                            <button
                                onClick={handleExpand}
                                aria-expanded={isExpanded}
                                aria-controls="case-study-details"
                                className="group relative px-8 py-3 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    View Full Case Study <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </motion.div>
                    )}

                    {/* EXPANDABLE CONTENT */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                id="case-study-details"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="overflow-hidden space-y-20"
                            >
                                {/* DIVIDER */}
                                <div className="flex items-center gap-4 opacity-30 py-4">
                                    <div className="h-px bg-white flex-1"></div>
                                    <span className="text-xs uppercase tracking-[0.3em]">Deep Dive</span>
                                    <div className="h-px bg-white flex-1"></div>
                                </div>

                                {/* CONTEXT & CONSTRAINTS */}
                                {(caseStudy.context || caseStudy.constraints) && (
                                    <Section id="context" title="Context & Constraints">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-lg text-gray-300 leading-relaxed font-light">
                                                    {caseStudy.context?.[language]}
                                                </p>
                                            </div>
                                            {caseStudy.constraints && (
                                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
                                                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                                        Key Constraints
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {caseStudy.constraints.map((item: any, idx) => (
                                                            <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                                                <Minus className="shrink-0 mt-1 opacity-50" size={12} />
                                                                {typeof item === 'string' ? item : item[language]}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </Section>
                                )}

                                {/* CHALLENGE */}
                                {caseStudy.challenge && (
                                    <Section id="challenge" title="The Challenge">
                                        <div className="relative group pl-6 border-l-2 border-brand-accent/30">
                                            <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-3xl">
                                                {caseStudy.challenge[language]}
                                            </p>
                                        </div>
                                    </Section>
                                )}

                                {/* SOLUTION */}
                                {caseStudy.solution && (
                                    <Section id="solution" title="The Solution">
                                        <div className="relative group pl-6 border-l-2 border-green-500/30">
                                            <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-3xl">
                                                {caseStudy.solution[language]}
                                            </p>
                                        </div>
                                    </Section>
                                )}

                                {/* PROCESS */}
                                {caseStudy.process && caseStudy.process.length > 0 && (
                                    <Section id="process" title="Design Process">
                                        <div className="space-y-12">
                                            {caseStudy.process.map((step, idx) => (
                                                <div key={idx} className="relative pl-8 md:pl-12 group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 group-last:bottom-auto group-last:h-full"></div>
                                                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-brand-accent ring-4 ring-black"></div>

                                                    <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-3">
                                                        <span className="text-brand-accent/50 text-sm font-mono">0{idx + 1}</span>
                                                        {step.phase}
                                                    </h4>
                                                    <p className="text-gray-400 leading-relaxed max-w-2xl">
                                                        {step.description[language]}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* KEY DECISIONS */}
                                {caseStudy.keyDecisions && caseStudy.keyDecisions.length > 0 && (
                                    <Section id="decisions" title="Key Decisions">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {caseStudy.keyDecisions.map((decision, idx) => (
                                                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 duration-300">
                                                    <h4 className="text-lg font-bold text-white mb-3">
                                                        {decision.title[language]}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm leading-relaxed">
                                                        {decision.rationale[language]}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* RESULTS & IMPACT */}
                                <Section id="results" title="Results & Impact">
                                    <div className="bg-gradient-to-br from-brand-accent/10 to-purple-900/10 border border-brand-accent/20 rounded-3xl p-8 md:p-10 mb-8">
                                        <h4 className="text-xl font-serif font-bold text-white mb-4">Outcome</h4>
                                        <p className="text-lg text-gray-200 leading-relaxed font-light mb-8 max-w-3xl">
                                            {caseStudy.results[language]}
                                        </p>

                                        {caseStudy.impact && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {caseStudy.impact.map((metric, idx) => (
                                                    <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                                        <div className="text-brand-accent mb-2">
                                                            <Target size={18} />
                                                        </div>
                                                        <p className="text-sm font-bold text-white">{metric}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Learnings & What Next */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {caseStudy.learnings && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Learnings</h4>
                                                <ul className="space-y-3">
                                                    {caseStudy.learnings.map((item: any, idx) => (
                                                        <li key={idx} className="flex gap-3 text-gray-400 text-sm">
                                                            <Zap className="shrink-0 text-yellow-500 mt-0.5" size={14} />
                                                            <span>{typeof item === 'string' ? item : item[language]}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {caseStudy.tools && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Stack</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {caseStudy.tools.map((tool, idx) => (
                                                        <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 font-mono">
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Section>

                                {/* CTA / COLLAPSE - FOOTER */}
                                <div className="border-t border-white/10 pt-16 flex flex-col items-center text-center pb-8">
                                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                        <button
                                            onClick={() => window.location.href = 'mailto:victorhfduarte@gmail.com'}
                                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                                            role="button"
                                        >
                                            Book a Call <ArrowRight size={18} />
                                        </button>
                                        <button
                                            onClick={onNextProject}
                                            className="px-8 py-3 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors"
                                            role="button"
                                        >
                                            View Next Project
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsExpanded(false);
                                            // Optional: Scroll back to overview?
                                            document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        aria-controls="case-study-details"
                                        aria-expanded={isExpanded}
                                        className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2"
                                    >
                                        <ChevronUp size={16} />
                                        Collapse Details
                                    </button>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
};

export default CaseStudySection;
