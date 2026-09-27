// lib/seo/schemas/project.ts
import type { Project } from "@/types/project";
import { SITE_CONFIG } from "../config";
import { compact } from "../utils";
import { PROGRAMMING_LANGUAGE_IDS } from "./person";

// Determina o tipo Schema.org correto baseado nos dados reais do projeto
export function getProjectSchemaType(
  project: Project
): "WebApplication" | "CreativeWork" {
  // WebApplication: tem interface web acessível publicamente
  if (project.liveUrl) return "WebApplication";
  return "CreativeWork";
}

export function buildProjectSchema(project: Project) {
  const schemaType = getProjectSchemaType(project);
  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;

  const programmingLanguages = project.technologies
    .filter((t) => PROGRAMMING_LANGUAGE_IDS.includes(t.id))
    .map((t) => t.name);

  const schema = compact({
    "@context": "https://schema.org" as const,
    "@type": schemaType as "WebApplication" | "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.name,
    description: project.summary,
    url: project.liveUrl || projectUrl,
    mainEntityOfPage: projectUrl,
    author: { "@id": SITE_CONFIG.personId },
    inLanguage: SITE_CONFIG.language,
    keywords: project.technologies.map((t) => t.name).join(", "),
    image: project.coverImage,
    codeRepository: project.repositoryUrl,
    ...(programmingLanguages.length > 0 && {
      programmingLanguage: programmingLanguages,
    }),
    ...(project.dateCreated && { dateCreated: project.dateCreated }),
  });

  return schema;
}
