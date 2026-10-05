"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
} from "lucide-react";
import type { Project } from "@/types/project";
import { TechnologyPill } from "@/components/experience/TechnologyPill";
import { trackEvent } from "@/lib/firebase/track";

function GithubIcon({ size = 16 }: { size?: number }) {
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

export type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="project-hero">
      {/* Breadcrumb Context Navigation */}
      <nav className="project-breadcrumb" aria-label="Navegação de contexto">
        <ol
          style={{
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: 0,
            margin: 0,
          }}
        >
          <li>
            <Link href="/projetos" className="project-breadcrumb-link">
              <ArrowLeft size={14} />
              <span>Projetos</span>
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="project-breadcrumb-separator" />
          </li>
          <li aria-current="page">
            <span className="project-breadcrumb-current">{project.name}</span>
          </li>
        </ol>
      </nav>

      {/* Liquid Glass Hero Card */}
      <div className="project-hero-glass-card">
        <div className="project-hero-glow-backdrop" aria-hidden="true" />

        <div className="project-hero-layout">
          {/* Main Info Column */}
          <div className="project-hero-details">
            <div className="project-hero-header-block">
              {project.featured && (
                <div className="project-hero-tags-row">
                  <span className="project-hero-featured-badge">
                    <Sparkles size={12} />
                    <span>Destaque</span>
                  </span>
                </div>
              )}

              <h1 className="project-hero-title">{project.name}</h1>
              <p className="project-hero-summary">{project.summary}</p>
            </div>

            {/* Action Buttons (Liquid Glass Styled) */}
            {(project.repositoryUrl || project.liveUrl) && (
              <div className="project-hero-actions">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-glass-btn project-glass-btn-secondary"
                    onClick={() => {
                      void trackEvent("project_github_click", {
                        project_slug: project.slug,
                        project_name: project.name,
                        source: "project_detail",
                      });
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>Ver no GitHub</span>
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-glass-btn project-glass-btn-primary"
                    onClick={() => {
                      void trackEvent("project_demo_click", {
                        project_slug: project.slug,
                        project_name: project.name,
                        source: "project_detail",
                      });
                    }}
                  >
                    <span>Acessar Projeto</span>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            )}

            {/* Highlights List */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="project-hero-highlights-container">
                <span className="project-hero-highlights-label">
                  Principais pontos
                </span>
                <ul className="project-hero-highlights-list">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx} className="project-hero-highlight-item">
                      <span className="project-hero-highlight-bullet" aria-hidden="true">
                        •
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Grid */}
            {project.technologies.length > 0 && (
              <div className="project-hero-tech-container">
                <span className="project-hero-tech-label">
                  Tecnologias utilizadas
                </span>
                <div className="project-hero-tech-list">
                  {project.technologies.map((tech) => (
                    <TechnologyPill key={tech.id} technology={tech} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 1:1 Thumbnail Frame (Strict 1:1 ratio for both real image and fallback) */}
          <div className="project-hero-thumbnail-column">
            <div className="project-hero-thumbnail-frame">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={`Screenshot de capa de ${project.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="project-hero-thumbnail-image"
                />
              ) : (
                <div className="project-hero-thumbnail-fallback">
                  <div className="project-hero-fallback-grid" aria-hidden="true" />
                  <div className="project-hero-fallback-glow" aria-hidden="true" />
                  <div className="project-hero-fallback-content">
                    <div className="project-hero-fallback-icon-wrap">
                      <Layers className="project-hero-fallback-icon" size={32} />
                    </div>
                    <span className="project-hero-fallback-name">{project.name}</span>
                  </div>
                </div>
              )}
              <div className="project-hero-thumbnail-border-glow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

