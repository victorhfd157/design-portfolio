import React, { useEffect, useState } from 'react';
import { DialogueNode, DialogueOption } from '../types';
import { Heart, Star } from 'lucide-react';

import { soundService } from '../services/soundService';

interface GameSceneProps {
  node: DialogueNode;
  onOptionSelect: (option: DialogueOption) => void;
  currentScore: number;
  totalNodes: number;
  currentNodeIndex: number;
}

const GameScene: React.FC<GameSceneProps> = ({
  node,
  onOptionSelect,
  currentScore,
  totalNodes,
  currentNodeIndex
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);

  // Feedback State for Reaction System
  const [feedbackState, setFeedbackState] = useState<'neutral' | 'success' | 'error'>('neutral');

  useEffect(() => {
    // Reset to neutral when node changes
    setFeedbackState('neutral');
  }, [node]);

  // Helper to switch sprites based on state (mock implementation using filters/suffixes if files existed)
  // For now, we mainly use animation classes, but this setup allows swapping 'alex_base.png' to 'alex_happy.png' easily.
  const getCharacterSprite = (baseSrc: string, state: 'neutral' | 'success' | 'error') => {
    // Basic implementation: If we had "alex_happy.png", we'd swap it here.
    // For this specific prototype, only Alex has a "Confused" sprite which is his base.
    // We can simulate reactions via CSS animations which we added below.
    return baseSrc;
  };

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTextComplete(false);
    let i = 0;
    const speed = 30;

    // Play initial pop
    soundService.playPop();

    const timer = setInterval(() => {
      if (i < node.text.length) {
        setDisplayedText((prev) => prev + node.text.charAt(i));
        // Play faint typewriter click every few characters to avoid annoyance
        if (i % 3 === 0) soundService.playTypewriter();
        i++;
      } else {
        setIsTextComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [node]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none bg-sky-200">

      {/* Background Frame (The Stage) */}
      <div className="absolute inset-4 md:inset-8 bg-white border-4 border-black rounded-3xl overflow-hidden shadow-cartoon-lg z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${node.backgroundImage})`,
            filter: 'contrast(1.2) saturation(1.3) brightness(1.1)' // Make photos look more vivid/cartoonish
          }}
        >
          {/* Overlay pattern to unify art style */}
          <div className="absolute inset-0 bg-blue-900/10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>
        </div>
      </div>

      {/* Top HUD - Sticker Style */}
      <div className="absolute top-8 left-0 right-0 px-8 md:px-12 z-20 flex justify-between items-start pointer-events-none">

        {/* Score Badge */}
        <div className="bg-white text-slate-900 px-4 py-2 rounded-xl border-4 border-black shadow-cartoon flex items-center gap-2 transform -rotate-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
          <span className="font-cartoon font-black text-xl">{currentScore}</span>
        </div>

        {/* Progress Badge */}
        <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl border-4 border-black shadow-cartoon transform rotate-1">
          <span className="font-cartoon font-bold">Scene {currentNodeIndex + 1}/{totalNodes}</span>
        </div>
      </div>

      {/* Character Layer */}
      <div className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none pb-48 md:pb-52">
        <div className="relative animate-float" style={{ animationDuration: '4s' }}>
          {/* Character Sticker Glow */}
          <div className="absolute inset-0 bg-white blur-md opacity-50 transform scale-105 rounded-full"></div>
          <img
            src={getCharacterSprite(node.characterImage, feedbackState)}
            alt={node.characterName}
            className={`relative h-[50vh] md:h-[60vh] object-contain drop-shadow-xl transition-transform duration-300 ${feedbackState === 'error' ? 'animate-shake' : ''} ${feedbackState === 'success' ? 'animate-bounce' : ''}`}
            style={{
              filter: 'drop-shadow(0 0 4px white) drop-shadow(0 0 2px white)' // Sticker outline hack
            }}
          />
        </div>
      </div>

      {/* Bottom Area: Dialogue & Options */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-8 flex flex-col items-center">

        {/* Speech Bubble */}
        <div className="relative w-full max-w-4xl mb-6 group">

          {/* Character Name Tag */}
          <div className="absolute -top-5 left-8 bg-pink-500 text-white font-cartoon font-black tracking-wide px-4 py-1 rounded-lg border-2 border-black shadow-cartoon-sm z-40 transform -rotate-2">
            {node.characterName}
          </div>

          <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-cartoon-lg relative">
            {/* Bubble Tail */}
            <div className="absolute -top-4 left-1/2 w-8 h-8 bg-white border-l-4 border-t-4 border-black transform rotate-45 -translate-x-1/2 z-10"></div>
            {/* Hide bottom border of tail so it merges */}
            <div className="absolute top-0 left-1/2 w-12 h-4 bg-white transform -translate-x-1/2 z-20"></div>

            <p className="font-sans text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
              {displayedText}
              {!isTextComplete && <span className="inline-block w-3 h-3 bg-black rounded-full ml-1 animate-bounce"></span>}
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500 ${isTextComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          {node.options.map((option, idx) => {
            // Cyclical colors for buttons
            const colors = ['bg-blue-100 hover:bg-blue-200', 'bg-green-100 hover:bg-green-200', 'bg-yellow-100 hover:bg-yellow-200'];
            const btnColor = colors[idx % colors.length];

            return (
              <button
                key={idx}
                onClick={() => {
                  setFeedbackState(option.isCorrect ? 'success' : 'error');
                  onOptionSelect(option);
                }}
                className={`${btnColor} border-4 border-black rounded-2xl p-4 text-left shadow-cartoon transition-all duration-200 hover:-translate-y-2 hover:shadow-cartoon-lg active:translate-y-0 active:shadow-cartoon relative group`}
              >
                <div className="absolute -top-3 -left-3 bg-white border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-black shadow-sm group-hover:bg-yellow-400 transition-colors">
                  {idx + 1}
                </div>
                <span className="font-bold text-slate-800 text-lg leading-tight block mt-1">
                  {option.text}
                </span>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  );
};

export default GameScene;