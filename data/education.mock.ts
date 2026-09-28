import type { Education } from "@/types/education";

export const educations: Education[] = [
  {
    id: "graduacao-si",
    category: "graduacao",
    title: "Bacharelado em Sistemas de Informação",
    institution:
      "Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE)",
    startDate: "07/2023",
    endDate: "07/2027",
    grade: "8,92",
    highlights: [
      "Coeficiente de Rendimento (CR): 8,92.",
      "122 créditos adquiridos até o momento.",
      "Formação abrangendo desenvolvimento de software, bancos de dados, engenharia de software, sistemas distribuídos, redes, inteligência artificial e gestão de projetos.",
      "Principais disciplinas concluídas: Algoritmos e Estruturas de Dados, Banco de Dados, Programação Orientada a Objetos, Sistemas Distribuídos, Engenharia de Software, Inteligência Artificial e Projetos de Sistemas Web.",
    ],
  },

  {
    id: "curso-capacita-brasil",
    category: "curso",
    title: "Desenvolvimento Fullstack",
    institution: "Capacita Brasil / Instituto Atlântico",
    startDate: "07/2024",
    endDate: "06/2025",
    workload: "480h",
    highlights: [
      "Programa Residência em TIC-20 – Capacita Brasil / C-Jovem.",
      "Formação em Desenvolvimento Fullstack com conteúdos de lógica de programação, desenvolvimento web, JavaScript, frontend, backend, bancos de dados SQL, Node.js, testes e integração de sistemas.",
      "Desenvolvimento de projetos práticos utilizando aprendizagem baseada em desafios (CBL).",
      "Imersão de 120 horas em empresa parceira, com desenvolvimento de projetos em equipe e aplicação prática dos conhecimentos adquiridos.",
      "Durante a formação, atuei como Estagiário Fullstack no desenvolvimento de uma API para gestão de projetos de pesquisa e produções acadêmicas.",
      "Módulo de habilidades comportamentais com Projeto de Vida, Empreendedorismo, Inglês para TI e Lógica de Programação.",
    ],
  },

  {
    id: "tecnico-informatica",
    category: "tecnico",
    title: "Técnico em Informática",
    institution: "EEEP Wellington Belém de Figueiredo",
    startDate: "01/2020",
    endDate: "12/2022",
    highlights: [
      "Formação técnica integrada ao Ensino Médio na área de Informática.",
      "Formação em programação, desenvolvimento web, bancos de dados, redes de computadores, sistemas operacionais e manutenção de computadores.",
      "Experiência com desenvolvimento web utilizando JavaScript, PHP e MySQL.",
      "Estudos de Programação Orientada a Objetos com Java e fundamentos de desenvolvimento de software.",
      "Estágio curricular realizado durante a formação técnica.",
    ],
  },
];

export function getAllEducations(): Education[] {
  return educations;
}