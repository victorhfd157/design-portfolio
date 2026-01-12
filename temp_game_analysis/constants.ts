export const GAME_CONFIG = {
  SHIP_SPEED: 8, // Base speed for keyboard
  SHIP_LERP: 0.1, // Smoothness factor for mouse movement (0.01 - 1.0)
  BULLET_SPEED: 15,
  SPAWN_RATE_MS: 1200,
  FIRE_COOLDOWN: 12, // Frames
  COLORS: {
    BACKGROUND_TOP: '#0f0c29',
    BACKGROUND_BOTTOM: '#302b63',
    SHIP: '#00f3ff', // Cyan Neon
    SHIP_GLOW: '#00f3ff',
    BULLET: '#ff00ff', // Magenta Neon
    BULLET_GLOW: '#ff00ff',
    ENEMY_CORRECT_GLOW: '#00ff00',
    ENEMY_DEFAULT: '#cbd5e1',
    PARTICLE_EXPLOSION: ['#ff0099', '#493240', '#00f3ff'], // Cyberpunk debris
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