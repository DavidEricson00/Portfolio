"use client";

import { useEffect, useRef, useState } from "react";
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
  // Conjunto de IDs que devem estar visíveis agora
  const visibleIds = new Set(projects.map((p) => p.id));

  // Mantém uma lista "renderizada" = projetos que ainda precisam estar no DOM
  // para terminar a animação de saída antes de desmontar.
  const [renderedProjects, setRenderedProjects] = useState<Project[]>(projects);
  const [fadedInIds, setFadedInIds] = useState<Set<string>>(
    new Set(projects.map((p) => p.id))
  );

  // Ref para controlar timeouts de remoção
  const removalTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const nextVisibleIds = new Set(projects.map((p) => p.id));

    // Cancela timers de remoção para projetos que voltaram
    for (const id of nextVisibleIds) {
      const timer = removalTimersRef.current.get(id);
      if (timer !== undefined) {
        clearTimeout(timer);
        removalTimersRef.current.delete(id);
      }
    }

    // Adiciona novos projetos ao DOM imediatamente (ainda sem fade-in)
    setRenderedProjects((prev) => {
      const prevIds = new Set(prev.map((p) => p.id));
      const toAdd = projects.filter((p) => !prevIds.has(p.id));
      // mantém ordem: primeiro os que já existiam, depois os novos
      const merged = [
        ...prev.filter((p) => prevIds.has(p.id)),
        ...toAdd,
      ];
      return merged;
    });

    // Agenda fade-in para projetos novos (next frame)
    requestAnimationFrame(() => {
      setFadedInIds(new Set(projects.map((p) => p.id)));
    });

    // Agenda remoção do DOM dos projetos que saíram (após animação de saída)
    setRenderedProjects((prev) => {
      const exitingIds = prev
        .map((p) => p.id)
        .filter((id) => !nextVisibleIds.has(id));

      for (const id of exitingIds) {
        if (!removalTimersRef.current.has(id)) {
          const timer = setTimeout(() => {
            setRenderedProjects((curr) => curr.filter((p) => p.id !== id));
            removalTimersRef.current.delete(id);
          }, 220); // duração da animação de saída
          removalTimersRef.current.set(id, timer);
        }
      }

      return prev; // não muda imediatamente
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of removalTimersRef.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (projects.length === 0 && renderedProjects.length === 0) {
    return (
      <EmptyProjectsState
        searchQuery={searchQuery}
        selectedTechCount={selectedTechIds.length}
        onClear={onClearFilters}
      />
    );
  }

  return (
    <>
      <div className="projects-grid">
        {renderedProjects.map((project) => (
          <div
            key={project.id}
            className={`project-grid-card-wrapper ${
              fadedInIds.has(project.id) ? "card-visible" : "card-hidden"
            }`}
          >
            <ProjectGridCard
              project={project}
              onSelectTechnology={onSelectTechnology}
            />
          </div>
        ))}
      </div>
      {/* Empty state aparece abaixo da grid enquanto os cards saem */}
      {projects.length === 0 && renderedProjects.length > 0 && (
        <EmptyProjectsState
          searchQuery={searchQuery}
          selectedTechCount={selectedTechIds.length}
          onClear={onClearFilters}
        />
      )}
    </>
  );
}
