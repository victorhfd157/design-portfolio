export enum GamePhase {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  LOADING = 'LOADING',
  GAMEOVER = 'GAMEOVER',
  VICTORY = 'VICTORY'
}

export enum MediumType {
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  NEWS = 'NEWS'
}

export interface GameStats {
  morale: number;
  profit: number;
  reputation: number;
}

export interface ChoiceOption {
  id: string;
  text: string;
  description: string;
}

export interface ScenarioResponse {
  scenarioId: string;
  title: string;
  narrative: string; // Context of what is happening
  medium: MediumType; // How the info is delivered
  senderName: string; // Who is sending the email or talking
  senderRole: string;
  content: string; // The body of the email or the dialogue in meeting
  options: ChoiceOption[];
  statUpdates?: Partial<GameStats>; // Changes from previous turn
  feedback?: string; // Narrative feedback on previous choice
  isGameOver?: boolean;
  gameOverReason?: string;
  imageUrl?: string; // AI generated visual
}

export interface GameState {
  phase: GamePhase;
  stats: GameStats;
  turnCount: number;
  history: ScenarioResponse[];
  currentScenario: ScenarioResponse | null;
}
