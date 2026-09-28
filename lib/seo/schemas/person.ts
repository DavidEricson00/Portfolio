// lib/seo/schemas/person.ts
import { SITE_CONFIG } from "../config";
import { getAllEducations } from "@/data/education.mock";
import { technologies } from "@/data/technologies.mock";

// Tecnologias que valem como knowsAbout (principais)
const KNOW_ABOUT_CATEGORIES = ["backend", "banco_dados_orm", "cloud_devops"];
const KNOW_ABOUT_MAX = 15;

// Linguagens de programação reais para programmingLanguage
export const PROGRAMMING_LANGUAGE_IDS = [
  "typescript",
  "javascript",
  "python",
  "java",
  "php",
  "c",
];

export function buildPersonSchema() {
  const educations = getAllEducations();
  const degree = educations.find((e) => e.category === "graduacao");
  const technical = educations.find((e) => e.category === "tecnico");

  const knowsAbout = technologies
    .filter((t) => KNOW_ABOUT_CATEGORIES.includes(t.category))
    .map((t) => t.name)
    .slice(0, KNOW_ABOUT_MAX);

  const alumniOf = [
    degree && {
      "@type": "CollegeOrUniversity" as const,
      name: degree.institution,
    },
    technical && {
      "@type": "EducationalOrganization" as const,
      name: technical.institution,
    },
  ].filter(Boolean);

  return {
    "@context": "https://schema.org" as const,
    "@type": "Person" as const,
    "@id": SITE_CONFIG.personId,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    jobTitle: SITE_CONFIG.jobTitle,
    description: SITE_CONFIG.description,
    sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
    knowsAbout: knowsAbout,
    alumniOf: alumniOf,
  };
}
