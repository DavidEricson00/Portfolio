"use client";

import type { Project } from "@/types/project";
import { ProjectGridCard } from "./ProjectGridCard";
import { EmptyProjectsState } from "./EmptyProjectsState";

export type ProjectGridProps = {
  projects: Project[];
  searchQuery: string;
  selectedTechIds: string[];
  onSelectTechnology?: (techId: string) => void;
  onClearFilters: () => void;
};

/**
 * ProjectGrid
 *
 * Animação: cards entram/saem com fade CSS simples.
 * A reorganização da grid acontece pelo layout CSS grid normal -
 * sem layout animation (evita o efeito "gelatina" do motion layout).
 *
 * Cada card recebe a classe "card-visible" quando está presente,
 * e a transição CSS faz o fade de forma suave e não intrusiva.
 */
export function ProjectGrid({
  projects,
  searchQuery,
  selectedTechIds,
  onSelectTechnology,
  onClearFilters,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyProjectsState
        searchQuery={searchQuery}
        selectedTechCount={selectedTechIds.length}
        onClear={onClearFilters}
      />
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div key={project.id} className="project-grid-card-wrapper card-visible">
          <ProjectGridCard
            project={project}
            onSelectTechnology={onSelectTechnology}
          />
        </div>
      ))}
    </div>
  );
}
