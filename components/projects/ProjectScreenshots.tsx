import React from "react";

export type ProjectScreenshotsProps = {
  images: string[];
  projectName?: string;
};

export function ProjectScreenshots({
  images,
  projectName = "Screenshot",
}: ProjectScreenshotsProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="project-screenshots-container">
      {images.map((src, index) => (
        <div key={`${src}-${index}`} className="project-screenshot-card">
          <div className="project-screenshot-window-bar">
            <div className="project-screenshot-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="project-screenshot-counter">
              {projectName} • {index + 1} de {images.length}
            </span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${projectName} - Captura de tela ${index + 1}`}
            className="project-screenshot-img"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
