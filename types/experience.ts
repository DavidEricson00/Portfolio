import type { Technology } from "./technology";

export type Experience = {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  points: string[];
};

export type ExperienceTechnology = {
  experienceId: string;
  technologyId: string;
};

export type ExperienceWithTechnologies = Experience & {
  technologies: Technology[];
};
