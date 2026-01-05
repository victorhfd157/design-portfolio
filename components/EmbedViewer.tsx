import React, { useState } from 'react';
import { Maximize2, Play, Presentation, X } from 'lucide-react';

interface EmbedViewerProps {
    embedUrl: string;
    contentType: 'presentation' | 'video';
    title: string;
}

const EmbedViewer: React.FC<EmbedViewerProps> = ({ embedUrl, contentType, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
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

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <X className="text-red-400" size={32} />
                    </div>
                    <p className="text-gray-400 text-sm">
                        Não foi possível carregar o conteúdo embarcado.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black group/embed">
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-accent/10 border-2 border-brand-accent/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                            {contentType === 'presentation' ? (
                                <Presentation className="text-brand-accent" size={32} />
                            ) : (
                                <Play className="text-brand-accent" size={32} />
                            )}
                        </div>
                        <p className="text-gray-400 text-sm font-mono">
                            Carregando {contentType === 'presentation' ? 'apresentação' : 'vídeo'}...
                        </p>
                    </div>
                </div>
            )}

            {/* Iframe */}
            <iframe
                id="embed-iframe"
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={handleLoad}
                onError={handleError}
            />

            {/* Fullscreen Button */}
            <button
                onClick={handleFullscreen}
                className="absolute bottom-6 right-6 p-3 bg-black/60 hover:bg-brand-accent text-white rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 opacity-0 group-hover/embed:opacity-100 hover:scale-110 z-20"
                aria-label="Fullscreen"
                title="Tela cheia"
            >
                <Maximize2 size={20} />
            </button>

            {/* Content Type Badge */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs text-white font-mono flex items-center gap-2 shadow-lg z-20">
                {contentType === 'presentation' ? (
                    <>
                        <Presentation size={14} className="text-brand-accent" />
                        <span className="tracking-widest uppercase">Apresentação Interativa</span>
                    </>
                ) : (
                    <>
                        <Play size={14} className="text-brand-accent" />
                        <span className="tracking-widest uppercase">Vídeo</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmbedViewer;
