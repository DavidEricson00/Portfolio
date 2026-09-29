import React from "react";
import Image from "next/image";

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

          <Image
            src={src}
            alt={`${projectName} - Captura de tela ${index + 1}`}
            className="project-screenshot-img"
            width={1365}
            height={768}
            sizes="(max-width: 768px) 100vw, 860px"
          />
        </div>
      ))}
    </div>
  );
}
