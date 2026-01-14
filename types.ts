export type Language = 'en' | 'pt';

export interface BilingualText {
  en: string;
  pt: string;
}

export interface ProcessStep {
  phase: string;
  description: BilingualText;
}

export interface KeyDecision {
  title: BilingualText;
  rationale: BilingualText;
}

export interface TLDR {
  problem: BilingualText;
  solution: BilingualText;
  result: BilingualText;
}

export interface CaseStudy {
  // Hero metadata
  role?: BilingualText;
  duration?: BilingualText;
  team?: BilingualText;

  // Executive Summary
  tldr?: TLDR;

  // Context & Constraints
  context?: BilingualText;
  constraints?: BilingualText[];

  // Core Narrative
  challenge: BilingualText;
  solution: BilingualText;
  process: ProcessStep[];

  // Deep Dive
  keyDecisions?: KeyDecision[];

  // Outcome
  tools: string[];
  results: BilingualText;
  impact: string[];

  // Reflection (Optional but recommended)
  learnings?: BilingualText[];
  whatNext?: BilingualText;
}

export interface Project {
  id: string | number;
  title: string;
  categories: string[]; // Array of categories for the project
  description: BilingualText;
  imageUrl: string;
  gallery?: string[]; // Array of additional image URLs
  year: string;
  tags: string[];
  embedUrl?: string; // URL for iframe embeds (Google Slides, YouTube, Vimeo, etc.)
  contentType?: 'gallery' | 'presentation' | 'video'; // Type of content to display
  caseStudy?: CaseStudy; // Optional detailed case study
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