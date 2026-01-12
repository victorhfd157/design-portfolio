import React, { useState, useEffect } from 'react';
import { Maximize2, Play, Presentation, X, RotateCw, ExternalLink, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmbedViewerProps {
    embedUrl: string;
    contentType: 'presentation' | 'video';
    title: string;
}

const EmbedViewer: React.FC<EmbedViewerProps> = ({ embedUrl, contentType, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [key, setKey] = useState(0); // For forcing iframe reload

    useEffect(() => {
        // Hide interaction hint after 4 seconds
        const timer = setTimeout(() => setShowHint(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleReload = () => {
        setIsLoading(true);
        setHasError(false);
        setKey(prev => prev + 1); // Force iframe reload by changing key
    };

    const handleFullscreen = () => {
        const iframe = document.getElementById('embed-iframe') as HTMLIFrameElement;
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if ((iframe as any).webkitRequestFullscreen) {
                (iframe as any).webkitRequestFullscreen();
            } else if ((iframe as any).mozRequestFullScreen) {
                (iframe as any).mozRequestFullScreen();
            }
        }
    };

    const handleOpenExternal = () => {
        window.open(embedUrl, '_blank', 'noopener,noreferrer');
    };

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
                <div className="text-center p-8 max-w-md">
                    <motion.div
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <X className="text-red-400" size={40} />
                    </motion.div>
                    <h3 className="text-white font-bold text-lg mb-2">Erro ao Carregar</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Não foi possível carregar o conteúdo. Tente recarregar ou abrir em nova aba.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleReload}
                            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <RotateCw size={16} />
                            Recarregar
                        </button>
                        <button
                            onClick={handleOpenExternal}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/10"
                        >
                            <ExternalLink size={16} />
                            Abrir Externa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black group/embed overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10"></div>

            {/* Loading State with Shimmer */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="text-center">
                            {/* Animated Icon */}
                            <motion.div
                                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-purple-600/10 border-2 border-brand-accent/30 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {/* Shimmer Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                {contentType === 'presentation' ? (
                                    <Presentation className="text-brand-accent relative z-10" size={36} />
                                ) : (
                                    <Play className="text-brand-accent relative z-10" size={36} />
                                )}
                            </motion.div>

                            {/* Loading Text */}
                            <p className="text-white font-semibold text-base mb-2">
                                Carregando {contentType === 'presentation' ? 'Apresentação' : 'Vídeo'}
                            </p>
                            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">
                                Aguarde um momento...
                            </p>

                            {/* Loading Dots */}
                            <div className="flex gap-2 justify-center mt-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-brand-accent"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interaction Hint */}
            <AnimatePresence>
                {showHint && !isLoading && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="px-6 py-4 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <MousePointerClick className="text-brand-accent" size={24} />
                                </motion.div>
                                <div>
                                    <p className="text-white font-bold text-sm">Clique para Interagir</p>
                                    <p className="text-gray-400 text-xs">Use os controles abaixo para navegar</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Iframe with Border Gradient */}
            <div className="absolute inset-2 rounded-xl overflow-hidden border-2 border-white/10">
                <iframe
                    key={key}
                    id="embed-iframe"
                    src={embedUrl}
                    title={title}
                    className="w-full h-full border-0 bg-white"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={handleLoad}
                    onError={handleError}
                />
            </div>

            {/* Content Type Badge - Top Left */}
            <motion.div
                className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2.5 bg-black/70 backdrop-blur-xl rounded-full border border-white/20 text-xs text-white font-bold flex items-center gap-2 shadow-lg z-30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                {contentType === 'presentation' ? (
                    <>
                        <Presentation size={16} className="text-brand-accent" />
                        <span className="tracking-wider uppercase">Interativo</span>
                    </>
                ) : (
                    <>
                        <Play size={16} className="text-brand-accent" />
                        <span className="tracking-wider uppercase">Vídeo</span>
                    </>
                )}
                <motion.div
                    className="w-2 h-2 rounded-full bg-brand-accent"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Persistent Controls Bar - Bottom */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center justify-center gap-2 md:gap-3">
                    {/* Reload Button */}
                    <motion.button
                        onClick={handleReload}
                        className="p-3 md:p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl md:rounded-2xl backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center group/btn"
                        whileHover={{ y: -2 }}
                        title="Recarregar"
                    >
                        <RotateCw size={20} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                    </motion.button>

                    {/* Fullscreen Button - Prominent */}
                    <motion.button
                        onClick={handleFullscreen}
                        className="px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-brand-accent to-purple-600 hover:from-brand-accent/90 hover:to-purple-600/90 text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-accent/30 min-h-[48px] flex items-center gap-2"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Maximize2 size={20} />
                        <span className="hidden sm:inline">Tela Cheia</span>
                    </motion.button>

                    {/* External Link Button */}
                    <motion.button
                        onClick={handleOpenExternal}
                        className="p-3 md:p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl md:rounded-2xl backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
                        whileHover={{ y: -2 }}
                        title="Abrir em nova aba"
                    >
                        <ExternalLink size={20} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default EmbedViewer;
