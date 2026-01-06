import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadProjects } from '../utils/projectLoader';
import ProjectCard from './ProjectCard';
import { Project } from '../types';
import { X, Calendar, Layers, Sparkles, ChevronLeft, ChevronRight, Image as ImageIcon, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import EmbedViewer from './EmbedViewer';

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const activeCategoryState = useState('All');
  const [activeCategory, setActiveCategory] = activeCategoryState;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [viewMode, setViewMode] = useState<'prototype' | 'gallery'>('gallery');

  useEffect(() => {
    loadProjects().then(setProjects);
  }, []);

  // Generate unique categories list automatically
  const categories = useMemo(() => {
    const allCategories = projects.flatMap(p => p.categories);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [projects]);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.categories.includes(activeCategory));

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    // Default to prototype if available, otherwise gallery
    if (project.embedUrl) {
      setViewMode('prototype');
    } else {
      setViewMode('gallery');
    }
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  };

  const handleCloseModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedProject(null);
      setCurrentImageIndex(0);
      setViewMode('gallery');
    }, 500);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedProject) {
      const gallery = selectedProject.gallery && selectedProject.gallery.length > 0
        ? selectedProject.gallery
        : [selectedProject.imageUrl];
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    }
  }, [selectedProject]);

  const prevImage = useCallback(() => {
    if (selectedProject) {
      const gallery = selectedProject.gallery && selectedProject.gallery.length > 0
        ? selectedProject.gallery
        : [selectedProject.imageUrl];
      setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    }
  }, [selectedProject]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject, handleCloseModal, nextImage, prevImage]);

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const scrollTop = e.currentTarget.scrollTop;
      // Parallax effect
      imageRef.current.style.transform = `scale(1.1) translateY(${scrollTop * 0.05}px)`;
    }
  };

  const currentImageUrl = selectedProject
    ? (selectedProject.gallery && selectedProject.gallery.length > 0
      ? selectedProject.gallery[currentImageIndex]
      : selectedProject.imageUrl)
    : '';

  const galleryImages = selectedProject
    ? (selectedProject.gallery && selectedProject.gallery.length > 0
      ? selectedProject.gallery
      : [selectedProject.imageUrl])
    : [];

  return (
    <div id="works" className="pt-32 pb-20 bg-[#050505] relative min-h-screen overflow-hidden">
      {/* Enhanced Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:justify-between md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6 animate-fade-in group">
              <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-brand-accent/20 transition-colors duration-300">
                <Sparkles size={14} className="text-brand-accent" />
              </div>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.2em]">{t.gallery.portfolio_year}</span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter animate-fade-in delay-100">
              <span className="font-gothic block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-400 filter drop-shadow-lg">{t.gallery.selected}</span>
              <span className="font-serif italic font-light block md:ml-20 text-gray-200">{t.gallery.works}</span>
            </h2>
          </div>

          {/* Categories Filter - Sticky on all devices */}
          <div className="sticky top-24 z-30 -mx-4 sm:mx-0">
            <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-4 md:pb-0 pt-2 px-4 sm:px-0 scrollbar-hide w-full md:w-auto max-w-full md:max-w-2xl justify-start md:justify-end animate-fade-in delay-200">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden group border
                    ${activeCategory === category
                      ? 'text-white border-brand-accent bg-brand-accent/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                      : 'text-gray-400 border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }
                    backdrop-blur-md
                  `}
                >
                  <span className="relative z-10">{category === 'All' ? t.gallery.all : category}</span>
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-brand-accent/10 -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.05,
                }}
                onClick={() => handleOpenProject(project)}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-[2rem] mt-8 bg-white/[0.02]">
            <p className="text-gray-500 text-xl font-serif italic">{t.gallery.empty}</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/90 backdrop-blur-2xl"
              onClick={handleCloseModal}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative w-full h-full sm:h-[90vh] md:max-w-7xl bg-[#0a0a0a] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border-0 sm:border border-white/10 group"
            >
              {/* Modal Content */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>

              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg hover:rotate-90"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Left Image Section (Carousel) or Embed Viewer */}
              <div className="w-full md:w-7/12 h-[40vh] md:h-full relative bg-black overflow-hidden group/gallery">

                {/* View Switcher (Prototype vs Gallery) */}
                {selectedProject.embedUrl && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-black/50 backdrop-blur-md rounded-full border border-white/10 p-1 shadow-xl">
                    <button
                      onClick={() => setViewMode('prototype')}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${viewMode === 'prototype' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Monitor size={14} />
                      <span>{selectedProject.contentType === 'video' ? 'Video' : 'Live Demo'}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('gallery')}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${viewMode === 'gallery' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <ImageIcon size={14} />
                      <span>Gallery</span>
                    </button>
                  </div>
                )}

                {/* Conditional Rendering based on viewMode */}
                {viewMode === 'prototype' && selectedProject.embedUrl ? (
                  // Render Embed Viewer for presentations/videos/prototypes
                  <EmbedViewer
                    embedUrl={selectedProject.embedUrl}
                    contentType={selectedProject.contentType}
                    title={selectedProject.title}
                  />
                ) : (
                  // Render Image Gallery
                  <div className="w-full h-full relative">
                  // Render Image Gallery (existing functionality)
                    <>
                      {/* Main Image */}
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          ref={imageRef}
                          key={currentImageUrl}
                          src={currentImageUrl}
                          alt={selectedProject.title}
                          className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out will-change-transform animate-fade-in"
                          style={{ transform: 'scale(1.05)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a] pointer-events-none opacity-80"></div>
                      </div>

                      {/* Navigation Arrows */}
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-brand-accent/90 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover/gallery:opacity-100 transform -translate-x-4 group-hover/gallery:translate-x-0 hover:scale-110"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-brand-accent/90 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover/gallery:opacity-100 transform translate-x-4 group-hover/gallery:translate-x-0 hover:scale-110"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}

                      {/* Thumbnails Bar */}
                      {galleryImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full z-20 transition-all duration-300 transform translate-y-20 group-hover/gallery:translate-y-0 hover:bg-black/60">
                          {galleryImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-brand-accent scale-110 shadow-lg shadow-brand-accent/20' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Image Counter Badge */}
                      {galleryImages.length > 1 && (
                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs text-white font-mono flex items-center gap-2 shadow-lg">
                          <ImageIcon size={14} className="text-brand-accent" />
                          <span className="tracking-widest">{currentImageIndex + 1} / {galleryImages.length}</span>
                        </div>
                      )}
                    </>
                  </div>
                )}
              </div>

              {/* Right Content Section */}
              <div
                className="w-full md:w-5/12 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-[#0a0a0a] to-[#050505]"
                onScroll={handleModalScroll}
              >
                <div className="mb-auto">
                  <div className="flex items-center gap-3 mb-8">
                    {selectedProject.categories.map(cat => (
                      <span key={cat} className="px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
                    {selectedProject.title}
                  </h3>

                  <div className="flex items-center gap-8 text-gray-400 font-mono text-xs mb-12 border-b border-white/10 pb-8 uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white/5 border border-white/5">
                        <Calendar size={14} className="text-brand-accent" />
                      </div>
                      <span>{selectedProject.year}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white/5 border border-white/5">
                        <Layers size={14} className="text-brand-accent" />
                      </div>
                      <span>{t.gallery.case_study}</span>
                    </div>
                  </div>

                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-gray-300 font-light leading-loose text-lg mb-8 first-letter:text-5xl first-letter:font-serif first-letter:text-brand-accent first-letter:mr-3 first-letter:float-left">
                      {selectedProject.description[language]}
                    </p>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 bg-brand-accent/5 rounded-full blur-2xl"></div>
                      <p className="text-gray-400 font-light text-sm leading-relaxed italic relative z-10">
                        "{t.gallery.description_prefix}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags Section - Visual Pills */}
                <div className="pt-12 mt-12 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Sparkles size={12} className="text-brand-accent" />
                    {t.gallery.tech_stack}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-mono uppercase tracking-wider hover:bg-brand-accent/20 hover:border-brand-accent/30 hover:text-white transition-all duration-300 cursor-default hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;