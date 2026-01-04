
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

export interface Developer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  bio: string;
  github: string;
  contactEmail: string;
  projects: Project[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  github?: string;
}
