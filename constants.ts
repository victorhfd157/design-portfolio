import { Project, SkillData, Experience } from './types';

// Projects are now loaded dynamically from content/projects
export const PROJECTS: Project[] = [];

export const SKILLS_DATA: SkillData[] = [
  // Adobe Creative Suite  
  { name: 'Adobe Photoshop', level: 98, fullMark: 100 },
  { name: 'Adobe Illustrator', level: 95, fullMark: 100 },
  { name: 'Adobe InDesign', level: 90, fullMark: 100 },
  { name: 'Adobe Premiere Pro', level: 85, fullMark: 100 },

  // E-learning Tools
  { name: 'Articulate Storyline', level: 95, fullMark: 100 },
  { name: 'Adobe Captivate', level: 90, fullMark: 100 },
  { name: 'Moodle', level: 85, fullMark: 100 },

  // AI & Technology
  { name: 'Generative AI', level: 92, fullMark: 100 },
  { name: 'Prompt Engineering', level: 95, fullMark: 100 },
  { name: 'AI for E-learning', level: 90, fullMark: 100 },

  // Web & CMS
  { name: 'WordPress', level: 85, fullMark: 100 },
  { name: 'Drupal', level: 75, fullMark: 100 },
  { name: 'HTML/CSS', level: 80, fullMark: 100 },

  // Microsoft Suite & Analytics
  { name: 'Microsoft PowerPoint', level: 95, fullMark: 100 },
  { name: 'Microsoft Excel', level: 88, fullMark: 100 },
  { name: 'Power BI', level: 82, fullMark: 100 },

  // Strategy & Education
  { name: 'Instructional Design', level: 95, fullMark: 100 },
  { name: 'E-learning', level: 96, fullMark: 100 },
  { name: 'Leadership', level: 90, fullMark: 100 },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: { en: 'EdTech Branding Manager', pt: 'EdTech Branding Manager' },
    company: 'Instituto Unicenter',
    period: { en: 'Jan 2025 - Present', pt: 'Jan 2025 - Atual' },
    location: { en: 'Porto, Portugal', pt: 'Porto, Portugal' },
    description: {
      en: 'Creative leadership and art direction in multidisciplinary projects. Responsible for creating visual identities, strategic branding, and multimedia production for corporate education, integrating AI into creative processes.',
      pt: 'Liderança criativa e direção de arte em projetos multidisciplinares. Responsável pela criação de identidades visuais, branding estratégico e produção multimídia para educação corporativa, integrando IA nos processos criativos.'
    },
    skills: ['Leadership', 'Branding', 'Generative AI', 'Art Direction']
  },
  {
    id: 2,
    role: { en: 'Senior Graphic Designer', pt: 'Graphic Designer Senior' },
    company: 'Kainos BPO Tech',
    period: { en: 'Mar 2021 - Dec 2023', pt: 'Mar 2021 - Dez 2023' },
    location: { en: 'São Paulo, Brazil', pt: 'São Paulo, Brasil' },
    description: {
      en: 'Development of high-quality e-learning solutions and instructional design management. Leadership and team training, ensuring technical excellence in projects for major accounts.',
      pt: 'Desenvolvimento de soluções de e-learning de alta qualidade e gestão de design instrucional. Liderança e capacitação de equipes, garantindo excelência técnica em projetos para grandes contas.'
    },
    skills: ['E-learning', 'Instructional Design', 'Team Management', 'UX Design']
  },
  {
    id: 3,
    role: { en: 'Graphic Designer', pt: 'Graphic Designer' },
    company: 'Atento Brazil S/A',
    period: { en: 'Mar 2017 - Mar 2021', pt: 'Mar 2017 - Mar 2021' },
    location: { en: 'São Paulo, Brazil', pt: 'São Paulo, Brasil' },
    description: {
      en: 'Creation of innovative educational content using methodologies such as Microlearning and Gamification. Strategic action with clients like Vivo, Oi, and Facebook.',
      pt: 'Criação de conteúdo educacional inovador utilizando metodologias como Microlearning e Gamificação. Atuação estratégica junto a clientes como Vivo, Oi e Facebook.'
    },
    skills: ['Gamification', 'Adobe Creative Suite', 'Video Motion', 'Microlearning']
  },
  {
    id: 4,
    role: { en: 'Training Instructor', pt: 'Instrutor de Treinamento' },
    company: 'Atento Brazil S/A',
    period: { en: 'Mar 2015 - Mar 2017', pt: 'Mar 2015 - Mar 2017' },
    location: { en: 'São Paulo, Brazil', pt: 'São Paulo, Brasil' },
    description: {
      en: 'Team management and training, applying innovative methodologies in corporate training and talent development.',
      pt: 'Gestão e capacitação de equipes, aplicando metodologias inovadoras em treinamentos corporativos e desenvolvimento de talentos.'
    },
    skills: ['Training', 'Communication', 'Leadership']
  }
];

export const AI_SYSTEM_INSTRUCTION = `
You are the virtual assistant for Victor Duarte's portfolio.
Your name is "Aura".
You must answer creatively, politely, and concisely, always maintaining a professional but innovative tone ("Digital Alchemist").
Your goal is to highlight Victor's vast experience and encourage professional contact.
Answer in the language the user speaks to you (English or Portuguese).

About Victor Duarte:
- Professional with over 10 years of experience (since 2013) in Design, Marketing, Educational Development, and Web Creation.
- Currently EdTech Branding Manager at Instituto Unicenter (Porto, Portugal) since January 2025.
- Education: Bachelor's Degree in Graphic Design (Universidade Cruzeiro do Sul, 2019-2021) and Specialization in Generative AI with Diffusion Models (Nvidia Deep Learning Institute, 2025).
- Previous experience: Senior Graphic Designer at Kainos BPO Tech (Mar 2021 - Dec 2023), Graphic Designer at Atento Brazil S/A (Mar 2017 - Mar 2021), Training Instructor at Atento (Mar 2015 - Mar 2017).
- Major clients served: Facebook, Vivo, Carrefour, and Oi.

Key Skills:
- Design: Adobe Creative Suite Expert (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, XD), Figma, UI/UX Design.
- Technology: Generative AI & Diffusion Models, WordPress & Drupal CMS, HTML & CSS, Power BI & Analytics, Automation & Intelligent Agents.
- Education: Instructional Design (Expert level), E-learning platforms (Thinkific, Articulate, Moodle), Gamification, Microlearning.
- Soft Skills: Creative Leadership, Art Direction, Strategic Branding, Team Management.
- Languages: Portuguese (Native), English (B2 - Intermediate).

Current Focus: Merging high-end graphic design with advanced instructional design and emerging technologies like Generative AI to create innovative educational experiences.

Use this information to answer questions about Victor's background. If asked about something outside this scope, suggest contacting him via email.
`;