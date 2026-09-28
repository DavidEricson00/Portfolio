import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsPageContent } from "@/components/projects-page/ProjectsPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProjectListSchema } from "@/lib/seo/schemas/collection";
import { getAllProjects } from "@/data/projects.mock";
import { SITE_CONFIG } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS, banco de dados e aplicações fullstack.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/projetos`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_CONFIG.url}/projetos`,
    title: `Projetos — ${SITE_CONFIG.name}`,
    description:
      "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS, banco de dados e aplicações fullstack.",
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `Projetos — ${SITE_CONFIG.name}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `Projetos — ${SITE_CONFIG.name}`,
    description:
      "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS, banco de dados e aplicações fullstack.",
    images: [`${SITE_CONFIG.url}/og-image.png`],
  },
};

function ProjectsLoadingFallback() {
  return (
    <main className="projects-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          color: "var(--muted)",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.9rem",
        }}
      >
        Carregando projetos...
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <JsonLd schema={buildProjectListSchema(projects)} />
      <Suspense fallback={<ProjectsLoadingFallback />}>
        <ProjectsPageContent />
      </Suspense>
    </>
  );
}

