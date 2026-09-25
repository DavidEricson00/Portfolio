import type {
  Experience,
  ExperienceTechnology,
  ExperienceWithTechnologies,
} from "@/types/experience";
import { technologiesById } from "./technologies.mock";

export const experiences: Experience[] = [
  {
    id: "exp-capacita-brasil",
    role: "Estagiário Fullstack",
    company: "Capacita Brasil / Instituto Atlântico",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    points: [
      "Desenvolvi a API de uma plataforma para gestão de projetos de pesquisa.",
      "Implementei autenticação, controle de acesso por perfil e automação do fluxo de submissão e aprovação.",
      "Atuei em uma equipe de 6 integrantes utilizando metodologia ágil com Kanban.",
      "Participei de reuniões de acompanhamento com stakeholders, planejamento de entregas e apresentação da solução no Demo Day.",
    ],
  },
  {
    id: "exp-construsu",
    role: "Estagiário Fullstack",
    company: "Construsu",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    points: [
      "Desenvolvi um sistema desktop de gestão financeira para substituir o controle manual realizado em planilhas Excel.",
      "Estruturei a aplicação para aumentar a organização e a confiabilidade dos dados financeiros.",
      "Empacotei a aplicação como executável Windows utilizando Electron.",
      "Implementei visualizações e indicadores financeiros com Recharts.",
    ],
  },
  {
    id: "exp-secretaria-educacao",
    role: "Estagiário Fullstack",
    company: "Secretaria Municipal de Educação de Nova Olinda/CE",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    points: [
      "Desenvolvi uma plataforma de quizzes pedagógicos voltada à preparação de alunos do 5º ano para o exame do SPAECE.",
      "A plataforma foi utilizada por cerca de 300 alunos e 20 professores da rede municipal.",
      "Atuei do levantamento de requisitos ao deploy em produção.",
      "Conduzi o projeto de forma autônoma, modelando o sistema e estruturando o banco de questões.",
      "Implementei perfis de professor e aluno, métricas de desempenho, exportação de credenciais em PDF e controles de segurança.",
    ],
  },
];

export const experienceTechnologies: ExperienceTechnology[] = [
  // Capacita Brasil / Instituto Atlântico
  { experienceId: "exp-capacita-brasil", technologyId: "nodejs" },
  { experienceId: "exp-capacita-brasil", technologyId: "typescript" },
  { experienceId: "exp-capacita-brasil", technologyId: "express" },
  { experienceId: "exp-capacita-brasil", technologyId: "prisma" },
  { experienceId: "exp-capacita-brasil", technologyId: "postgresql" },
  { experienceId: "exp-capacita-brasil", technologyId: "jwt" },

  // Construsu
  { experienceId: "exp-construsu", technologyId: "electron" },
  { experienceId: "exp-construsu", technologyId: "react" },
  { experienceId: "exp-construsu", technologyId: "nodejs" },
  { experienceId: "exp-construsu", technologyId: "express" },
  { experienceId: "exp-construsu", technologyId: "postgresql" },
  { experienceId: "exp-construsu", technologyId: "supabase" },
  { experienceId: "exp-construsu", technologyId: "jwt" },

  // Secretaria Municipal de Educação de Nova Olinda/CE
  { experienceId: "exp-secretaria-educacao", technologyId: "nextjs" },
  { experienceId: "exp-secretaria-educacao", technologyId: "typescript" },
  { experienceId: "exp-secretaria-educacao", technologyId: "react" },
  { experienceId: "exp-secretaria-educacao", technologyId: "tailwindcss" },
  { experienceId: "exp-secretaria-educacao", technologyId: "prisma" },
  { experienceId: "exp-secretaria-educacao", technologyId: "postgresql" },
  { experienceId: "exp-secretaria-educacao", technologyId: "supabase" },
  { experienceId: "exp-secretaria-educacao", technologyId: "jwt" },
];

/**
 * Resolves the N:N relation between Experience and Technology through the pivot table
 */
export function getExperiencesWithTechnologies(): ExperienceWithTechnologies[] {
  return experiences.map((exp) => {
    const techLinks = experienceTechnologies.filter(
      (pivot) => pivot.experienceId === exp.id
    );

    const resolvedTechnologies = techLinks
      .map((pivot) => technologiesById.get(pivot.technologyId))
      .filter((tech): tech is NonNullable<typeof tech> => Boolean(tech));

    return {
      ...exp,
      technologies: resolvedTechnologies,
    };
  });
}
