import React, { useState, useEffect, useRef } from 'react';
import { GameState, GamePhase, GameStats, MediumType, ScenarioResponse, ChoiceOption } from './types';
import { generateScenario, generateSceneryImage } from './services/geminiService';
import { StatBar } from './components/StatBar';
import { EmailInterface } from './components/EmailInterface';
import { MeetingInterface } from './components/MeetingInterface';
import { AlertTriangle, Terminal, CheckCircle2, XCircle, Play, Loader2, RefreshCw, Cpu, Globe, Power, Activity, Lock, ChevronRight } from 'lucide-react';

const INITIAL_STATS: GameStats = {
  morale: 75,
  profit: 75,
  reputation: 75
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.INTRO,
    stats: INITIAL_STATS,
    turnCount: 0,
    history: [],
    currentScenario: null
  });

  const [statChanges, setStatChanges] = useState<{morale: number, profit: number, reputation: number}>({ morale: 0, profit: 0, reputation: 0 });
  const [loadingText, setLoadingText] = useState("INITIALIZING...");

  const updateStats = (updates?: Partial<GameStats>) => {
    if (!updates) return;
    
    setGameState(prev => {
        const newStats = {
            morale: Math.max(0, Math.min(100, prev.stats.morale + (updates.morale || 0))),
            profit: Math.max(0, Math.min(100, prev.stats.profit + (updates.profit || 0))),
            reputation: Math.max(0, Math.min(100, prev.stats.reputation + (updates.reputation || 0)))
        };
        return { ...prev, stats: newStats };
    });

    setStatChanges({
        morale: updates.morale || 0,
        profit: updates.profit || 0,
        reputation: updates.reputation || 0
    });

    setTimeout(() => {
        setStatChanges({ morale: 0, profit: 0, reputation: 0 });
    }, 3000);
  };

  // Optimized Loader: Loads text first, then image in background
  const processTurn = async (stats: GameStats, turn: number, choice?: string) => {
    setLoadingText(choice ? "ANALYZING DECISION IMPACT..." : "DECRYPTING INCOMING STREAM...");
    setGameState(prev => ({ ...prev, phase: GamePhase.LOADING }));

    try {
        // 1. Get the narrative logic first (Fast)
        const scenario = await generateScenario(stats, turn, choice);

        // Update stats if this was a response to a choice
        if (scenario.statUpdates) {
             updateStats(scenario.statUpdates);
        }

        const isLoss = (stats.morale <= 0 || stats.profit <= 0 || stats.reputation <= 0) || scenario.isGameOver;
        const isWin = turn >= 8 && !isLoss;

        if (isLoss || isWin) {
             setGameState(prev => ({
                ...prev,
                turnCount: turn,
                history: [...prev.history, prev.currentScenario!].filter(Boolean) as ScenarioResponse[],
                currentScenario: scenario,
                phase: isLoss ? GamePhase.GAMEOVER : GamePhase.VICTORY
            }));
            return;
        }

        // 2. Set the state to PLAYING immediately so user can read
        setGameState(prev => ({
            ...prev,
            turnCount: turn,
            history: prev.currentScenario ? [...prev.history, prev.currentScenario] : [],
            currentScenario: scenario, // No image yet
            phase: GamePhase.PLAYING
        }));

        // 3. Fetch image in background and update state when ready (Visual Polish)
        generateSceneryImage(scenario.narrative, scenario.medium, scenario.senderName).then(imageUrl => {
            setGameState(current => {
                // Only update if we are still on the same scenario ID
                if (current.currentScenario?.scenarioId === scenario.scenarioId) {
                    return {
                        ...current,
                        currentScenario: { ...current.currentScenario, imageUrl }
                    };
                }
                return current;
            });
        });

    } catch (e) {
        console.error("Game Loop Error", e);
        // Fallback for errors
        setGameState(prev => ({ ...prev, phase: GamePhase.INTRO }));
    }
  };

  const handleStartGame = () => {
    processTurn(INITIAL_STATS, 1);
  };

  const handleOptionClick = (option: ChoiceOption) => {
    if (!gameState.currentScenario) return;
    processTurn(gameState.stats, gameState.turnCount + 1, option.text);
  };

  const renderContent = () => {
    if (gameState.phase === GamePhase.LOADING) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyan-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-cyan-300/50 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={32} className="text-cyan-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <div className="font-tech text-cyan-400 text-2xl tracking-[0.2em] uppercase mb-2 animate-pulse">{loadingText}</div>
                    <div className="text-slate-500 text-xs font-mono max-w-xs mx-auto">
                        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-ping"></span>
                        ESTABLISHING SECURE UPLINK...
                    </div>
                </div>
            </div>
        );
    }

    if (gameState.phase === GamePhase.INTRO) {
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center p-8 relative z-10">
                <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full"></div>
                
                <div className="bg-slate-900/90 p-12 rounded-lg border border-slate-700 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                     {/* Cyber decoration lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    
                    <div className="inline-flex items-center justify-center p-6 bg-slate-950 border border-slate-700 rounded-full mb-8 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                        <AlertTriangle size={64} className="text-cyan-500" />
                    </div>
                    
                    <h1 className="text-7xl font-bold mb-4 text-white tracking-tighter uppercase font-tech text-glow">
                        Crisis<span className="text-cyan-400">Command</span>
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4 mb-8 text-xs font-tech tracking-[0.3em] text-slate-500">
                        <span>SIMULATION_V2.4</span>
                        <span>•</span>
                        <span>CORPORATE_WARFARE</span>
                        <span>•</span>
                        <span>TACTICAL_RPG</span>
                    </div>

                    <p className="text-xl text-slate-300 mb-12 leading-relaxed font-light max-w-2xl mx-auto border-l-2 border-cyan-500/30 pl-6 text-left">
                        Welcome, Director. The company is in freefall. <br/>
                        Every decision you make impacts stock price, public opinion, and the loyalty of your team.
                        <br/><br/>
                        <span className="text-cyan-400 font-bold">Objective:</span> Survive 8 weeks without being fired or bankrupting the firm.
                    </p>

                    <button 
                        onClick={handleStartGame}
                        className="relative group px-12 py-6 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center gap-4 mx-auto border border-cyan-400 overflow-hidden clip-path-slant"
                    >
                         <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s] duration-0 group-hover:bg-[position:200%_0,0_0] group-hover:duration-[1500ms]"></div>
                        <Power size={24} className="group-hover:text-white transition-colors" /> 
                        <span className="tracking-[0.2em] font-tech z-10">INITIATE_PROTOCOL</span>
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    if (gameState.phase === GamePhase.GAMEOVER || gameState.phase === GamePhase.VICTORY) {
        const isVictory = gameState.phase === GamePhase.VICTORY;
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center p-8 animate-in zoom-in duration-500">
                <div className={`p-10 rounded-full mb-8 shadow-[0_0_60px_rgba(0,0,0,0.6)] border-4 bg-slate-950 ${isVictory ? 'border-emerald-500 text-emerald-500 shadow-emerald-500/20' : 'border-red-500 text-red-500 shadow-red-500/20'}`}>
                    {isVictory ? <CheckCircle2 size={80} /> : <XCircle size={80} />}
                </div>
                <h1 className={`text-6xl font-bold mb-4 font-tech uppercase tracking-widest text-glow ${isVictory ? 'text-emerald-400' : 'text-red-500'}`}>
                    {isVictory ? "Mission Accomplished" : "Terminated"}
                </h1>
                
                <div className="w-full max-w-2xl bg-slate-900/80 p-8 border border-slate-700 mb-8 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${isVictory ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="block text-xs text-slate-500 mb-4 uppercase tracking-widest text-left flex items-center gap-2">
                        <Terminal size={12} /> Final Report Summary
                    </span>
                    <p className="text-lg text-slate-200 leading-relaxed font-mono text-left">
                        {gameState.currentScenario?.gameOverReason || (isVictory ? "Crisis successfully contained. Board approval rating: HIGH." : "Executive override initiated. Employment terminated.")}
                    </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-12">
                    {Object.entries(gameState.stats).map(([key, value]) => (
                         <div key={key} className="bg-slate-900/80 p-4 border border-slate-700 flex flex-col items-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{key}</div>
                            <div className={`text-3xl font-bold font-tech ${isVictory ? 'text-emerald-400' : 'text-red-400'}`}>{value}</div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => window.location.reload()}
                    className="group px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold transition-all flex items-center gap-3 font-tech uppercase tracking-wider hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> 
                    System Reboot
                </button>
            </div>
        );
    }

    // PLAYING STATE
    const scenario = gameState.currentScenario!;

    return (
        <div className="flex flex-col h-full gap-4 pb-2">
            {/* Feedback from previous turn */}
            {scenario.feedback && (
                <div className="bg-slate-900/90 border-l-4 border-cyan-500 p-4 shadow-xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
                    <div className="flex items-start gap-3">
                         <div className="p-2 bg-cyan-950/50 rounded border border-cyan-500/30 text-cyan-400 mt-1">
                            <Terminal size={16} />
                         </div>
                         <div>
                            <span className="font-bold text-cyan-500 font-tech uppercase tracking-wider text-xs block mb-1">Status Update // T-{gameState.turnCount - 1}</span> 
                            <p className="text-slate-300 text-sm leading-relaxed">{scenario.feedback}</p>
                         </div>
                    </div>
                </div>
            )}

            {/* Main Interaction Area */}
            <div className="flex-1 min-h-0 relative bg-black border border-slate-700/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header Strip */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 opacity-50"></div>
                
                <div className="flex-1 relative overflow-hidden">
                    {scenario.medium === MediumType.MEETING ? (
                        <MeetingInterface 
                            sender={scenario.senderName}
                            role={scenario.senderRole}
                            content={scenario.content}
                            imageUrl={scenario.imageUrl}
                        />
                    ) : (
                        <EmailInterface 
                            sender={scenario.senderName}
                            role={scenario.senderRole}
                            subject={scenario.title}
                            content={scenario.content}
                            imageUrl={scenario.imageUrl}
                        />
                    )}
                </div>
            </div>

            {/* Decision Panel - Styled as command deck */}
            <div className="bg-slate-900/95 border-t border-slate-700 p-4 md:p-6 relative backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-px bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                
                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <div className="bg-cyan-500/10 p-1.5 rounded border border-cyan-500/20">
                             <Activity size={14} className="text-cyan-400 animate-pulse" />
                        </div>
                        <span className="text-cyan-500 text-xs font-tech uppercase tracking-[0.2em] font-bold">Awaiting Command Input</span>
                    </div>
                    <div className="text-slate-600 text-[10px] font-mono">
                        TURN_CYCLE: {gameState.turnCount} / 8
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {scenario.options.map((option, idx) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            className="group text-left p-5 bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-cyan-900/20"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8">
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-slate-800 to-transparent opacity-50 group-hover:from-cyan-900 transition-colors"></div>
                                <div className="absolute top-2 right-2 text-slate-600 font-tech text-xl font-bold group-hover:text-cyan-400 transition-colors">0{idx + 1}</div>
                            </div>
                            
                            {/* Hover Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-cyan-500 transition-all duration-300"></div>
                            
                            <h3 className="font-bold text-slate-200 mb-1 group-hover:text-cyan-400 font-tech text-lg uppercase tracking-wide transition-colors">{option.text}</h3>
                            <p className="text-xs md:text-sm text-slate-500 group-hover:text-slate-400 pr-8 transition-colors leading-relaxed">{option.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Sidebar / HUD */}
        <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex shrink-0 z-20 relative shadow-[10px_0_40px_rgba(0,0,0,0.5)]">
             {/* Logo Area */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cyan-400">
                    <div className="p-2 border border-cyan-500/30 bg-cyan-500/10 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-lg tracking-widest font-tech uppercase leading-none">Crisis</div>
                        <div className="font-bold text-lg tracking-widest font-tech uppercase leading-none text-slate-100">Command</div>
                    </div>
                </div>
            </div>

            {/* Stats Area */}
            <div className="p-6 space-y-8 overflow-y-auto flex-1">
                <div>
                    <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Activity size={12} /> Live Telemetry
                    </h2>
                    <StatBar label="Team Morale" value={gameState.stats.morale} type="morale" change={statChanges.morale} />
                    <StatBar label="Profitability" value={gameState.stats.profit} type="profit" change={statChanges.profit} />
                    <StatBar label="Reputation" value={gameState.stats.reputation} type="reputation" change={statChanges.reputation} />
                </div>

                {/* Info Block */}
                {gameState.phase === GamePhase.PLAYING && (
                    <div className="bg-slate-900/50 p-4 border border-slate-800 text-xs font-tech space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-20">
                            <Cpu size={40} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">SYS.STATUS</span>
                            <span className="text-emerald-500 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">OPTIMAL</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">NET.UPLINK</span>
                            <span className="text-cyan-500 flex items-center gap-1">
                                <Lock size={10} /> ENCRYPTED
                            </span>
                        </div>
                        <div className="h-px bg-slate-800/50 my-2"></div>
                        <div className="text-slate-400 text-[10px] leading-relaxed opacity-70">
                            Warning: Corporate espionage detected in sector 7. Maintain vigilance.
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Panel */}
            <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/30">
                 <div className="flex items-center gap-3 text-slate-500 text-xs font-tech">
                    <Globe size={14} className="text-cyan-800" />
                    <span className="opacity-50">SECURE CONNECTION ESTABLISHED</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse ml-auto shadow-[0_0_5px_#10b981]"></div>
                 </div>
            </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-14 bg-slate-950/90 backdrop-blur flex items-center px-4 border-b border-slate-800 z-50 justify-between shadow-lg">
             <div className="flex items-center gap-2 text-cyan-500">
                <AlertTriangle size={18} />
                <span className="font-bold tracking-wider font-tech uppercase">CrisisCMD</span>
            </div>
             <div className="flex gap-3 text-xs font-tech">
                <div className="flex items-center gap-1">
                    <span className="text-slate-500">M:</span>
                    <span className={gameState.stats.morale < 30 ? 'text-red-500' : 'text-emerald-500'}>{gameState.stats.morale}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <span className="text-slate-500">P:</span>
                    <span className={gameState.stats.profit < 30 ? 'text-red-500' : 'text-emerald-500'}>{gameState.stats.profit}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <span className="text-slate-500">R:</span>
                    <span className={gameState.stats.reputation < 30 ? 'text-red-500' : 'text-emerald-500'}>{gameState.stats.reputation}</span>
                </div>
            </div>
        </div>

        {/* Main Viewport */}
        <main className="flex-1 h-full overflow-hidden relative p-2 md:p-6 pt-16 md:pt-6 flex flex-col">
            <div className="flex-1 max-w-6xl mx-auto w-full h-full relative">
                 {/* This container holds the main game screen */}
                {renderContent()}
            </div>
        </main>
    </div>
  );
}