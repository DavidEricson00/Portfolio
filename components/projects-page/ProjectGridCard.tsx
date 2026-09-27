"use client";



import { ExternalLink, ArrowUpRight, Layers } from "lucide-react";
import type { Project } from "@/types/project";
import { technologyCategoryConfig } from "@/types/technology";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export type ProjectGridCardProps = {
  project: Project;
  onSelectTechnology?: (techId: string) => void;
};

export function ProjectGridCard({
  project,
  onSelectTechnology,
}: ProjectGridCardProps) {
  const handleCardClick = () => {
    // Prepared for future navigation to project details page: /projetos/[slug]
    console.log(`Navigate to project: /projetos/${project.slug}`);
  };

  return (
    <article
      className="project-grid-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Ver detalhes do projeto ${project.name}`}
    >
      {/* Cover / Image Area */}
      <div className="project-grid-card-cover-wrap">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={`Screenshot do projeto ${project.name}`}
            className="project-grid-card-cover"
            loading="lazy"
          />
        ) : (
          <div className="project-grid-card-fallback">
            <div className="project-grid-card-fallback-pattern" aria-hidden="true" />
            <div className="project-grid-card-fallback-glow" aria-hidden="true" />
            <div className="project-grid-card-fallback-content">
              <div className="project-grid-card-fallback-icon">
                <Layers size={26} />
              </div>
              <span className="project-grid-card-fallback-name">{project.name}</span>
            </div>
          </div>
        )}

        <div className="project-grid-card-overlay" aria-hidden="true" />

        {/* Action buttons (GitHub, Live URL) */}
        <div className="project-grid-card-actions">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-grid-action-btn"
              title="Ver repositório no GitHub"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Código fonte de ${project.name} no GitHub`}
            >
              <GithubIcon size={15} />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-grid-action-btn"
              title="Acessar projeto online"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Demo online de ${project.name}`}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="project-grid-card-body">
        <header className="project-grid-card-header">
          <div className="project-grid-card-title-row">
            <h2 className="project-grid-card-title">{project.name}</h2>
            <ArrowUpRight className="project-grid-card-arrow" size={17} aria-hidden="true" />
          </div>

          <p className="project-grid-card-summary">{project.summary}</p>
        </header>

        {/* Highlights summary points if present */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="project-grid-card-highlights">
            <ul className="project-grid-highlights-list">
              {project.highlights.slice(0, 2).map((highlight, idx) => (
                <li key={idx} className="project-grid-highlight-item">
                  <span className="project-grid-highlight-bullet" aria-hidden="true">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Badges */}
        <div className="project-grid-card-tech">
          <div className="project-grid-tech-list">
            
            {/* 1. MOSTRA ATÉ O 8º ITEM */}
            {project.technologies.slice(0, 8).map((tech) => {
              const cfg = technologyCategoryConfig[tech.category];
              return (
                <button
                  key={tech.id}
                  type="button"
                  className="project-grid-tech-chip"
                  title={`Filtrar por ${tech.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTechnology?.(tech.id);
                  }}
                  style={
                    {
                      "--chip-accent": cfg?.accentColor ?? "var(--primary)",
                    } as React.CSSProperties
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.iconUrl}
                    alt=""
                    className="project-grid-tech-chip-icon"
                    loading="lazy"
                    width={13}
                    height={13}
                    aria-hidden="true"
                  />
                  <span>{tech.name}</span>
                </button>
              );
            })}
            
            {/* 2. SE TIVER MAIS QUE 8, CRIA A PÍLULA EXTRA CORTANDO OS 8 PRIMEIROS */}
            {project.technologies.length > 8 && (
              <span
                className="project-grid-tech-more"
                title={project.technologies
                  .slice(8)
                  .map((t) => t.name)
                  .join(", ")}
              >
                +{project.technologies.length - 8}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
