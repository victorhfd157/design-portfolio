export type Language = 'en' | 'pt';

export interface BilingualText {
  en: string;
  pt: string;
}

export interface Project {
  id: number;
  title: string;
  categories: string[]; // Array of categories for the project
  description: BilingualText;
  imageUrl: string;
  gallery?: string[]; // Array of additional image URLs
  year: string;
  tags: string[];
  embedUrl?: string; // URL for iframe embeds (Google Slides, YouTube, Vimeo, etc.)
  contentType?: 'gallery' | 'presentation' | 'video'; // Type of content to display
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