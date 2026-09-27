// lib/seo/config.ts
export const SITE_CONFIG = {
  url: "https://davidericson.dev",
  name: "David Ericson",
  siteName: "David Ericson — Portfólio",
  description:
    "Portfólio de David Ericson, desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e arquitetura de sistemas.",
  jobTitle: "Desenvolvedor Fullstack",
  email: "davidestudofcg@gmail.com",
  github: "https://github.com/DavidEricson00",
  linkedin: "https://www.linkedin.com/in/davidericson00/",
  locale: "pt_BR",
  language: "pt-BR",
  // IDs de entidades para linked data
  personId: "https://davidericson.dev/#person",
  websiteId: "https://davidericson.dev/#website",
} as const;

export type SiteConfig = typeof SITE_CONFIG;
