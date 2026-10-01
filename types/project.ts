import type { LucideIcon } from "lucide-react";

import {
  BookOpen,
  Workflow,
  Cpu,
  Sparkles,
  GitFork,
  Images,
  Sliders,
  GraduationCap,
  FileText,
} from "lucide-react";

import type { Technology } from "./technology";

export type ProjectSectionType =
  | "overview"
  | "how-it-works"
  | "architecture"
  | "features"
  | "decisions"
  | "screenshots"
  | "process"
  | "learnings"
  | "custom";

export type ProjectSection = {
  id: string;
  type: ProjectSectionType;
  content: string;
  images?: string[];
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  coverImage?: string;
  technologies: Technology[];
  repositoryUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  featured: boolean;
  ranking: number;
  dateCreated?: string;
  sections: ProjectSection[];
};

export type ProjectDocument = Omit<
  Project,
  "id" | "technologies"
> & {
  technologyIds: string[];
};

export type ProjectInput = ProjectDocument;

export type ProjectSectionConfig = {
  title: string;
  icon: LucideIcon;
  order: number;
};

export const projectSectionConfigs: Record<
  ProjectSectionType,
  ProjectSectionConfig
> = {
  overview: {
    title: "Visão geral",
    icon: BookOpen,
    order: 1,
  },

  "how-it-works": {
    title: "Como funciona",
    icon: Workflow,
    order: 2,
  },

  architecture: {
    title: "Arquitetura",
    icon: Cpu,
    order: 3,
  },

  features: {
    title: "Funcionalidades",
    icon: Sparkles,
    order: 4,
  },

  decisions: {
    title: "Decisões técnicas",
    icon: GitFork,
    order: 5,
  },

  screenshots: {
    title: "Screenshots",
    icon: Images,
    order: 6,
  },

  process: {
    title: "Processo",
    icon: Sliders,
    order: 7,
  },

  learnings: {
    title: "Aprendizados",
    icon: GraduationCap,
    order: 8,
  },

  custom: {
    title: "Informações adicionais",
    icon: FileText,
    order: 9,
  },
};

export function getProjectSectionConfig(
  type: ProjectSectionType,
): ProjectSectionConfig {
  return (
    projectSectionConfigs[type] ?? {
      title: "Detalhes",
      icon: FileText,
      order: 99,
    }
  );
}