import React, { useEffect, useState } from 'react';
import { soundService } from '../services/soundService';
import { Play, Lock, CheckCircle, MapPin } from 'lucide-react';

interface LevelMapProps {
    unlockedLevels: number; // 1, 2, or 3
    onSelectLevel: (levelId: number) => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ unlockedLevels, onSelectLevel }) => {
    const [animateStep, setAnimateStep] = useState(0);

    // Simple animation sequence on mount
    useEffect(() => {
        const timer = setInterval(() => {
            setAnimateStep(prev => prev + 1);
        }, 300);
        return () => clearInterval(timer);
    }, []);

    const levels = [
        { id: 1, name: "The Street", x: "15%", y: "45%", icon: MapPin },
        { id: 2, name: "Cozy Café", x: "50%", y: "60%", icon: CheckCircle }, // Shifted for "winding path" feel
        { id: 3, name: "Grand Hotel", x: "85%", y: "30%", icon: Lock }
    ];

    const handleLevelClick = (id: number) => {
        if (id <= unlockedLevels) {
            soundService.playClick();
            onSelectLevel(id);
        } else {
            soundService.playError();
        }
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-green-100 flex items-center justify-center">

            {/* Background Map Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
                style={{
                    backgroundImage: 'url(/games/linguaquest/map_london.png)',
                    filter: 'contrast(1.1) brightness(1.05)'
                }}
            ></div>

            {/* Title Overlay */}
            <div className="absolute top-8 left-0 right-0 text-center z-10 pointer-events-none">
                <h1 className="font-cartoon text-5xl md:text-6xl text-white text-outline drop-shadow-xl animate-float">
                    London Adventure
                </h1>
            </div>

            {/* Nodes */}
            <div className="absolute inset-0 z-20">
                {levels.map((level, index) => {
                    const isUnlocked = level.id <= unlockedLevels;
                    const isNext = level.id === unlockedLevels;

                    return (
                        <button
                            key={level.id}
                            onClick={() => handleLevelClick(level.id)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center group
                 ${animateStep > index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                 ${isUnlocked ? 'cursor-pointer hover:-translate-y-4' : 'cursor-not-allowed grayscale brightness-75'}
               `}
                            style={{ left: level.x, top: level.y }}
                        >
                            {/* Node Circle */}
                            <div className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-black shadow-cartoon 
                    flex items-center justify-center relative
                    ${isUnlocked ? 'bg-yellow-400 animate-pop' : 'bg-slate-300'}
                    ${isNext ? 'animate-bounce' : ''}
                `}>
                                {isUnlocked ? (
                                    <Play className="w-8 h-8 text-black fill-black ml-1" />
                                ) : (
                                    <Lock className="w-8 h-8 text-slate-500" />
                                )}

                                {/* Pulse Ring for active level */}
                                {isNext && (
                                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-ping opacity-75"></div>
                                )}
                            </div>

                            {/* Level Label */}
                            <div className={`mt-2 bg-white px-3 py-1 rounded-xl border-2 border-black shadow-cartoon-sm font-bold text-sm md:text-base whitespace-nowrap
                   ${isUnlocked ? 'text-slate-900 group-hover:scale-110' : 'text-slate-500'}
                   transition-transform
                `}>
                                {level.name}
                            </div>
                        </button>
                    );
                })}
            </div>

        </div>
    );
};

export default LevelMap;
