export type EducationType =
  | "graduacao"
  | "curso"
  | "tecnico"
  | "bootcamp"
  | "certificacao";

export type Education = {
  id: string;
  type: EducationType;

  title: string;
  institution: string;
  area?: string;

  startDate: string;
  endDate?: string;
  status?: string;
  workload?: string;
  grade?: string;

  description?: string;
  highlights?: string[];
};
