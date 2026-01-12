
export type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER';

export type EnemyType = 'ASTEROID' | 'SCOUT' | 'HEAVY';


export type Operator = '+' | '-' | 'x' | '÷';

export interface MathConfig {
  operators: Operator[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface MathProblem {
  question: string;
  answer: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Entity extends Point {
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export interface TrailPoint {
  x: number;
  y: number;
  width: number;
  alpha: number;
}

export interface Ship extends Entity {
  width: number;
  height: number;
  cooldown: number;
  trail: TrailPoint[];
  tilt: number; // For visual banking effect
}

export interface Bullet extends Entity {
  active: boolean;
}

export interface Enemy extends Entity {
  id: string;
  type: EnemyType;
  value: number;
  isCorrect: boolean;
  active: boolean;
  angle: number;
  rotationSpeed: number;
  initialX: number;
  timeOffset: number;
  glowColor?: string;
}

export interface Particle extends Entity {
  life: number;
  maxLife: number;
  active: boolean;
  size: number;
}

export interface Star {
  x: number;
  y: number;
  z: number; // Depth factor (0.1 to 1.0)
  size: number;
  brightness: number;
  speed: number;
}

export type PowerUpType = 'SHIELD' | 'TRIPLE_SHOT' | 'NUKE';

export interface PowerUp extends Entity {
  type: PowerUpType;
  active: boolean;
  width?: number;
  height?: number;
}

export interface Boss extends Enemy {
  health: number;
  maxHealth: number;
  phase: 1 | 2 | 3;
  width: number;
  height: number;
}
