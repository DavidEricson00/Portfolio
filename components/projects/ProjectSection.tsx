import React from "react";
import type { ProjectSection as ProjectSectionType } from "@/types/project";
import { getProjectSectionConfig } from "@/types/project";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ProjectScreenshots } from "./ProjectScreenshots";

export type ProjectSectionProps = {
  section: ProjectSectionType;
  projectName?: string;
  isLast?: boolean;
};

export function ProjectSection({
  section,
  projectName = "Projeto",
  isLast = false,
}: ProjectSectionProps) {
  const config = getProjectSectionConfig(section.type);
  const IconComponent = config.icon;

  const isScreenshotsSection = section.type === "screenshots";
  const hasImages = Boolean(section.images && section.images.length > 0);

  return (
    <article id={section.id} className="project-section-item">
      {/* Timeline Node Column (Matches Home Timeline Style) */}
      <div className="project-section-node-column" aria-hidden="true">
        <div className="project-section-node-marker">
          <div className="project-section-node-dot" />
          <div className="project-section-node-glow" />
        </div>
        {!isLast && <div className="project-section-node-line" />}
      </div>

      {/* Section Content Body */}
      <div className="project-section-content">
        <header className="project-section-header">
          <div className="project-section-title-row">
            <div className="project-section-icon-badge" aria-hidden="true">
              <IconComponent size={16} />
            </div>
            <h2 className="project-section-title">{config.title}</h2>
          </div>
          <div className="project-section-divider" aria-hidden="true" />
        </header>

        {/* Markdown Content */}
        {section.content && section.content.trim().length > 0 && (
          <MarkdownRenderer content={section.content} />
        )}

        {/* Specialized Screenshots delegation */}
        {isScreenshotsSection && hasImages && section.images && (
          <ProjectScreenshots
            images={section.images}
            projectName={projectName}
          />
        )}
      </div>
    </article>
  );
}
