import React, { useState } from 'react';
import { GameState, Scenario, PlayerStats, DialogueOption } from './types';
import { LOST_TOURIST_SCENARIO } from './data/initialScenario';
import GameScene from './components/GameScene';
import FeedbackOverlay from './components/FeedbackOverlay';
import SummaryScreen from './components/SummaryScreen';
import { Play } from 'lucide-react';

import { soundService } from './services/soundService';

function LinguaQuestGame() {
  // State
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(LOST_TOURIST_SCENARIO);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    history: []
  });
  const [lastSelectedOption, setLastSelectedOption] = useState<DialogueOption | null>(null);

  // Actions
  const startGame = () => {
    soundService.playClick();
    setNodeIndex(0);
    setStats({ score: 0, correctAnswers: 0, totalQuestions: 0, history: [] });
    setGameState(GameState.PLAYING);
  };

  const handleOptionSelect = (option: DialogueOption) => {
    soundService.playClick();
    const currentNode = currentScenario.nodes[nodeIndex];
    setLastSelectedOption(option);

    // Update Stats
    const newStats = { ...stats };
    newStats.score += option.scoreDelta;
    newStats.totalQuestions += 1;
    if (option.isCorrect) newStats.correctAnswers += 1;
    newStats.history.push({
      nodeId: currentNode.id,
      wasCorrect: option.isCorrect,
      choiceText: option.text
    });
    setStats(newStats);

    setGameState(GameState.FEEDBACK);
  };

  const handleNextNode = () => {
    if (nodeIndex + 1 < currentScenario.nodes.length) {
      setNodeIndex(prev => prev + 1);
      setGameState(GameState.PLAYING);
    } else {
      setGameState(GameState.SUMMARY);
    }
  };

  const loadDefaultScenario = () => {
    setCurrentScenario(LOST_TOURIST_SCENARIO);
    startGame();
  };

  // Render Logic
  return (
    <div className="w-full h-screen font-sans text-slate-800 overflow-hidden relative">

      {gameState === GameState.MENU && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-sky-100">

          {/* Cartoon Clouds Background Decoration */}
          <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-80 animate-float" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-40 right-20 w-32 h-16 bg-white rounded-full opacity-60 animate-float" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-20 bg-white rounded-full opacity-70 animate-float" style={{ animationDuration: '7s' }}></div>

          <div className="z-10 max-w-xl w-full text-center space-y-8 animate-pop">

            {/* Title Block */}
            <div className="space-y-2 transform -rotate-2">
              <h1 className="font-cartoon text-6xl md:text-7xl font-black text-yellow-400 tracking-wider text-outline drop-shadow-xl">
                LinguaQuest
              </h1>
              <div className="inline-block bg-pink-500 text-white font-bold px-4 py-1 rounded-full border-2 border-black shadow-cartoon-sm rotate-2">
                Cartoon Roleplay Adventure
              </div>
            </div>

            <div className="grid gap-6 w-full px-4 justify-center">
              {/* Default Play Card */}
              <button
                onClick={loadDefaultScenario}
                className="group relative bg-white border-4 border-black rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-cartoon-lg shadow-cartoon active:translate-y-1 active:shadow-none w-full max-w-sm mx-auto"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-cartoon text-2xl font-bold text-slate-800 group-hover:text-blue-600">Start Adventure</h3>
                    <p className="font-bold text-slate-500 text-sm">Scenario: A Lost Tourist</p>
                  </div>
                  <div className="bg-blue-400 border-2 border-black p-3 rounded-xl group-hover:rotate-12 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.FEEDBACK) && (
        <>
          <GameScene
            node={currentScenario.nodes[nodeIndex]}
            onOptionSelect={handleOptionSelect}
            currentScore={stats.score}
            totalNodes={currentScenario.nodes.length}
            currentNodeIndex={nodeIndex}
          />
          {gameState === GameState.FEEDBACK && lastSelectedOption && (
            <FeedbackOverlay
              option={lastSelectedOption}
              onNext={handleNextNode}
              characterImage={currentScenario.nodes[nodeIndex].characterImage}
            />
          )}
        </>
      )}

      {gameState === GameState.SUMMARY && (
        <SummaryScreen
          stats={stats}
          scenario={currentScenario}
          onRestart={startGame}
          onHome={() => setGameState(GameState.MENU)}
        />
      )}
    </div>
  );
}

export default LinguaQuestGame;