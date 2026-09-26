import type { Technology } from "./technology";

export type Project = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  highlights?: string[];
  technologies: Technology[];
  coverImage?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  description?: string;
  screenshots?: string[];
  features?: string[];
  architecture?: string;
  featured: boolean;
  featuredOrder?: number;
  ranking?: number;
};
