"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Project } from "@/types/project";
import { technologies } from "@/data/technologies.mock";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectSearch } from "./ProjectSearch";
import { TechnologyFilterGroup } from "./TechnologyFilterGroup";
import { ProjectGrid } from "./ProjectGrid";
import "./projects-page.css";

export type ProjectsPageContentProps = {
  projects: Project[];
};

export function ProjectsPageContent({
  projects,
}: ProjectsPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const availableTechnologies = technologies;

  // Inicializamos o estado lendo diretamente a URL no primeiro load
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );

  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(() => {
    const techParam = searchParams.get("tech");

    if (!techParam) return [];

    return techParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  });

  // Estado para guardar a URL anterior e detectar
  // navegações externas (voltar/avançar do navegador)
  const [prevSearch, setPrevSearch] = useState(searchParams.toString());

  // Atualizamos o estado durante a renderização para
  // sincronizar com mudanças nos search params
  if (searchParams.toString() !== prevSearch) {
    setPrevSearch(searchParams.toString());

    const techParam = searchParams.get("tech");
    const qParam = searchParams.get("q") || "";

    if (techParam) {
      const parsed = techParam
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      setSelectedTechIds(parsed);
    } else {
      setSelectedTechIds([]);
    }

    setSearchQuery(qParam);
  }

  // Atualiza os parâmetros da URL sem recarregar a página
  const syncUrlParams = useCallback(
    (newSearch: string, newTechs: string[]) => {
      const params = new URLSearchParams();

      if (newTechs.length > 0) {
        params.set("tech", newTechs.join(","));
      }

      if (newSearch.trim().length > 0) {
        params.set("q", newSearch.trim());
      }

      const queryString = params.toString();
      const newUrl = queryString
        ? `${pathname}?${queryString}`
        : pathname;

      window.history.replaceState(null, "", newUrl);
    },
    [pathname]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    syncUrlParams(query, selectedTechIds);
  };

  const handleToggleTech = (techId: string) => {
    const nextTechs = selectedTechIds.includes(techId)
      ? selectedTechIds.filter((id) => id !== techId)
      : [...selectedTechIds, techId];

    setSelectedTechIds(nextTechs);
    syncUrlParams(searchQuery, nextTechs);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTechIds([]);
    router.replace(pathname, { scroll: false });
  };

  const filteredProjects = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          !trimmedQuery ||
          project.name.toLowerCase().includes(trimmedQuery);

        if (!matchesSearch) return false;

        if (selectedTechIds.length > 0) {
          const projectTechIds = new Set(
            project.technologies.map((t) => t.id)
          );

          const hasAllSelectedTechs = selectedTechIds.every((id) =>
            projectTechIds.has(id)
          );

          if (!hasAllSelectedTechs) return false;
        }

        return true;
      })
      .sort(
        (a, b) => (b.ranking ?? 0) - (a.ranking ?? 0)
      );
  }, [projects, searchQuery, selectedTechIds]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedTechIds.length > 0;

  return (
    <main className="projects-page-container">
      <ProjectsHeader />

      <ProjectSearch
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <TechnologyFilterGroup
        availableTechnologies={availableTechnologies}
        selectedTechIds={selectedTechIds}
        onToggleTech={handleToggleTech}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="projects-results-bar">
        <span className="projects-results-count">
          {hasActiveFilters ? (
            <>
              <span className="projects-results-count-number">
                {filteredProjects.length}
              </span>{" "}
              {filteredProjects.length === 1
                ? "projeto encontrado"
                : "projetos encontrados"}
            </>
          ) : (
            <>
              <span className="projects-results-count-number">
                {filteredProjects.length}
              </span>{" "}
              {filteredProjects.length === 1
                ? "projeto"
                : "projetos"}
            </>
          )}
        </span>
      </div>

      <ProjectGrid
        projects={filteredProjects}
        searchQuery={searchQuery}
        selectedTechIds={selectedTechIds}
        onSelectTechnology={handleToggleTech}
        onClearFilters={handleClearFilters}
      />
    </main>
  );
}