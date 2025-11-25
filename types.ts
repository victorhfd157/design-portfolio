export type Language = 'en' | 'pt';

export interface BilingualText {
  en: string;
  pt: string;
}

export interface Project {
  id: number;
  title: string;
  category: string; // We'll keep category keys in English for filtering logic, but display can be translated if needed
  description: BilingualText;
  imageUrl: string;
  gallery?: string[]; // Array of additional image URLs
  year: string;
  tags: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SkillData {
  name: string;
  level: number;
  fullMark: number;
}

export interface Experience {
  id: number;
  role: BilingualText;
  company: string;
  period: BilingualText; // "Jan 2025 - Present" vs "Jan 2025 - Atual"
  location: BilingualText;
  description: BilingualText;
  skills: string[]; // Skills are usually technical terms, so strings are fine
}