import type {
  Experience,
  ExperienceTechnology,
  ExperienceWithTechnologies,
} from "@/types/experience";
import { Technology } from "@/types/technology";

export const experiences: Experience[] = [
  {
    id: "exp-capacita-brasil",
    role: "Estagiário Fullstack",
    company: "Capacita Brasil / Instituto Atlântico",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    points: [
      "Desenvolvi, em equipe, uma API para gestão de projetos de pesquisa e produções acadêmicas, como projeto final do curso de desenvolvimento de 480 horas.",
      "Implementei funcionalidades de autenticação, controle de acesso por perfil, fluxo de submissão e aprovação, gerenciamento de arquivos e geração de documentos.",
      "Participei de reuniões semanais com a equipe e o supervisor do projeto para discutir requisitos, propostas técnicas, divisão de tarefas e evolução das entregas.",
      "Trabalhei com Kanban, divisão de tarefas e documentação técnica para facilitar a integração e a continuidade do trabalho entre os membros da equipe.",
      "Participei de reuniões de alinhamento e conformidade com profissionais da instituição demandante, contribuindo para validar requisitos e ajustar a solução às necessidades apresentadas.",
      "Atuei na prototipação de interfaces no Figma e na apresentação final da solução no Demo Day, sendo responsável pelo pitch da equipe.",
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
      "Estruturei a aplicação para centralizar o controle de receitas, despesas, categorias e indicadores financeiros, reduzindo a dependência do processo anterior baseado em planilhas.",
      "Implementei funcionalidades de consulta, cadastro, filtros, paginação, busca e visualização de indicadores financeiros.",
      "Desenvolvi gráficos e indicadores para apoiar a visualização e o acompanhamento das informações financeiras.",
      "Empacotei a aplicação como executável Windows utilizando Electron e participei da preparação do sistema para utilização no ambiente da empresa.",
      "Participei do processo gradual de migração do controle financeiro das planilhas para o novo sistema, acompanhando a transição entre os dois processos.",
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
      "Atuei de forma autônoma no levantamento de requisitos, modelagem do sistema, estruturação do banco de questões e desenvolvimento da aplicação.",
      "Implementei perfis de professor e aluno, autenticação, aplicação dos quizzes, métricas de desempenho e recursos de acompanhamento pedagógico.",
      "Desenvolvi funcionalidades administrativas e ferramentas de apoio à gestão da plataforma, incluindo exportação de credenciais em PDF e recursos para gerenciamento das questões e usuários.",
      "Participei das etapas de validação, reuniões de acompanhamento e aprovação da solução antes da disponibilização para uso.",
      "Conduzi o desenvolvimento até o deploy em produção, com a plataforma sendo utilizada por cerca de 300 alunos e 20 professores da rede municipal.",
    ],
  },
];

export const experienceTechnologies: ExperienceTechnology[] = [
  // Capacita Brasil / Instituto Atlântico — PGI
  { experienceId: "exp-capacita-brasil", technologyId: "nodejs" },
  { experienceId: "exp-capacita-brasil", technologyId: "typescript" },
  { experienceId: "exp-capacita-brasil", technologyId: "express" },
  { experienceId: "exp-capacita-brasil", technologyId: "prisma" },
  { experienceId: "exp-capacita-brasil", technologyId: "postgresql" },
  { experienceId: "exp-capacita-brasil", technologyId: "jwt" },
  { experienceId: "exp-capacita-brasil", technologyId: "zod" },
  { experienceId: "exp-capacita-brasil", technologyId: "multer" },
  { experienceId: "exp-capacita-brasil", technologyId: "sharp" },
  { experienceId: "exp-capacita-brasil", technologyId: "nodemailer" },
  { experienceId: "exp-capacita-brasil", technologyId: "pdfkit" },
  { experienceId: "exp-capacita-brasil", technologyId: "archiver" },
  { experienceId: "exp-capacita-brasil", technologyId: "swagger" },
  { experienceId: "exp-capacita-brasil", technologyId: "figma" },

  // Construsu
  { experienceId: "exp-construsu", technologyId: "electron" },
  { experienceId: "exp-construsu", technologyId: "react" },
  { experienceId: "exp-construsu", technologyId: "vite" },
  { experienceId: "exp-construsu", technologyId: "tailwindcss" },
  { experienceId: "exp-construsu", technologyId: "nodejs" },
  { experienceId: "exp-construsu", technologyId: "express" },
  { experienceId: "exp-construsu", technologyId: "postgresql" },
  { experienceId: "exp-construsu", technologyId: "supabase" },
  { experienceId: "exp-construsu", technologyId: "recharts" },

  // Secretaria Municipal de Educação de Nova Olinda/CE
  { experienceId: "exp-secretaria-educacao", technologyId: "nextjs" },
  { experienceId: "exp-secretaria-educacao", technologyId: "typescript" },
  { experienceId: "exp-secretaria-educacao", technologyId: "react" },
  { experienceId: "exp-secretaria-educacao", technologyId: "tailwindcss" },
  { experienceId: "exp-secretaria-educacao", technologyId: "prisma" },
  { experienceId: "exp-secretaria-educacao", technologyId: "postgresql" },
  { experienceId: "exp-secretaria-educacao", technologyId: "supabase" },
  { experienceId: "exp-secretaria-educacao", technologyId: "jwt" },
  { experienceId: "exp-secretaria-educacao", technologyId: "reacthookform" },
  { experienceId: "exp-secretaria-educacao", technologyId: "zod" },
  { experienceId: "exp-secretaria-educacao", technologyId: "shadcn" },
  { experienceId: "exp-secretaria-educacao", technologyId: "tanstackquery" },
];

export function getExperiencesWithTechnologies(
  technologies: Technology[]
): ExperienceWithTechnologies[] {
  const technologiesById = new Map(
    technologies.map((technology) => [technology.id, technology])
  );

  return experiences.map((exp) => {
    const techLinks = experienceTechnologies.filter(
      (pivot) => pivot.experienceId === exp.id
    );

    const resolvedTechnologies = techLinks
      .map((pivot) => technologiesById.get(pivot.technologyId))
      .filter((tech): tech is Technology => Boolean(tech));

    return {
      ...exp,
      technologies: resolvedTechnologies,
    };
  });
}