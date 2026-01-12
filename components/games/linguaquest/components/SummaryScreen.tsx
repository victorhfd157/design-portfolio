import React from 'react';
import { PlayerStats, Scenario } from '../types';
import { RefreshCw, Home, Star, Award } from 'lucide-react';

interface SummaryScreenProps {
  stats: PlayerStats;
  scenario: Scenario;
  onRestart: () => void;
  onHome: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ stats, scenario, onRestart, onHome }) => {
  const percentage = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  
  let grade = "C";
  let colorClass = "bg-red-500";
  let message = "Keep trying!";

  if (percentage >= 90) { grade = "S"; colorClass = "bg-yellow-400"; message = "Legendary!"; }
  else if (percentage >= 80) { grade = "A"; colorClass = "bg-green-500"; message = "Amazing!"; }
  else if (percentage >= 60) { grade = "B"; colorClass = "bg-blue-400"; message = "Good Job!"; }
  else { grade = "C"; colorClass = "bg-red-400"; message = "Don't give up!"; }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-yellow-50 overflow-y-auto">
      
      <div className="max-w-2xl w-full bg-white border-4 border-black rounded-3xl shadow-cartoon-lg p-6 md:p-10 relative animate-pop">
        
        {/* Paper Tape Decor */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-200 w-32 h-6 border-2 border-black/20 skew-x-12"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-cartoon text-4xl md:text-5xl font-black text-slate-800 text-outline uppercase">
            Level Complete!
          </h1>
          <p className="font-bold text-slate-500 mt-2">{scenario.title}</p>
        </div>

        {/* Main Stats Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
           
           {/* Big Grade Stamp */}
           <div className={`w-32 h-32 md:w-40 md:h-40 ${colorClass} rounded-full border-4 border-black flex items-center justify-center shadow-cartoon transform -rotate-6`}>
              <span className="font-cartoon font-black text-7xl md:text-8xl text-white text-outline">{grade}</span>
           </div>

           {/* Bars */}
           <div className="flex-1 w-full space-y-4">
              <div className="bg-slate-100 border-2 border-black rounded-xl p-4 flex justify-between items-center">
                 <span className="font-bold text-slate-700">Friendship Points</span>
                 <span className="font-black text-xl text-blue-600">{stats.score}</span>
              </div>
              
              <div className="bg-slate-100 border-2 border-black rounded-xl p-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-slate-700">Accuracy</span>
                   <span className="font-black text-slate-900">{stats.correctAnswers}/{stats.totalQuestions}</span>
                 </div>
                 <div className="h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colorClass}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                 </div>
              </div>
              
              <p className="text-center font-cartoon font-bold text-xl text-slate-800 mt-2">
                "{message}"
              </p>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button 
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 border-4 border-black text-slate-800 font-black py-4 rounded-2xl shadow-cartoon transition-transform active:translate-y-1 active:shadow-none"
          >
            <Home className="w-6 h-6" /> 
            <span className="hidden md:inline">MENU</span>
          </button>
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 border-4 border-black text-white font-black py-4 rounded-2xl shadow-cartoon transition-transform active:translate-y-1 active:shadow-none"
          >
            <RefreshCw className="w-6 h-6" /> 
            <span>REPLAY</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SummaryScreen;