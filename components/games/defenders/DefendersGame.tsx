
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameStatus, Ship, Bullet, Enemy, EnemyType, Particle, Star, MathProblem, PowerUp, PowerUpType, Boss } from './types';
import { GAME_CONFIG, ENEMY_VARIANTS } from './constants';
import { generateMathProblem, generateDistractor } from './services/mathService';
import { audioService } from './services/audioService';
import { Trophy, Volume2, VolumeX, ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const GameCanvas: React.FC = () => {
  // -- React State for UI Overlay --
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);

  // Game Configuration State
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [selectedOps, setSelectedOps] = useState<('+' | '-' | 'x' | '÷')[]>(['+']);

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
  const powerUpsRef = useRef<PowerUp[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);

  // Power-up States
  const tripleShotTimerRef = useRef<number>(0);

  // Input State
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef<{ x: number }>({ x: 0 });

  // -- Load High Score --
  useEffect(() => {
    const saved = localStorage.getItem('defenders_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // -- Audio Sync --
  useEffect(() => {
    audioService.setMusicState(status);
  }, [status]);

  // -- Initialization --
  const initGame = useCallback(() => {
    // Validate config before starting
    if (selectedOps.length === 0) {
      setSelectedOps(['+']);
    }

    audioService.init();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setScore(0);
    setLives(3);
    setStatus('PLAYING');
    setFeedbackEffect(null);
    shakeRef.current = 0;

    // Initial problem generation using config
    const problem = generateMathProblem({
      difficulty,
      operators: selectedOps.length > 0 ? selectedOps : ['+']
    });
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
    powerUpsRef.current = [];
    bossRef.current = null;
    particlesRef.current = [];
    tripleShotTimerRef.current = 0;
    gameTimeRef.current = 0;

    // Init Parallax Stars (Deep Space)
    const stars: Star[] = [];
    // Deep background nebula clouds (simulated with large faint stars)
    for (let i = 0; i < 20; i++) stars.push(createStar(canvas.width, canvas.height, 0.05, 100, 0.05));
    // Far layer
    for (let i = 0; i < 200; i++) stars.push(createStar(canvas.width, canvas.height, 0.2, 1.5, 1));
    // Mid layer
    for (let i = 0; i < 80; i++) stars.push(createStar(canvas.width, canvas.height, 0.5, 2, 1));
    // Close layer (fast)
    for (let i = 0; i < 30; i++) stars.push(createStar(canvas.width, canvas.height, 1.2, 3, 1));

    starsRef.current = stars;
  }, [difficulty, selectedOps]);

  const createStar = (w: number, h: number, speedMod: number, sizeBase: number, alpha: number): Star => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: speedMod,
    size: Math.random() * sizeBase + 0.5,
    speed: (Math.random() * 0.5 + 0.2) * speedMod,
    brightness: Math.random() * 0.5 * alpha + 0.5 * alpha,
  });

  const toggleMute = () => {
    const newState = audioService.toggleMute();
    setIsMuted(newState);
  };

  const toggleOp = (op: '+' | '-' | 'x' | '÷') => {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev; // Must have at least one
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  };

  const triggerFeedback = (type: 'CORRECT' | 'WRONG') => {
    setFeedbackEffect(type);
    setTimeout(() => setFeedbackEffect(null), 300); // Reset after animation

    if (type === 'WRONG') {
      shakeRef.current = 20; // Intense shake
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
    const handleTouchMove = (e: TouchEvent) => {
      if (canvasRef.current && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        // e.preventDefault(); // Prevent scrolling - might need passive: false
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const createExplosion = (x: number, y: number, colors: string[], count: number = 20) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      // Provide a default color if colors array is empty or undefined
      const color = colors && colors.length > 0
        ? colors[Math.floor(Math.random() * colors.length)]
        : '#ffffff';

      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        radius: 0,
        size: Math.random() * 4 + 2,
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

    const diff = targetX - shipRef.current.x;
    shipRef.current.x += diff * GAME_CONFIG.SHIP_LERP;

    shipRef.current.tilt = Math.max(-0.4, Math.min(0.4, diff * 0.02));

    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) shipRef.current.x -= GAME_CONFIG.SHIP_SPEED;
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) shipRef.current.x += GAME_CONFIG.SHIP_SPEED;

    shipRef.current.x = Math.max(shipRef.current.radius, Math.min(canvas.width - shipRef.current.radius, shipRef.current.x));

    // Update Propulsion Trail (Plasma effect)
    shipRef.current.trail.unshift({
      x: shipRef.current.x + (Math.random() - 0.5) * 5,
      y: shipRef.current.y + 20,
      width: 12 + Math.random() * 4,
      alpha: 1.0
    });
    if (shipRef.current.trail.length > 25) shipRef.current.trail.pop();
    shipRef.current.trail.forEach(t => {
      t.y += 3;
      t.width *= 0.85;
      t.alpha -= 0.08;
    });

    // 2. Shooting
    if (shipRef.current.cooldown > 0) shipRef.current.cooldown--;
    if (shipRef.current.cooldown <= 0) {
      if (keysRef.current['Space'] || keysRef.current['KeyK'] || mouseRef.current.x > 0) { // Auto-fire or key press
        const createBullet = (vx: number, vy: number, angle: number = 0) => ({
          x: shipRef.current.x,
          y: shipRef.current.y - shipRef.current.height / 2,
          vx, vy,
          radius: 4,
          color: GAME_CONFIG.COLORS.BULLET,
          active: true,
          angle
        });

        bulletsRef.current.push(createBullet(0, -GAME_CONFIG.BULLET_SPEED));

        // Triple Shot Logic
        if (tripleShotTimerRef.current > 0) {
          bulletsRef.current.push(createBullet(-2, -GAME_CONFIG.BULLET_SPEED * 0.9, -0.2));
          bulletsRef.current.push(createBullet(2, -GAME_CONFIG.BULLET_SPEED * 0.9, 0.2));
        }

        shipRef.current.cooldown = GAME_CONFIG.FIRE_COOLDOWN;
        audioService.playShoot();
      }
    }

    if (tripleShotTimerRef.current > 0) tripleShotTimerRef.current--;

    // 3. Update Bullets
    bulletsRef.current.forEach(b => {
      b.y += b.vy;
      if (b.y < 0) b.active = false;
    });
    bulletsRef.current = bulletsRef.current.filter(b => b.active);

    // 4. Boss Logic
    if (!bossRef.current && score > 0 && score % 500 === 0 && score !== 0) { // Spawn boss every 500 points
      bossRef.current = {
        id: 'BOSS',
        type: 'HEAVY', // Reusing heavy type for base props/types
        x: canvas.width / 2,
        y: -100,
        vx: 3,
        vy: 1,
        width: 120, height: 120, radius: 60,
        color: '#ef4444',
        health: 20 + Math.floor(score / 500) * 10,
        maxHealth: 20 + Math.floor(score / 500) * 10,
        phase: 1,
        active: true,
        value: 0,
        isCorrect: false,
        angle: 0, rotationSpeed: 0, initialX: canvas.width / 2, timeOffset: 0, glowColor: '#ff0000'
      };
      // Clear current problem to focus on boss? Or keep playing? Let's keep playing.
    }

    if (bossRef.current) {
      const boss = bossRef.current;

      // Movement Pattern
      if (boss.y < 100) boss.y += 2; // Enter scene
      else {
        boss.x += boss.vx;
        if (boss.x > canvas.width - 100 || boss.x < 100) boss.vx *= -1;
        boss.y = 100 + Math.sin(gameTimeRef.current * 0.05) * 20;
      }

      // Boss Collision (Bullet)
      bulletsRef.current.forEach(b => {
        if (!b.active) return;
        const dx = b.x - boss.x;
        const dy = b.y - boss.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < boss.radius + b.radius) {
          b.active = false;
          boss.health--;
          createExplosion(b.x, b.y, ['#ef4444', '#f87171'], 5);

          if (boss.health <= 0) {
            boss.active = false;
            // Boss Defeated
            createExplosion(boss.x, boss.y, ['#ef4444', '#f59e0b', '#ffffff'], 100);
            audioService.playCorrect(); // Big sound needed
            setScore(s => s + 500);
            bossRef.current = null;
          }
        }
      });
    }

    // 5. Update Enemies
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
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < shipRef.current.radius + e.radius) {
        e.active = false;
        // Ensure fallback color
        createExplosion(e.x, e.y, GAME_CONFIG.COLORS.PARTICLE_EXPLOSION || ['#fff'], 30);
        audioService.playExplosion();
        audioService.playWrong();
        triggerFeedback('WRONG');
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setStatus('GAME_OVER');
            audioService.playGameOver();
            // Save highscore
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('defenders_highscore', score.toString());
            }
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
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < b.radius + e.radius) {
          b.active = false;
          e.active = false;

          if (e.isCorrect) {
            createExplosion(e.x, e.y, ['#00ff00', '#ccffcc', '#ffffff'], 40); // Big explosion
            audioService.playCorrect();
            triggerFeedback('CORRECT');
            setScore(prev => prev + 10);
            // Generate NEW problem based on config
            const newProb = generateMathProblem({
              difficulty,
              operators: selectedOps
            });
            setCurrentProblem(newProb);

            enemiesRef.current.forEach(en => {
              en.active = false;
              createExplosion(en.x, en.y, ['#ffffff', '#aaaaaa'], 10);
            });

            // Chance to spawn PowerUp
            if (Math.random() < 0.15) { // 15% chance
              const types: PowerUpType[] = ['SHIELD', 'TRIPLE_SHOT', 'NUKE'];
              const type = types[Math.floor(Math.random() * types.length)];
              powerUpsRef.current.push({
                x: e.x,
                y: e.y,
                vx: 0,
                vy: 0,
                type,
                active: true,
                width: 30, height: 30, radius: 15,
                color: '#fff'
              });
            }
          } else {
            createExplosion(e.x, e.y, GAME_CONFIG.COLORS.PARTICLE_EXPLOSION || ['#fff'], 20);
            audioService.playExplosion();
            audioService.playWrong();
            triggerFeedback('WRONG');
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setStatus('GAME_OVER');
                audioService.playGameOver();
                // Save highscore
                if (score > highScore) {
                  setHighScore(score);
                  localStorage.setItem('defenders_highscore', score.toString());
                }
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
      p.life -= 0.02; // Slower fade
      if (p.life <= 0) p.active = false;
    });
    particlesRef.current = particlesRef.current.filter(p => p.active);

    // 7. Update PowerUps
    powerUpsRef.current.forEach(p => {
      p.y += 2; // Slowly fall down
      if (p.y > canvas.height + 50) p.active = false;

      // Collision with Ship
      const dx = shipRef.current.x - p.x;
      const dy = shipRef.current.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < shipRef.current.radius + 15) {
        p.active = false;
        audioService.playCorrect(); // Reuse sound or add new
        triggerFeedback('CORRECT');

        if (p.type === 'SHIELD') {
          setLives(l => Math.min(l + 1, 5));
        } else if (p.type === 'TRIPLE_SHOT') {
          tripleShotTimerRef.current = 600; // 10 seconds
        } else if (p.type === 'NUKE') {
          // Destroy all enemies
          enemiesRef.current.forEach(e => {
            e.active = false;
            createExplosion(e.x, e.y, GAME_CONFIG.COLORS.PARTICLE_EXPLOSION || ['#fff'], 20);
          });
          setScore(s => s + 50);
        }
      }
    });
    powerUpsRef.current = powerUpsRef.current.filter(p => p.active);

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

    // Improved Glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = e.glowColor || e.color;

    if (e.type === 'ASTEROID') {
      ctx.rotate(e.angle);
      ctx.fillStyle = '#1e293b';
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

      // Inner detail
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(-e.radius / 2, -e.radius / 2);
      ctx.lineTo(e.radius / 3, e.radius / 3);
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

    ctx.shadowBlur = 0;

    // Value Bubble
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = e.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Orbitron"';
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

    // -- Background --
    // Deep Space Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#050414'); // Very dark blue
    gradient.addColorStop(1, '#1e1b4b'); // Indigo 900
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
      ctx.fillStyle = s.z < 0.1 ? '#4c1d95' : '#ffffff'; // Faint stars are purple (nebula feel)
      ctx.beginPath();
      // Draw closer stars larger
      ctx.arc(s.x, s.y, s.size * s.z, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // -- Propultion Trail (Plasma) --
    ctx.globalCompositeOperation = 'lighter';
    shipRef.current.trail.forEach((t) => {
      if (t.alpha <= 0) return;
      ctx.fillStyle = `rgba(0, 243, 255, ${t.alpha})`; // Cyan core
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.width, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow layer for trail
      ctx.fillStyle = `rgba(147, 51, 234, ${t.alpha * 0.5})`; // Purple haze
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.width * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';

    // -- Ship --
    const { x, y, width, height, tilt } = shipRef.current;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Improved Neon Glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = GAME_CONFIG.COLORS.SHIP_GLOW;
    ctx.fillStyle = GAME_CONFIG.COLORS.SHIP;

    // Draw Ship Body (Futuristic Fighter)
    ctx.beginPath();
    ctx.moveTo(0, -height / 2); // Nose
    ctx.lineTo(width / 2.5, height / 3);
    ctx.lineTo(width / 1.8, height / 2); // Wing tip
    ctx.lineTo(width / 2.5, height / 2);
    ctx.lineTo(width / 3, height / 1.5); // Engine
    ctx.lineTo(-width / 3, height / 1.5);
    ctx.lineTo(-width / 2.5, height / 2);
    ctx.lineTo(-width / 1.8, height / 2);
    ctx.lineTo(-width / 2.5, height / 3);
    ctx.closePath();
    ctx.fill();

    // Engine Glow (Center)
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // -- Bullets --
    ctx.shadowBlur = 15;
    ctx.shadowColor = GAME_CONFIG.COLORS.BULLET_GLOW;
    ctx.fillStyle = GAME_CONFIG.COLORS.BULLET;
    bulletsRef.current.forEach(b => {
      ctx.beginPath();
      // Beam shape
      ctx.ellipse(b.x, b.y, b.radius, b.radius * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // -- Enemies --
    enemiesRef.current.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);

      ctx.shadowBlur = 0; // Disable shadow for better perf on many asteroids

      if (e.type === 'ASTEROID') {
        ctx.rotate(e.angle);
        // Rocky Texture
        ctx.fillStyle = '#334155'; // Darker Slate
        ctx.strokeStyle = '#94a3b8'; // Light Slate Edge
        ctx.lineWidth = 2;

        ctx.beginPath();
        // Irregular Polygon
        const r = e.radius;
        ctx.moveTo(r, 0);
        ctx.lineTo(r * 0.7, r * 0.5);
        ctx.lineTo(r * 0.2, r * 0.9);
        ctx.lineTo(-r * 0.4, r * 0.6);
        ctx.lineTo(-r * 0.9, r * 0.2);
        ctx.lineTo(-r * 0.6, -r * 0.4);
        ctx.lineTo(-r * 0.2, -r * 0.9);
        ctx.lineTo(r * 0.5, -r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Crator Detail
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.2, r * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(-e.angle);
      } else if (e.type === 'SCOUT') {
        // Fast Scout ship
        const tilt = Math.cos((gameTimeRef.current * 0.05) + e.timeOffset) * 0.2;
        ctx.rotate(tilt);

        ctx.shadowBlur = 10;
        ctx.shadowColor = e.glowColor || e.color;
        ctx.fillStyle = e.color;

        ctx.beginPath();
        ctx.moveTo(0, e.radius);
        ctx.lineTo(e.radius, -e.radius);
        ctx.lineTo(0, -e.radius * 0.5); // Notch
        ctx.lineTo(-e.radius, -e.radius);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(3, -10);
        ctx.lineTo(-3, -10);
        ctx.fill();

        ctx.rotate(-tilt);
      } else if (e.type === 'HEAVY') {
        // Heavy Tank
        ctx.shadowBlur = 15;
        ctx.shadowColor = e.glowColor || e.color;
        ctx.fillStyle = '#451a03'; // Dark Brown
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 3;

        ctx.beginPath();
        const r = e.radius;
        ctx.rect(-r, -r, r * 2, r * 2);
        ctx.fill();
        ctx.stroke();

        // Core
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Value Bubble Overlay (Keep readable)
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 16px "Orbitron"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.value.toString(), 0, 2);
      ctx.restore();
    });

    // -- PowerUps (Already good, slight tweak) --
    powerUpsRef.current.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const scale = 1 + Math.sin(gameTimeRef.current * 0.1) * 0.1;
      ctx.scale(scale, scale);

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';

      // Holographic Box effect
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(-15, -15, 30, 30);
      ctx.fill();
      ctx.stroke();

      if (p.type === 'SHIELD') {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', 0, 2);
      } else if (p.type === 'TRIPLE_SHOT') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(8, 8);
        ctx.lineTo(-8, 8);
        ctx.fill();
      } else if (p.type === 'NUKE') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2); // Ring
        ctx.stroke();
      }
      ctx.restore();
    });

    // -- Boss (MOTHER SHIP) --
    if (bossRef.current) {
      const b = bossRef.current;
      ctx.save();
      ctx.translate(b.x, b.y);

      // Boss Glow (Menacing Red)
      ctx.shadowBlur = 60;
      ctx.shadowColor = '#ef4444';

      // 1. Wings (Back Layer)
      ctx.fillStyle = '#450a0a'; // Dark Red
      ctx.beginPath();
      // Left Wing
      ctx.moveTo(0, 20);
      ctx.lineTo(-b.radius * 1.5, -b.radius * 0.5);
      ctx.lineTo(-b.radius * 0.8, -b.radius * 0.8);
      // Right Wing
      ctx.lineTo(b.radius * 0.8, -b.radius * 0.8);
      ctx.lineTo(b.radius * 1.5, -b.radius * 0.5);
      ctx.lineTo(0, 20);
      ctx.fill();

      // 2. Main Body (Front Layer)
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#7f1d1d'; // Lighter Dark Red
      ctx.beginPath();
      ctx.moveTo(0, b.radius); // Nose tip
      ctx.bezierCurveTo(b.radius * 0.5, b.radius * 0.5, b.radius, -b.radius * 0.5, b.radius * 0.8, -b.radius * 0.8);
      ctx.lineTo(-b.radius * 0.8, -b.radius * 0.8);
      ctx.bezierCurveTo(-b.radius, -b.radius * 0.5, -b.radius * 0.5, b.radius * 0.5, 0, b.radius);
      ctx.fill();

      // 3. Engine Thrusters
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fca5a5'; // Red-Orange Glow
      ctx.fillStyle = '#fff';
      [-0.4, 0.4].forEach(offset => {
        ctx.beginPath();
        ctx.arc(b.radius * offset, -b.radius * 0.7, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Core (The Eye)
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f87171'; // Iris
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Boss Health Bar (Cyberpunk Style)
      const hpPercent = b.health / b.maxHealth;
      const barW = 160;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(-barW / 2, -b.radius - 40, barW, 12); // BG
      ctx.fillStyle = '#ef4444'; // Red HP
      ctx.fillRect(-barW / 2 + 2, -b.radius - 38, (barW - 4) * hpPercent, 8);

      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.strokeRect(-barW / 2, -b.radius - 40, barW, 12);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 12px "Orbitron"';
      ctx.textAlign = 'center';
      ctx.fillText("MOTHER SHIP", 0, -b.radius - 45);

      ctx.restore();
    }

    // -- Particles --
    ctx.globalCompositeOperation = 'lighter';
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Pixel / Debris shape (Square)
      ctx.rect(p.x, p.y, p.size, p.size);
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
    <div className="relative w-full h-screen overflow-hidden bg-brand-dark cursor-none select-none font-display">

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 z-50 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>


      {/* Feedback Flash Overlay */}
      {feedbackEffect === 'CORRECT' && (
        <div className="absolute inset-0 bg-green-500/10 mix-blend-screen z-0 pointer-events-none animate-pulse"></div>
      )}
      {feedbackEffect === 'WRONG' && (
        <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay z-0 pointer-events-none animate-pulse"></div>
      )}

      {/* HUD Layer */}
      <div className="absolute top-0 left-0 w-full p-6 pointer-events-none z-10 flex flex-col h-full">
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full max-w-6xl mx-auto">

          {/* Health Bar (Cyberpunk) */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2 w-64 border border-cyan-500/20 bg-black/40 backdrop-blur-xl">
            <div className="flex justify-between items-center text-xs text-cyan-400 font-bold tracking-widest">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} />
                SHIELD INTEGRITY
              </div>
              <span className="font-mono">{Math.max(0, lives)}/3</span>
            </div>
            <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                initial={{ width: '100%' }}
                animate={{ width: `${(Math.max(0, lives) / 3) * 100}% ` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Question Display (Central Focus) */}
          {status === 'PLAYING' && currentProblem && (
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentProblem.question}
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <div className="glass-panel px-12 py-6 rounded-full border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.2)] bg-black/60 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="text-cyan-200 text-[10px] uppercase tracking-[0.3em] font-bold block text-center mb-1">Target Lock</span>
                  <span className="text-6xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] font-display">
                    {currentProblem.question} = ?
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Right Group */}
          <div className="flex items-center gap-4">
            <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4 text-white min-w-[160px] justify-center border border-yellow-500/20 bg-black/40">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-3xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                {score.toString().padStart(5, '0')}
              </span>
            </div>
            <button
              onClick={toggleMute}
              className="pointer-events-auto glass-panel p-4 rounded-2xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all border border-cyan-500/20"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <Link to="/" className="pointer-events-auto glass-panel px-4 py-2 rounded-xl text-white/50 hover:text-white text-xs font-bold tracking-widest border border-white/5 hover:bg-white/10 transition-colors">
              EXIT
            </Link>
          </div>
        </div>
      </div>

      {/* Main Menu Overlay */}
      <AnimatePresence>
        {status === 'MENU' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#050510]/80 backdrop-blur-xl"
          >
            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center max-w-2xl w-full border border-cyan-500/30 bg-black/40 relative overflow-hidden mx-4">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:1000px] [transform:rotateX(60deg) translateY(-100px)] opacity-50"></div>

              <div className="relative z-10 flex flex-col gap-8">
                <div>
                  <motion.div
                    className="relative inline-block"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2 font-display drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] leading-tight relative z-10">
                      DEFENDERS
                    </h1>
                    {/* Glitch Layer 1 */}
                    <h1 className="absolute top-0 left-0 text-6xl md:text-8xl font-black text-red-500 opacity-70 animate-pulse mix-blend-screen translate-x-[2px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', animationDuration: '2s' }}>
                      DEFENDERS
                    </h1>
                    {/* Glitch Layer 2 */}
                    <h1 className="absolute top-0 left-0 text-6xl md:text-8xl font-black text-blue-500 opacity-70 animate-pulse mix-blend-screen translate-x-[-2px]" style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', animationDuration: '3s' }}>
                      DEFENDERS
                    </h1>
                  </motion.div>
                  <p className="text-cyan-100/60 font-mono text-sm tracking-[0.3em] mt-2">NEURAL TRAINING v2.1</p>
                </div>

                {/* High Score Badge */}
                {highScore > 0 && (
                  <div className="mx-auto bg-amber-500/10 border border-amber-500/30 px-6 py-2 rounded-full flex items-center gap-2 mb-2">
                    <Trophy size={16} className="text-amber-400" />
                    <span className="text-amber-200 text-sm font-bold tracking-wider">HIGH SCORE: {highScore}</span>
                  </div>
                )}

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Difficulty */}
                  <div className="space-y-3">
                    <h3 className="text-cyan-300 text-xs font-bold tracking-widest uppercase ml-1">Difficulty Level</h3>
                    <div className="flex gap-2">
                      {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 py-3 rounded-xl border text-xs font-bold tracking-wider transition-all
                                        ${difficulty === d
                              ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'bg-black/40 text-cyan-500/50 border-cyan-500/10 hover:border-cyan-500/30'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operations */}
                  <div className="space-y-3">
                    <h3 className="text-purple-300 text-xs font-bold tracking-widest uppercase ml-1">Active Modules</h3>
                    <div className="flex gap-2">
                      {(['+', '-', 'x', '÷'] as const).map(op => (
                        <button
                          key={op}
                          onClick={() => toggleOp(op)}
                          className={`flex-1 aspect-square rounded-xl border text-lg font-bold transition-all flex items-center justify-center
                                        ${selectedOps.includes(op)
                              ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                              : 'bg-black/40 text-purple-500/50 border-purple-500/10 hover:border-purple-500/30'}`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                <button
                  onClick={initGame}
                  className="w-full group relative flex items-center justify-center gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-6 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                  <span className="font-display tracking-[0.2em] text-xl relative z-10">INITIATE MISSION</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {status === 'GAME_OVER' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/80 backdrop-blur-xl"
          >
            <div className="glass-panel border-2 border-red-500/30 p-12 rounded-[2.5rem] shadow-2xl text-center max-w-lg w-full relative overflow-hidden bg-black/50">

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50"
              >
                <ShieldAlert className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              </motion.div>

              <h2 className="text-5xl font-black text-white mb-2 font-display tracking-wide">CRITICAL FAILURE</h2>
              <p className="text-red-300/60 font-mono mb-8 uppercase tracking-widest text-sm">System integrity compromised</p>

              <div className="bg-black/60 rounded-2xl p-8 mb-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-2 font-bold">Final Score</p>
                <p className="text-6xl font-mono font-bold text-yellow-400 drop-shadow-lg">{score}</p>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center p-4 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-bold tracking-wider transition-all"
                >
                  ABORT
                </Link>
                <button
                  onClick={initGame}
                  className="flex-[2] flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 font-black py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-display tracking-widest">REBOOT SYSTEM</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default GameCanvas;
