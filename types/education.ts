import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  School,
  BookOpen,
  Award,
  Code,
} from "lucide-react";

export type EducationCategory =
  | "graduacao"
  | "tecnico"
  | "curso"
  | "certificacao"
  | "bootcamp";

export type Education = {
  id: string;
  category: EducationCategory;
  institution: string;
  title: string;
  workload?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  highlights?: string[];
};

export type EducationCategoryConfig = {
  label: string;
  icon: LucideIcon;
};

export const educationCategoryConfig: Record<
  EducationCategory,
  EducationCategoryConfig
> = {
  graduacao: {
    label: "Graduação",
    icon: GraduationCap,
  },
  tecnico: {
    label: "Técnico",
    icon: School,
  },
  curso: {
    label: "Curso",
    icon: BookOpen,
  },
  certificacao: {
    label: "Certificação",
    icon: Award,
  },
  bootcamp: {
    label: "Bootcamp",
    icon: Code,
  },
};