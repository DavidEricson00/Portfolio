import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsPageContent } from "@/components/projects-page/ProjectsPageContent";

export const metadata: Metadata = {
  title: "Projetos — David Ericson | Desenvolvedor Fullstack",
  description:
    "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS, banco de dados e aplicações fullstack.",
  keywords: [
    "David Ericson",
    "Projetos",
    "Portfólio",
    "LetterDrop",
    "LinkShortener",
    "SupportDesk",
    "PedeAi",
    "DialoGO",
    "Fullstack",
    "NestJS",
    "Node.js",
    "AWS",
    "React",
  ],
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
  return (
    <Suspense fallback={<ProjectsLoadingFallback />}>
      <ProjectsPageContent />
    </Suspense>
  );
}
