import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadProjects } from '../utils/projectLoader';
import ProjectCard from './ProjectCard';
import { Project } from '../types';
import { X, Calendar, Layers, Sparkles, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
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
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  };

  const handleCloseModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedProject(null);
      setCurrentImageIndex(0);
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
    <div id="works" className="pt-32 pb-20 bg-[#050505] relative min-h-screen">
      {/* Background Noise */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:justify-between md:items-end gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles size={16} className="text-brand-accent" />
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.gallery.portfolio_year}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white leading-[0.9] sm:leading-[0.85] md:leading-[0.8] animate-fade-in delay-100">
              <span className="font-gothic block text-brand-accent">{t.gallery.selected}</span>
              <span className="font-serif italic font-light block sm:ml-8 md:ml-12 text-gray-200">{t.gallery.works}</span>
            </h2>
          </div>

          {/* Categories Filter - Sticky on all devices */}
          <div className="sticky top-24 z-30 -mx-4 sm:mx-0">
            <div className="flex overflow-x-auto md:flex-wrap gap-2 md:gap-4 pb-4 md:pb-0 pt-2 px-4 sm:px-0 scrollbar-hide w-full md:w-auto max-w-full md:max-w-2xl justify-start md:justify-end animate-fade-in delay-200">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 sm:px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 backdrop-blur-xl whitespace-nowrap overflow-hidden group border ${activeCategory === category
                    ? 'text-white border-brand-accent/50 bg-brand-accent/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white bg-[#050505]/80'
                    }`}
                >
                  {/* Hover shine effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out`}></div>
                  <span className="relative z-10">{category === 'All' ? t.gallery.all : category}</span>
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
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
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
          <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl mt-8">
            <p className="text-gray-500 text-xl font-serif italic">{t.gallery.empty}</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-[#050505]/95 backdrop-blur-xl transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={handleCloseModal}
          ></div>

          {/* Modal Container */}
          <div
            className={`relative w-full h-full sm:h-[90vh] md:max-w-7xl bg-[#0a0a0a] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border-0 sm:border border-white/10 group transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-95'
              }`}
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

              {/* Conditional Rendering: Embed Viewer or Image Gallery */}
              {selectedProject.embedUrl && (selectedProject.contentType === 'presentation' || selectedProject.contentType === 'video') ? (
                // Render Embed Viewer for presentations and videos
                <EmbedViewer
                  embedUrl={selectedProject.embedUrl}
                  contentType={selectedProject.contentType}
                  title={selectedProject.title}
                />
              ) : (
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
              )}
            </div>

            {/* Right Content Section */}
            <div
              className="w-full md:w-5/12 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-[#0a0a0a] to-[#050505]"
              onScroll={handleModalScroll}
            >
              <div className="mb-auto">
                <div className="flex items-center gap-3 mb-6">
                  {selectedProject.categories.map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono uppercase tracking-widest">
                      {cat}
                    </span>
                  ))}
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-[1.05] tracking-tight">
                  {selectedProject.title}
                </h3>

                <div className="flex items-center gap-8 text-gray-400 font-mono text-xs mb-12 border-b border-white/10 pb-8 uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/5">
                      <Calendar size={14} className="text-brand-accent" />
                    </div>
                    <span>{selectedProject.year}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/5">
                      <Layers size={14} className="text-brand-accent" />
                    </div>
                    <span>{t.gallery.case_study}</span>
                  </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 font-light leading-loose text-lg mb-8 first-letter:text-5xl first-letter:font-serif first-letter:text-brand-accent first-letter:mr-3 first-letter:float-left">
                    {selectedProject.description[language]}
                  </p>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-gray-400 font-light text-sm leading-relaxed italic">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;