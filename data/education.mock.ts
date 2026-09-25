import type { Education } from "@/types/education";

export const educations: Education[] = [
  {
    id: "graduacao-si",
    type: "graduacao",
    title: "Bacharelado em Sistemas de Informação",
    institution: "Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE)",
    area: "Sistemas de Informação",
    startDate: "2023",
    endDate: "2027",
    status: "Em andamento",
    // grade: Deixado preparado para receber a média acadêmica
  },
  {
    id: "curso-capacita-brasil",
    type: "curso",
    title: "Desenvolvimento Fullstack",
    institution: "Capacita Brasil / Instituto Atlântico",
    description: "Residência em TIC-20 – Capacita Brasil / C-Jovem",
    startDate: "08/07/2024",
    endDate: "30/06/2025",
    workload: "480h",
    status: "Concluído",
    highlights: [
      "Módulo de Formação Técnica (240h): Abrangendo fundamentos da Web, JavaScript Moderno, Frameworks Front-end, Bancos de Dados SQL, Node.js, Testes e Integração Fullstack com projetos práticos baseados em CBL.",
      "Módulo de Imersão em Empresa Parceira (120h): Desenvolvimento prático em equipe multidisciplinar aplicando metodologias ágeis e atuação na PGI.",
      "Módulo de Habilidades Comportamentais (120h): Projeto de Vida, Empreendedorismo, Inglês para TI e Lógica de Programação.",
    ],
  },
  {
    id: "tecnico-informatica",
    type: "tecnico",
    title: "Técnico em Informática",
    institution: "EEEP Wellington Belém de Figueiredo",
    area: "Informática",
    startDate: "2020",
    endDate: "2022",
    status: "Concluído",
  },
];

export function getAllEducations(): Education[] {
  return educations;
}
