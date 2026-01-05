
export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  problemStatement?: string;
  solutionStatement?: string;
  image: string;
  techStack: string[];
  isPaid: boolean;
  price?: number;
  demoUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  views: number;
  audit?: TrustAudit; // New Field
}

export interface TrustBreakdown {
  maintainability: number;
  security: number;
  documentation: number;
  relevance: number;
  readiness: number;
  ethics: number;
}

export interface TrustAudit {
  score: number;
  level: 'High' | 'Medium' | 'Low';
  breakdown: TrustBreakdown;
  reasoning: string;
  recommendations: string[];
  redFlags: string[];
  timestamp: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
}

export interface Reward {
  name: string;
  year: string;
  platform: string;
}

export interface Developer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  bio: string;
  github: string;
  contactEmail: string;
  projects: Project[];
  achievements: Achievement[];
  rewards: Reward[];
  rank?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  github?: string;
}
