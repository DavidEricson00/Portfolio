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

export type ExperienceDocument = Omit<Experience, "id"> & {
  technologyIds: string[];
};

export type ExperienceInput = ExperienceDocument;

export type ExperienceWithTechnologies = Experience & {
  technologies: Technology[];
};