"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ExternalLink, ArrowUpRight, Layers } from "lucide-react";
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

export type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    void trackEvent("project_card_click", {
      project_slug: project.slug,
      project_name: project.name,
      source: "home_swiper",
    });
    router.push(`/projetos/${project.slug}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="project-card"
      onClick={handleCardClick}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Visual Cover / Fallback */}
      <div className="project-card-cover-container">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`Screenshot do projeto ${project.name}`}
            className="project-card-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
        ) : (
          <div className="project-card-fallback-cover">
            <div className="project-fallback-grid" aria-hidden="true" />
            <div className="project-fallback-glow" aria-hidden="true" />
            <div className="project-fallback-content">
              <div className="project-fallback-icon-wrap">
                <Layers className="project-fallback-icon" size={28} />
              </div>
              <span className="project-fallback-name">{project.name}</span>
            </div>
          </div>
        )}

        <div className="project-card-cover-overlay" />

        {/* Quick action badges on top of image */}
        <div className="project-card-top-actions">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn"
              title="Ver repositório no GitHub"
              onClick={(e) => {
                e.stopPropagation();
                void trackEvent("project_github_click", {
                  project_slug: project.slug,
                  project_name: project.name,
                  source: "home_swiper",
                });
              }}
              aria-label={`Código fonte de ${project.name} no GitHub`}
            >
              <GithubIcon size={16} />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn"
              title="Acessar projeto online"
              onClick={(e) => {
                e.stopPropagation();
                void trackEvent("project_demo_click", {
                  project_slug: project.slug,
                  project_name: project.name,
                  source: "home_swiper",
                });
              }}
              aria-label={`Demo online de ${project.name}`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="project-card-body">
        <header className="project-card-header">
          <h3 className="project-card-title">
            <span>{project.name}</span>
            <ArrowUpRight className="project-card-arrow" size={18} aria-hidden="true" />
          </h3>

          <p className="project-card-summary">{project.summary}</p>
        </header>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="project-card-highlights">
            <ul className="project-highlights-list">
              {project.highlights.slice(0, 3).map((highlight, idx) => (
                <li key={idx} className="project-highlight-item">
                  <span className="project-highlight-bullet" aria-hidden="true">
                    •
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Pills */}
        {project.technologies.length > 0 && (
          <div className="project-card-tech">
            <div
              className="project-tech-list"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. MOSTRA ATÉ O 8º ITEM */}
              {project.technologies.slice(0, 8).map((tech) => (
                <TechnologyPill key={tech.id} technology={tech} />
              ))}
              
              {/* 2. SE TIVER MAIS QUE 8, CRIA A PÍLULA EXTRA CORTANDO OS 8 PRIMEIROS */}
              {project.technologies.length > 8 && (
                <span
                  className="tech-pill-more"
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
        )}
      </div>
    </motion.div>
  );
}
