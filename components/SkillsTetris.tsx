import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, RotateCw, Trophy, Sparkles } from 'lucide-react';
import { SKILLS_DATA } from '../constants';

// --- Constants & Types ---
const COLS = 10;
const ROWS = 16; // Shorter height for better UI fit
const BLOCK_SIZE = 24; // Base unit for calculations

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
}

const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400', type: 'I' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500', type: 'J' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500', type: 'L' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400', type: 'O' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500', type: 'S' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500', type: 'T' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500', type: 'Z' },
};

const RANDOM_TETROMINO = () => {
  const keys = Object.keys(TETROMINOS) as TetrominoType[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[randKey];
};

const SkillsTetris: React.FC = () => {
  // Game State
  const [grid, setGrid] = useState<(string | null)[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][], color: string, x: number, y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  
  // Refs for loop management
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);
  const dropInterval = 1000; // 1 second drop speed

  // --- Game Logic ---

  const spawnPiece = useCallback(() => {
    const piece = RANDOM_TETROMINO();
    setCurrentPiece({
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(COLS / 2) - Math.ceil(piece.shape[0].length / 2),
      y: 0
    });
  }, []);

  const checkCollision = (piece: any, gridData: any, offsetX: number, offsetY: number) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;

          if (newX < 0 || newX >= COLS || newY >= ROWS) return true; // Wall/Floor
          if (newY >= 0 && gridData[newY][newX]) return true; // Existing block
        }
      }
    }
    return false;
  };

  const solidyPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newGrid = [...grid.map(row => [...row])];
    let collision = false;

    // Lock piece
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const gridY = currentPiece.y + y;
          const gridX = currentPiece.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            newGrid[gridY][gridX] = currentPiece.color;
          } else {
             collision = true; // Game over condition roughly
          }
        }
      });
    });

    if (collision || currentPiece.y <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        return;
    }

    // Check lines
    let clearedCount = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== null)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(COLS).fill(null));
        clearedCount++;
        y++; // Check same row again
      }
    }

    if (clearedCount > 0) {
      setLinesCleared(prev => prev + clearedCount);
      setScore(prev => prev + (clearedCount * 100));
      
      // Unlock a random skill
      const randomSkill = SKILLS_DATA[Math.floor(Math.random() * SKILLS_DATA.length)].name;
      setUnlockedSkills(prev => [randomSkill, ...prev].slice(0, 3)); // Keep last 3
    }

    setGrid(newGrid);
    spawnPiece();
  }, [currentPiece, grid, spawnPiece]);

  const move = useCallback((dirX: number, dirY: number) => {
    if (!currentPiece || gameOver || !isPlaying) return;

    if (!checkCollision(currentPiece, grid, dirX, dirY)) {
      setCurrentPiece(prev => prev ? ({ ...prev, x: prev.x + dirX, y: prev.y + dirY }) : null);
    } else if (dirY > 0) {
      // Hit bottom or block while moving down
      solidyPiece();
    }
  }, [currentPiece, grid, gameOver, isPlaying, solidyPiece]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || !isPlaying) return;
    
    // Rotate matrix
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );

    const testPiece = { ...currentPiece, shape: rotatedShape };
    
    // Wall kick (basic)
    let offset = 0;
    if (checkCollision(testPiece, grid, 0, 0)) {
        if (!checkCollision(testPiece, grid, -1, 0)) offset = -1;
        else if (!checkCollision(testPiece, grid, 1, 0)) offset = 1;
        else return; // Can't rotate
    }

    setCurrentPiece(prev => prev ? ({ ...prev, shape: rotatedShape, x: prev.x + offset }) : null);
  }, [currentPiece, grid, gameOver, isPlaying]);

  // --- Game Loop ---
  const gameLoop = (time: number) => {
    if (!isPlaying || gameOver) return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;

    if (dropCounterRef.current > dropInterval) {
      move(0, 1);
      dropCounterRef.current = 0;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isPlaying, gameOver, move]);

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowUp': rotate(); break;
        case ' ': rotate(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, move, rotate]);


  const startGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setScore(0);
    setLinesCleared(0);
    setGameOver(false);
    setIsPlaying(true);
    setUnlockedSkills([]);
    spawnPiece();
    lastTimeRef.current = performance.now();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center font-mono">
      
      {/* Game Container */}
      <div className="relative p-4 bg-gray-900 rounded-xl border-4 border-white/10 shadow-2xl">
         {/* Glass Overlay for Glow */}
         <div className="absolute inset-0 rounded-xl shadow-[0_0_50px_rgba(99,102,241,0.2)] pointer-events-none"></div>

        {/* Board */}
        <div 
          className="relative bg-black/80 grid gap-[1px] border border-white/5"
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: '260px', // Fixed width for stability
            height: '420px'
          }}
        >
          {/* Render Grid */}
          {grid.map((row, y) => 
            row.map((cellColor, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`w-full h-full transition-colors duration-200 ${cellColor || 'bg-white/5'}`}
                style={{
                  boxShadow: cellColor ? 'inset 0 0 5px rgba(0,0,0,0.5)' : 'none'
                }}
              />
            ))
          )}

          {/* Render Current Piece */}
          {currentPiece && currentPiece.shape.map((row, y) => 
            row.map((val, x) => {
              if (val) {
                const gridX = currentPiece.x + x;
                const gridY = currentPiece.y + y;
                // Only render if within bounds
                if (gridY >= 0 && gridX >= 0) {
                    return (
                        <div 
                            key={`piece-${x}-${y}`}
                            className={`absolute w-[10%] h-[6.25%] ${currentPiece.color} border border-black/20`}
                            style={{
                                left: `${gridX * 10}%`,
                                top: `${gridY * 6.25}%`,
                            }}
                        />
                    )
                }
              }
              return null;
            })
          )}

          {/* Overlays */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                <Sparkles className="text-brand-accent mb-4 animate-spin-slow" size={48} />
                <h3 className="text-white font-bold text-xl mb-2">SKILL BLOCKS</h3>
                <p className="text-gray-400 text-xs mb-6 text-center max-w-[200px]">Organize os blocos para desbloquear habilidades.</p>
                <button 
                  onClick={startGame}
                  className="px-6 py-2 bg-brand-accent text-white rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                  <Play size={16} /> START
                </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                <Trophy className="text-yellow-400 mb-4" size={48} />
                <h3 className="text-white font-bold text-2xl mb-2">GAME OVER</h3>
                <p className="text-gray-200 text-sm mb-6">Score: {score}</p>
                <button 
                  onClick={startGame}
                  className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={16} /> RESTART
                </button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
            <div className="col-start-2">
                <button className="w-full h-12 bg-white/10 rounded-lg flex items-center justify-center active:bg-brand-accent" onClick={() => rotate()}><RotateCw size={20}/></button>
            </div>
            <div className="col-start-1 row-start-2">
                <button className="w-full h-12 bg-white/10 rounded-lg flex items-center justify-center active:bg-brand-accent" onClick={() => move(-1, 0)}><ChevronLeft size={20}/></button>
            </div>
            <div className="col-start-2 row-start-2">
                <button className="w-full h-12 bg-white/10 rounded-lg flex items-center justify-center active:bg-brand-accent" onClick={() => move(0, 1)}><ChevronDown size={20}/></button>
            </div>
            <div className="col-start-3 row-start-2">
                <button className="w-full h-12 bg-white/10 rounded-lg flex items-center justify-center active:bg-brand-accent" onClick={() => move(1, 0)}><ChevronRight size={20}/></button>
            </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full max-w-[250px] flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Score</h4>
            <p className="text-4xl font-gothic text-white">{score}</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/10 min-h-[150px]">
            <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Unlocked Skills</h4>
            <div className="space-y-3">
                {unlockedSkills.length === 0 ? (
                    <p className="text-gray-600 text-sm italic">Complete lines to reveal skills...</p>
                ) : (
                    unlockedSkills.map((skill, i) => (
                        <div key={i} className="animate-fade-in flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                            <span className="text-white text-sm font-bold">{skill}</span>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="hidden md:block text-gray-500 text-xs space-y-1">
            <p>⬆️ Rotate</p>
            <p>⬅️ ➡️ Move</p>
            <p>⬇️ Drop</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsTetris;