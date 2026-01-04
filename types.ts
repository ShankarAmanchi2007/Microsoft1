
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
