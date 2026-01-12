
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameStatus, Ship, Bullet, Enemy, EnemyType, Particle, Star, MathProblem, TrailPoint } from '../types';
import { GAME_CONFIG, ENEMY_VARIANTS } from '../constants';
import { generateMathProblem, generateDistractor } from '../services/mathService';
import { audioService } from '../services/audioService';
import { Trophy, Play, RefreshCw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

const GameCanvas: React.FC = () => {
  // -- React State for UI Overlay --
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Feedback overlay state (css class trigger)
  const [feedbackEffect, setFeedbackEffect] = useState<'CORRECT' | 'WRONG' | null>(null);

  // -- Mutable Game State --
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const shakeRef = useRef<number>(0); // Screen shake intensity
  
  // Entities
  const shipRef = useRef<Ship>({
    x: 0, y: 0, vx: 0, vy: 0, 
    width: 40, height: 40, radius: 20, 
    color: GAME_CONFIG.COLORS.SHIP, cooldown: 0,
    trail: [], tilt: 0
  });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  
  // Input State
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef<{ x: number }>({ x: 0 });

  // -- Audio Sync --
  useEffect(() => {
    audioService.setMusicState(status);
  }, [status]);

  // -- Initialization --
  const initGame = useCallback(() => {
    audioService.init();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setScore(0);
    setLives(3);
    setStatus('PLAYING');
    setFeedbackEffect(null);
    shakeRef.current = 0;
    
    const problem = generateMathProblem(1);
    setCurrentProblem(problem);

    shipRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      vx: 0, vy: 0,
      width: 40, height: 40, radius: 20,
      color: GAME_CONFIG.COLORS.SHIP,
      cooldown: 0,
      trail: [],
      tilt: 0
    };
    bulletsRef.current = [];
    enemiesRef.current = [];
    particlesRef.current = [];
    gameTimeRef.current = 0;

    // Init Parallax Stars (3 Layers)
    const stars: Star[] = [];
    // Far layer (slow, small)
    for (let i = 0; i < 150; i++) stars.push(createStar(canvas.width, canvas.height, 0.2, 0.5));
    // Mid layer
    for (let i = 0; i < 60; i++) stars.push(createStar(canvas.width, canvas.height, 0.5, 1.0));
    // Close layer (fast, large)
    for (let i = 0; i < 20; i++) stars.push(createStar(canvas.width, canvas.height, 1.2, 2.0));
    
    starsRef.current = stars;
  }, []);

  const createStar = (w: number, h: number, speedMod: number, sizeMod: number): Star => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: speedMod,
    size: Math.random() * sizeMod + 0.5,
    speed: (Math.random() * 0.5 + 0.2) * speedMod,
    brightness: Math.random() * 0.5 + 0.5,
  });

  const toggleMute = () => {
      const newState = audioService.toggleMute();
      setIsMuted(newState);
  };

  const triggerFeedback = (type: 'CORRECT' | 'WRONG') => {
      setFeedbackEffect(type);
      setTimeout(() => setFeedbackEffect(null), 300); // Reset after animation
      
      if (type === 'WRONG') {
          shakeRef.current = 15; // Trigger screen shake
      }
  };

  // -- Input Handlers --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const createExplosion = (x: number, y: number, colors: string[]) => {
    for (let i = 0; i < GAME_CONFIG.PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        radius: 0, // unused
        size: Math.random() * 3 + 1,
        color: color,
        active: true,
      });
    }
  };

  const spawnEnemy = (canvasWidth: number, problem: MathProblem) => {
    const rand = Math.random() * 100;
    let type: EnemyType = 'ASTEROID';
    if (rand < ENEMY_VARIANTS.ASTEROID.WEIGHT) type = 'ASTEROID';
    else if (rand < ENEMY_VARIANTS.ASTEROID.WEIGHT + ENEMY_VARIANTS.SCOUT.WEIGHT) type = 'SCOUT';
    else type = 'HEAVY';

    const config = ENEMY_VARIANTS[type];
    const isCorrect = Math.random() > 0.6; 
    const existingCorrect = enemiesRef.current.find(e => e.isCorrect);
    const forceCorrect = !existingCorrect && Math.random() > 0.3;
    const finalIsCorrect = forceCorrect || isCorrect;
    const value = finalIsCorrect ? problem.answer : generateDistractor(problem.answer);
    
    let radius: number;
    if (type === 'ASTEROID') {
        const c = ENEMY_VARIANTS.ASTEROID;
        radius = c.RADIUS_MIN + Math.random() * (c.RADIUS_MAX - c.RADIUS_MIN);
    } else {
        // SCOUT and HEAVY
        const c = ENEMY_VARIANTS[type] as (typeof ENEMY_VARIANTS.SCOUT | typeof ENEMY_VARIANTS.HEAVY);
        radius = c.RADIUS;
    }
      
    const x = Math.random() * (canvasWidth - radius * 2) + radius;
    
    enemiesRef.current.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      x,
      y: -radius * 2,
      vx: 0,
      vy: Math.random() * (config.SPEED_MAX - config.SPEED_MIN) + config.SPEED_MIN,
      radius,
      color: config.COLOR,
      value,
      isCorrect: finalIsCorrect,
      active: true,
      angle: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      initialX: x,
      timeOffset: Math.random() * 1000,
      glowColor: config.GLOW
    });
  };

  // -- Game Loop --
  const update = useCallback((time: number) => {
    if (status !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    gameTimeRef.current++;

    // 0. Screen Shake Decay
    if (shakeRef.current > 0) {
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
    }

    // 1. Move Ship with Inertia (Lerp)
    const targetX = (mouseRef.current.x > 0 && mouseRef.current.x < canvas.width) 
        ? mouseRef.current.x 
        : shipRef.current.x;
    
    // Smooth movement towards mouse
    const diff = targetX - shipRef.current.x;
    shipRef.current.x += diff * GAME_CONFIG.SHIP_LERP;
    
    // Calculate tilt based on velocity
    shipRef.current.tilt = Math.max(-0.4, Math.min(0.4, diff * 0.02));

    // Keyboard Override (Direct Add)
    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) shipRef.current.x -= GAME_CONFIG.SHIP_SPEED;
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) shipRef.current.x += GAME_CONFIG.SHIP_SPEED;

    shipRef.current.x = Math.max(shipRef.current.radius, Math.min(canvas.width - shipRef.current.radius, shipRef.current.x));

    // Update Trail
    shipRef.current.trail.unshift({
        x: shipRef.current.x,
        y: shipRef.current.y + 15,
        width: 10,
        alpha: 1.0
    });
    if (shipRef.current.trail.length > 20) shipRef.current.trail.pop();
    // Decay trail
    shipRef.current.trail.forEach(t => {
        t.y += 2; // Drift down
        t.width *= 0.9;
        t.alpha -= 0.05;
    });

    // 2. Shooting
    if (shipRef.current.cooldown > 0) shipRef.current.cooldown--;
    if (shipRef.current.cooldown <= 0) {
      bulletsRef.current.push({
        x: shipRef.current.x,
        y: shipRef.current.y - shipRef.current.height / 2,
        vx: 0,
        vy: -GAME_CONFIG.BULLET_SPEED,
        radius: 3,
        color: GAME_CONFIG.COLORS.BULLET,
        active: true
      });
      shipRef.current.cooldown = GAME_CONFIG.FIRE_COOLDOWN;
      audioService.playShoot();
    }

    // 3. Update Bullets
    bulletsRef.current.forEach(b => {
      b.y += b.vy;
      if (b.y < 0) b.active = false;
    });
    bulletsRef.current = bulletsRef.current.filter(b => b.active);

    // 4. Update Enemies
    if (time - lastSpawnTimeRef.current > GAME_CONFIG.SPAWN_RATE_MS) {
      if (currentProblem) spawnEnemy(canvas.width, currentProblem);
      lastSpawnTimeRef.current = time;
    }

    enemiesRef.current.forEach(e => {
      e.y += e.vy;
      
      if (e.type === 'ASTEROID') {
        e.angle += e.rotationSpeed;
      } else if (e.type === 'SCOUT') {
        e.x = e.initialX + Math.sin((gameTimeRef.current * 0.05) + e.timeOffset) * 60;
        e.x = Math.max(e.radius, Math.min(canvas.width - e.radius, e.x));
      } else if (e.type === 'HEAVY') {
        e.x = e.initialX + Math.sin((gameTimeRef.current * 0.02) + e.timeOffset) * 10;
      }
      
      if (e.y > canvas.height + 50) e.active = false;

      // Collision: Ship vs Enemy
      const dx = shipRef.current.x - e.x;
      const dy = shipRef.current.y - e.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < shipRef.current.radius + e.radius) {
         e.active = false;
         createExplosion(e.x, e.y, GAME_CONFIG.COLORS.PARTICLE_EXPLOSION);
         audioService.playExplosion();
         audioService.playWrong();
         triggerFeedback('WRONG');
         setLives(prev => {
             const newLives = prev - 1;
             if (newLives <= 0) {
                 setStatus('GAME_OVER');
                 audioService.playGameOver();
             }
             return newLives;
         });
      }
    });

    // 5. Collision: Bullet vs Enemy
    bulletsRef.current.forEach(b => {
      if (!b.active) return;
      enemiesRef.current.forEach(e => {
        if (!e.active) return;
        
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < b.radius + e.radius) {
          b.active = false;
          e.active = false;
          
          if (e.isCorrect) {
            createExplosion(e.x, e.y, ['#00ff00', '#ffffff']);
            audioService.playCorrect();
            triggerFeedback('CORRECT');
            setScore(prev => prev + 10);
            const newProb = generateMathProblem(Math.floor(score / 50) + 1);
            setCurrentProblem(newProb);
             enemiesRef.current.forEach(en => {
                 en.active = false; 
                 createExplosion(en.x, en.y, ['#ffffff']);
             });
          } else {
            createExplosion(e.x, e.y, GAME_CONFIG.COLORS.PARTICLE_EXPLOSION);
            audioService.playExplosion();
            audioService.playWrong();
            triggerFeedback('WRONG');
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setStatus('GAME_OVER');
                    audioService.playGameOver();
                }
                return newLives;
            });
          }
        }
      });
    });

    enemiesRef.current = enemiesRef.current.filter(e => e.active);

    // 6. Update Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) p.active = false;
    });
    particlesRef.current = particlesRef.current.filter(p => p.active);

    // 7. Update Parallax Stars
    starsRef.current.forEach(s => {
      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    });

  }, [status, currentProblem, score]);

  // -- Drawing Logic --
  const drawEnemy = (ctx: CanvasRenderingContext2D, e: Enemy) => {
    ctx.save();
    ctx.translate(e.x, e.y);
    
    // Enemy Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = e.glowColor || e.color;

    if (e.type === 'ASTEROID') {
        ctx.rotate(e.angle);
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const sides = 7;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides;
            const irregularity = (i % 2 === 0 ? 0.8 : 1.0); 
            const r = e.radius * irregularity; 
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-e.angle);
    } else if (e.type === 'SCOUT') {
        const tilt = Math.cos((gameTimeRef.current * 0.05) + e.timeOffset) * 0.2;
        ctx.rotate(tilt);
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.moveTo(0, e.radius);
        ctx.lineTo(e.radius * 0.8, -e.radius);
        ctx.lineTo(0, -e.radius * 0.5);
        ctx.lineTo(-e.radius * 0.8, -e.radius);
        ctx.closePath();
        ctx.fill();
        ctx.rotate(-tilt);
    } else if (e.type === 'HEAVY') {
        ctx.fillStyle = '#78350f'; 
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const r = e.radius;
        ctx.moveTo(r * 0.5, r);
        ctx.lineTo(r, 0);
        ctx.lineTo(r * 0.5, -r);
        ctx.lineTo(-r * 0.5, -r);
        ctx.lineTo(-r, 0);
        ctx.lineTo(-r * 0.5, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    ctx.shadowBlur = 0; // Reset for text

    // Value Text
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Orbitron"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.value.toString(), 0, 2);
    
    ctx.restore();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // -- Background with Gradient --
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, GAME_CONFIG.COLORS.BACKGROUND_TOP);
    gradient.addColorStop(1, GAME_CONFIG.COLORS.BACKGROUND_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // -- Screen Shake Transform --
    ctx.save();
    if (shakeRef.current > 0) {
        const dx = (Math.random() - 0.5) * shakeRef.current;
        const dy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(dx, dy);
    }

    // -- Parallax Stars --
    starsRef.current.forEach(s => {
      ctx.globalAlpha = s.brightness;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      // Draw closer stars larger
      ctx.arc(s.x, s.y, s.size * s.z, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // -- Engine Trail --
    ctx.globalCompositeOperation = 'lighter'; // Additive blending
    shipRef.current.trail.forEach((t) => {
        if (t.alpha <= 0) return;
        ctx.fillStyle = `rgba(0, 243, 255, ${t.alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.width, 0, Math.PI*2);
        ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';

    // -- Ship --
    const { x, y, width, height, tilt } = shipRef.current;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    
    // Neon Glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = GAME_CONFIG.COLORS.SHIP_GLOW;
    ctx.fillStyle = GAME_CONFIG.COLORS.SHIP;
    
    // Draw Ship Body
    ctx.beginPath();
    ctx.moveTo(0, -height / 2); // Nose
    ctx.lineTo(width / 2, height / 2); 
    ctx.lineTo(0, height / 4); // Engine notch
    ctx.lineTo(-width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cockpit
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(5, 10);
    ctx.lineTo(-5, 10);
    ctx.fill();
    
    ctx.restore();

    // -- Bullets --
    ctx.shadowBlur = 10;
    ctx.shadowColor = GAME_CONFIG.COLORS.BULLET_GLOW;
    ctx.fillStyle = GAME_CONFIG.COLORS.BULLET;
    bulletsRef.current.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // -- Enemies --
    enemiesRef.current.forEach(e => drawEnemy(ctx, e));

    // -- Particles --
    ctx.globalCompositeOperation = 'lighter';
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    ctx.restore(); // End Shake

  }, []);

  // -- Main RAF Loop --
  useEffect(() => {
    const loop = (time: number) => {
      update(time);
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update, draw]);

  // -- Resize Handler --
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -- Component Render --
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 cursor-crosshair font-sans select-none">
      
      {/* Feedback Flash Overlay */}
      {feedbackEffect === 'CORRECT' && (
          <div className="absolute inset-0 bg-green-500/20 z-0 pointer-events-none animate-pulse"></div>
      )}
      {feedbackEffect === 'WRONG' && (
          <div className="absolute inset-0 bg-red-500/30 z-0 pointer-events-none animate-pulse"></div>
      )}

      {/* HUD Layer */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-10 flex flex-col h-full">
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full max-w-5xl mx-auto">
          
          {/* Health Bar (Modern) */}
          <div className="glass-panel p-3 rounded-xl flex flex-col gap-1 w-48">
             <div className="flex justify-between items-center text-xs text-cyan-300 font-display">
                 <span>SHIELD INTEGRITY</span>
                 <span>{Math.max(0, lives)}/3</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300" 
                    style={{ width: `${(Math.max(0, lives)/3)*100}%` }}
                 />
             </div>
          </div>

          {/* Question Display (Central Focus) */}
          {status === 'PLAYING' && currentProblem && (
             <div className="flex flex-col items-center animate-bounce-slight mt-2">
                <div className="glass-panel px-10 py-4 rounded-2xl border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    <span className="text-cyan-200 text-xs uppercase tracking-[0.2em] font-bold block text-center mb-1 font-display">Target Lock</span>
                    <span className="text-5xl font-black text-white tracking-widest font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                        {currentProblem.question} = ?
                    </span>
                </div>
             </div>
          )}

          {/* Right Group */}
          <div className="flex items-center gap-3">
              <div className="glass-panel p-3 rounded-xl flex items-center gap-3 text-white min-w-[140px] justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold font-display tracking-widest">{score.toString().padStart(5, '0')}</span>
              </div>
              <button 
                  onClick={toggleMute}
                  className="pointer-events-auto glass-panel p-3 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all"
              >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
          </div>
        </div>
      </div>

      {/* Main Menu Overlay */}
      {status === 'MENU' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050510]/90 backdrop-blur-sm">
          <div className="glass-panel p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-cyan-500/50">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2 font-display drop-shadow-lg">
              DEFENDERS
            </h1>
            <p className="text-cyan-100 text-lg mb-8 font-light tracking-wide">
              Neural Network Training Simulation <br/>
              <span className="text-sm opacity-70">Destroy asteroids matching the equation result.</span>
            </p>
            <button 
              onClick={initGame}
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Play className="w-6 h-6 fill-current" />
              <span className="font-display tracking-wider text-xl">INITIATE MISSION</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {status === 'GAME_OVER' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <div className="glass-panel border-2 border-red-500/50 p-10 rounded-3xl shadow-2xl text-center max-w-md w-full relative overflow-hidden">
            
            <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
            <h2 className="text-4xl font-black text-white mb-2 font-display">CRITICAL FAILURE</h2>
            
            <div className="bg-black/40 rounded-lg p-6 mb-8 border border-white/10">
                <p className="text-red-200 text-xs uppercase tracking-widest mb-1">Final Score</p>
                <p className="text-5xl font-mono font-bold text-yellow-400 drop-shadow-md">{score}</p>
            </div>
            
            <button 
              onClick={initGame}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-display">REBOOT SYSTEM</span>
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default GameCanvas;
