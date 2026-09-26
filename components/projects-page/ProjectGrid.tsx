"use client";

import { AnimatePresence } from "motion/react";
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
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <ProjectGridCard
            key={project.id}
            project={project}
            onSelectTechnology={onSelectTechnology}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
