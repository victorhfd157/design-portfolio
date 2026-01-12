export interface DialogueOption {
  text: string;
  isCorrect: boolean;
  feedback: string; // Reaction text from character
  scoreDelta: number; // Points to add/subtract
}

export interface DialogueNode {
  id: number;
  characterName: string;
  characterImage: string; // URL to image
  text: string; // The character's spoken line
  options: DialogueOption[];
  backgroundImage: string; // URL for background
}

export interface Scenario {
  title: string;
  description: string;
  nodes: DialogueNode[];
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK', // Showing result of choice
  SUMMARY = 'SUMMARY',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface PlayerStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  history: {
    nodeId: number;
    wasCorrect: boolean;
    choiceText: string;
  }[];
}