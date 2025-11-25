import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, MousePointer2 } from 'lucide-react';
import { SKILLS_DATA } from '../constants';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
  category: string;
  mass: number;
}

const SkillsPhysics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, radius: 40 });
  const isDragging = useRef(false);

  // Physics Constants
  const GRAVITY = 0.4;
  const FRICTION = 0.98;
  const BOUNCE = 0.7;
  const MOUSE_REPEL_FORCE = 1.5;

  const initBalls = (width: number, height: number) => {
    const newBalls: Ball[] = SKILLS_DATA.map((skill) => {
      let color = '#6366f1'; // Default Indigo
      let category = 'Tech';

      // Assign colors based on implicit categories (matching previous logic)
      if (['Adobe', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere'].some(k => skill.name.includes(k))) {
        category = 'Design';
        color = '#ec4899'; // Pink
      } else if (['Liderança', 'Design Instrucional', 'E-learning', 'Educação', 'Branding'].some(k => skill.name.includes(k))) {
        category = 'Strategy';
        color = '#a855f7'; // Purple
      } else {
        category = 'Tech';
        color = '#06b6d4'; // Cyan
      }

      // Randomize start position (above screen)
      const radius = 35 + (skill.level / 100) * 15; // Size based on skill level
      return {
        x: Math.random() * (width - radius * 2) + radius,
        y: Math.random() * -500 - 50, // Start way above
        vx: (Math.random() - 0.5) * 4,
        vy: 0,
        radius: radius,
        color: color,
        label: skill.name,
        category: category,
        mass: radius // Mass proportional to size
      };
    });
    ballsRef.current = newBalls;
  };

  const updatePhysics = (width: number, height: number) => {
    const balls = ballsRef.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];

      // 1. Apply Forces
      ball.vy += GRAVITY;
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;

      // 2. Mouse Interaction (Repulsion / Kicking)
      const dx = ball.x - mouse.x;
      const dy = ball.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < mouse.radius + ball.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius + ball.radius - dist) * MOUSE_REPEL_FORCE;
        
        // Add mouse velocity influence (The "Kick")
        ball.vx += Math.cos(angle) * force + mouse.vx * 0.5;
        ball.vy += Math.sin(angle) * force + mouse.vy * 0.5;
      }

      // 3. Move
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 4. Wall Collisions
      if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.vx *= -BOUNCE;
      } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -BOUNCE;
      }

      if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
        ball.vy *= -BOUNCE;
        // Prevent endless micro-bouncing on floor
        if (Math.abs(ball.vy) < GRAVITY * 2) ball.vy = 0; 
      } else if (ball.y - ball.radius < 0) {
        // Ceiling (optional, usually we let them fly up, but let's keep them in)
        // ball.y = ball.radius;
        // ball.vy *= -BOUNCE;
      }

      // 5. Ball-to-Ball Collisions
      for (let j = i + 1; j < balls.length; j++) {
        const other = balls[j];
        const dx = other.x - ball.x;
        const dy = other.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + other.radius;

        if (distance < minDist) {
          // Resolve Overlap
          const angle = Math.atan2(dy, dx);
          const targetX = ball.x + Math.cos(angle) * minDist;
          const targetY = ball.y + Math.sin(angle) * minDist;
          const ax = (targetX - other.x) * 0.5; // Spring factor
          const ay = (targetY - other.y) * 0.5;
          
          ball.x -= ax;
          ball.y -= ay;
          other.x += ax;
          other.y += ay;

          // Resolve Velocity (Elastic Collision)
          // Normal vector
          const nx = dx / distance;
          const ny = dy / distance;

          // Tangent vector
          const tx = -ny;
          const ty = nx;

          // Dot Product Tangent
          const dpTan1 = ball.vx * tx + ball.vy * ty;
          const dpTan2 = other.vx * tx + other.vy * ty;

          // Dot Product Normal
          const dpNorm1 = ball.vx * nx + ball.vy * ny;
          const dpNorm2 = other.vx * nx + other.vy * ny;

          // Conservation of momentum in 1D
          const m1 = (dpNorm1 * (ball.mass - other.mass) + 2 * other.mass * dpNorm2) / (ball.mass + other.mass);
          const m2 = (dpNorm2 * (other.mass - ball.mass) + 2 * ball.mass * dpNorm1) / (ball.mass + other.mass);

          ball.vx = tx * dpTan1 + nx * m1;
          ball.vy = ty * dpTan1 + ny * m1;
          other.vx = tx * dpTan2 + nx * m2;
          other.vy = ty * dpTan2 + ny * m2;
        }
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    ballsRef.current.forEach(ball => {
      ctx.save();
      
      // Draw Ball Body (Glass effect)
      const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.3, 
        ball.y - ball.radius * 0.3, 
        ball.radius * 0.1, 
        ball.x, 
        ball.y, 
        ball.radius
      );
      gradient.addColorStop(0, '#ffffff'); // Highlight
      gradient.addColorStop(0.2, ball.color); // Base Color
      gradient.addColorStop(1, '#0f172a'); // Dark edge

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = ball.color;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Shine Reflection
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      // Text Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, ball.radius / 2.5)}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      
      // Handle multiline text if needed or just fit
      const words = ball.label.split(' ');
      if (words.length > 1 && ball.radius > 30) {
         ctx.fillText(words[0], ball.x, ball.y - ball.radius * 0.15);
         ctx.fillText(words[1], ball.x, ball.y + ball.radius * 0.25);
      } else {
         ctx.fillText(ball.label, ball.x, ball.y);
      }

      ctx.restore();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (containerRef.current && canvas) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        
        // Re-init balls if array is empty (first load) or keep positions relative?
        // Let's just reset balls if it's a massive resize, otherwise keep them
        if (ballsRef.current.length === 0) {
             initBalls(width, height);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        updatePhysics(width, height);
        draw(ctx, width, height);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // --- Input Handlers ---

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Calculate Mouse Velocity for "Kick" effect
    mouseRef.current.vx = x - mouseRef.current.x;
    mouseRef.current.vy = y - mouseRef.current.y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
  };

  const handleReset = () => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        initBalls(width, height);
    }
  };

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center">
      
      {/* Game Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full bg-brand-gray/20 rounded-3xl border border-white/10 overflow-hidden shadow-2xl cursor-none touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseEnter={() => { isDragging.current = true; }}
        onMouseLeave={() => { isDragging.current = false; mouseRef.current.x = -1000; }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* Custom Cursor Hint */}
        <div 
           className="absolute pointer-events-none w-20 h-20 rounded-full border-2 border-white/20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-200"
           style={{ 
             left: -100, // hidden initially
             opacity: isDragging.current ? 1 : 0 
           }}
           ref={el => {
             if (el && containerRef.current) {
                 // Simple logic to follow mouse visually via CSS for performance
                 const updateCursor = () => {
                    if (mouseRef.current.x > 0) {
                        el.style.left = `${mouseRef.current.x}px`;
                        el.style.top = `${mouseRef.current.y}px`;
                        el.style.opacity = '1';
                    }
                    requestAnimationFrame(updateCursor);
                 }
                 updateCursor();
             }
           }}
        >
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>

        {/* Overlay Hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-none opacity-60">
           <div className="flex items-center gap-2 text-xs text-white uppercase tracking-widest">
              <MousePointer2 size={12} />
              <span>Interaja para misturar</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6">
        <button 
          onClick={handleReset}
          className="p-3 bg-white text-black rounded-full hover:bg-brand-accent hover:text-white transition-colors shadow-lg"
          title="Reset Gravity"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
    </div>
  );
};

export default SkillsPhysics;