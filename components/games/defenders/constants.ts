export const GAME_CONFIG = {
  SHIP_SPEED: 8, // Base speed for keyboard
  SHIP_LERP: 0.5, // Increased for snappier movement (was 0.1)
  BULLET_SPEED: 15,
  SPAWN_RATE_MS: 1200,
  FIRE_COOLDOWN: 12, // Frames
  COLORS: {
    BACKGROUND_TOP: '#050414', // Deepest Blue
    BACKGROUND_BOTTOM: '#1e1b4b', // Indigo
    SHIP: '#00f3ff', // Cyan Neon (Cyberpunk)
    SHIP_GLOW: '#00f3ff',
    BULLET: '#ff00ff', // Magenta Neon
    BULLET_GLOW: '#d946ef',
    ENEMY_CORRECT_GLOW: '#00ff00', // Neon Green
    ENEMY_DEFAULT: '#94a3b8', // Slate for rock
    PARTICLE_EXPLOSION: ['#00f3ff', '#ff00ff', '#facc15', '#ffffff'], // Cyan, Magenta, Yellow, White
  },
  PARTICLE_COUNT: 20,
};

export const ENEMY_VARIANTS = {
  ASTEROID: {
    SPEED_MIN: 1.5,
    SPEED_MAX: 3.0,
    RADIUS_MIN: 30,
    RADIUS_MAX: 45,
    COLOR: '#94a3b8',
    GLOW: '#64748b',
    WEIGHT: 60,
  },
  SCOUT: {
    SPEED_MIN: 4.0,
    SPEED_MAX: 6.0,
    RADIUS: 25,
    COLOR: '#f472b6',
    GLOW: '#be185d',
    WEIGHT: 25,
  },
  HEAVY: {
    SPEED_MIN: 0.5,
    SPEED_MAX: 1.2,
    RADIUS: 55,
    COLOR: '#fbbf24',
    GLOW: '#d97706',
    WEIGHT: 15,
  }
};

export const CANVAS_SIZE = {
  width: window.innerWidth,
  height: window.innerHeight,
};