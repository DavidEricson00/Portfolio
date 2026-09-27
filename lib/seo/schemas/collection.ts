// lib/seo/schemas/collection.ts
import type { Project } from "@/types/project";
import type { Post } from "@/types/post";
import { SITE_CONFIG } from "../config";

export function buildProjectListSchema(projects: Project[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "CollectionPage" as const,
    url: `${SITE_CONFIG.url}/projetos`,
    name: `Projetos — ${SITE_CONFIG.name}`,
    description:
      "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS e aplicações fullstack.",
    inLanguage: SITE_CONFIG.language,
    author: { "@id": SITE_CONFIG.personId },
    hasPart: projects.map((p) => ({
      "@type": p.liveUrl ? "WebApplication" : "CreativeWork",
      name: p.name,
      url: `${SITE_CONFIG.url}/projetos/${p.slug}`,
      description: p.summary,
    })),
  };
}

export function buildBlogListSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "CollectionPage" as const,
    url: `${SITE_CONFIG.url}/blog`,
    name: `Blog — ${SITE_CONFIG.name}`,
    description:
      "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
    inLanguage: SITE_CONFIG.language,
    author: { "@id": SITE_CONFIG.personId },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting" as const,
      headline: p.title,
      url: `${SITE_CONFIG.url}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@id": SITE_CONFIG.personId },
    })),
  };
}
