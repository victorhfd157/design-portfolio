import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Layers, Monitor, Image as ImageIcon } from 'lucide-react';
import { Project } from '../types';
import { getCategoryColor } from '../utils/categoryHelpers';
import EmbedViewer from './EmbedViewer';

interface MobileModalProps {
    project: Project;
    currentImageIndex: number;
    galleryImages: string[];
    currentImageUrl: string;
    showDetails: boolean;
    setShowDetails: (show: boolean) => void;
    nextImage: () => void;
    prevImage: () => void;
    setCurrentImageIndex: (index: number) => void;
    viewMode: 'prototype' | 'gallery';
    setViewMode: (mode: 'prototype' | 'gallery') => void;
    language: string;
}

const MobileProjectModal: React.FC<MobileModalProps> = ({
    project,
    currentImageIndex,
    galleryImages,
    currentImageUrl,
    showDetails,
    setShowDetails,
    nextImage,
    prevImage,
    setCurrentImageIndex,
    viewMode,
    setViewMode,
    language,
}) => {
    return (
        <div className="flex flex-col h-full relative">
            {/* Full Image Section */}
            <div className={`relative bg-black overflow-hidden transition-all duration-300 ${showDetails ? 'h-[45vh]' : 'h-[calc(100%-60px)]'}`}>
                {viewMode === 'prototype' && project.embedUrl ? (
                    <EmbedViewer
                        embedUrl={project.embedUrl}
                        contentType={project.contentType as 'presentation' | 'video'}
                        title={project.title}
                    />
                ) : (
                    <>
                        {/* Blurred Background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`${currentImageUrl}-blur`}
                                    src={currentImageUrl}
                                    alt=""
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover blur-3xl scale-125"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Main Image */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <motion.img
                                key={currentImageUrl}
                                src={currentImageUrl}
                                alt={project.title}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.15}
                                onDragEnd={(e, { offset }) => {
                                    if (offset.x > 50) prevImage();
                                    else if (offset.x < -50) nextImage();
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                            />
                        </div>

                        {/* Navigation Arrows - Enhanced */}
                        {galleryImages.length > 1 && (
                            <>
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/60 hover:bg-brand-accent text-white rounded-2xl transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-2xl z-30 group"
                                    whileHover={{ scale: 1.1, x: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft size={28} className="group-hover:scale-110 transition-transform" />
                                </motion.button>
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/60 hover:bg-brand-accent text-white rounded-2xl transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-2xl z-30 group"
                                    whileHover={{ scale: 1.1, x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronRight size={28} className="group-hover:scale-110 transition-transform" />
                                </motion.button>
                            </>
                        )}

                        {/* Image Counter - Premium Badge */}
                        {galleryImages.length > 1 && (
                            <motion.div
                                className="absolute top-4 left-4 px-4 py-2.5 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 text-sm text-white font-bold shadow-2xl z-20"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="text-brand-accent">{currentImageIndex + 1}</span>
                                <span className="text-white/50 mx-1.5">/</span>
                                <span className="text-white/80">{galleryImages.length}</span>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* View Switcher (Prototype vs Gallery) - Mobile Safe Position */}
            {project.embedUrl && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] flex bg-black/60 backdrop-blur-xl rounded-full border border-white/10 p-1 shadow-2xl pointer-events-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewMode('prototype');
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 cursor-pointer relative ${viewMode === 'prototype' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Monitor size={12} />
                        <span>Interactive</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewMode('gallery');
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 cursor-pointer relative ${viewMode === 'gallery' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ImageIcon size={12} />
                        <span>Gallery</span>
                    </button>
                </div>
            )}

            {/* THUMBNAILS STRIP - Mobile */}
            {!showDetails && galleryImages.length > 1 && viewMode === 'gallery' && (
                <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 px-4 z-40 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto">
                    {galleryImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                            className={`flex-shrink-0 relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-brand-accent scale-110 shadow-lg' : 'border-white/20 opacity-60'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Details Toggle Button - Premium Design */}
            <motion.button
                onClick={() => setShowDetails(!showDetails)}
                className="relative sticky bottom-0 w-full py-5 bg-gradient-to-r from-brand-accent via-purple-600 to-brand-accent bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 z-50 overflow-hidden group transition-all duration-500"
                whileTap={{ scale: 0.98 }}
            >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                {/* Icon */}
                <motion.div
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {showDetails ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    )}
                </motion.div>

                {/* Text */}
                <span className="relative z-10 drop-shadow-lg">
                    {showDetails ? 'Ver Apenas Imagem' : 'Ver Detalhes do Projeto'}
                </span>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
            </motion.button>

            {/* Bottom Sheet - Details */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 500) {
                                setShowDetails(false);
                            }
                        }}
                        className="absolute bottom-12 left-0 right-0 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-t-2 border-brand-accent/30 max-h-[50vh] overflow-y-auto z-40 shadow-[0_-10px_60px_rgba(99,102,241,0.3)]"
                    >
                        {/* Enhanced Drag Handle */}
                        <div className="sticky top-0 bg-gradient-to-b from-[#0f0f0f] to-transparent pt-4 pb-6 flex flex-col items-center z-50">
                            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-accent/50 via-brand-accent to-brand-accent/50 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-2"></div>
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Arraste para fechar</span>
                        </div>

                        <div className="px-6 pb-8">
                            {/* Categories with Enhanced Styling */}
                            <div className="flex items-center gap-2 mb-6 flex-wrap">
                                {project.categories.map((cat, idx) => (
                                    <motion.span
                                        key={cat}
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, type: 'spring' }}
                                        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getCategoryColor(cat)} backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider border border-white/30 shadow-lg hover:scale-105 transition-transform`}
                                    >
                                        {cat}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Title with Gradient */}
                            <h3 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-5 leading-tight">
                                {project.title}
                            </h3>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-gray-400 font-mono text-xs mb-6 pb-4 border-b border-white/10">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={12} /> {project.year}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Layers size={12} /> {project.categories[0]}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-base leading-relaxed mb-6">
                                {project.description[language]}
                            </p>

                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileProjectModal;
