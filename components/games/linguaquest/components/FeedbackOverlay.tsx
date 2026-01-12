import React from 'react';
import { DialogueOption } from '../types';
import { Check, X, ThumbsUp, Frown } from 'lucide-react';

import { soundService } from '../services/soundService';

interface FeedbackOverlayProps {
  option: DialogueOption;
  onNext: () => void;
  characterImage: string;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ option, onNext, characterImage }) => {
  const isPositive = option.scoreDelta >= 0;

  React.useEffect(() => {
    if (isPositive) {
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  }, [isPositive]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      {/* Main Comic Card */}
      <div className={`relative bg-white border-4 border-black rounded-3xl max-w-md w-full shadow-cartoon-lg overflow-visible animate-pop transform ${!isPositive && 'animate-shake'}`}>

        {/* Burst Header */}
        <div className="absolute -top-12 left-0 right-0 flex justify-center z-20">
          {isPositive ? (
            <div className="bg-green-500 text-white font-cartoon font-black text-3xl px-8 py-4 rounded-full border-4 border-black shadow-cartoon transform -rotate-3">
              AWESOME!
            </div>
          ) : (
            <div className="bg-red-500 text-white font-cartoon font-black text-3xl px-8 py-4 rounded-full border-4 border-black shadow-cartoon transform rotate-3">
              OOPS!
            </div>
          )}
        </div>

        <div className="pt-12 pb-8 px-8 text-center flex flex-col items-center">

          {/* Reaction Avatar Frame */}
          <div className={`w-24 h-24 rounded-full border-4 border-black overflow-hidden mb-4 bg-gray-100 relative ${isPositive ? 'animate-bounce' : ''}`}>
            <img src={characterImage} alt="Reaction" className="w-full h-full object-cover" />
            {/* Icon Overlay */}
            <div className={`absolute bottom-0 right-0 p-1 border-2 border-black rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}>
              {isPositive ? <ThumbsUp className="w-4 h-4 text-white" /> : <Frown className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="bg-slate-100 border-2 border-black/20 rounded-xl p-4 mb-6 w-full">
            <p className="font-bold text-slate-700 italic text-lg">"{option.feedback}"</p>
          </div>

          {/* Points Badge */}
          <div className={`text-2xl font-black mb-8 flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            <span className="text-4xl">{isPositive ? '+' : ''}{option.scoreDelta}</span>
            <span className="font-cartoon uppercase">Friendship</span>
          </div>

          {/* Continue Button */}
          <button
            onClick={onNext}
            className={`w-full font-black text-xl text-white py-4 rounded-xl border-4 border-black shadow-cartoon transition-transform hover:-translate-y-1 hover:shadow-cartoon-lg active:translate-y-0 active:shadow-cartoon ${isPositive ? 'bg-blue-500 hover:bg-blue-400' : 'bg-slate-600 hover:bg-slate-500'}`}
          >
            CONTINUE
          </button>

        </div>
      </div>

      {/* Confetti / Decor (CSS only) */}
      {isPositive && (
        <>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-float border-2 border-black"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float border-2 border-black" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float border-2 border-black" style={{ animationDelay: '1s' }}></div>
        </>
      )}

    </div>
  );
};

export default FeedbackOverlay;