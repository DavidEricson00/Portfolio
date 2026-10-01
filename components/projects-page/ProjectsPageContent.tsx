"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Project } from "@/types/project";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectSearch } from "./ProjectSearch";
import { TechnologyFilterGroup } from "./TechnologyFilterGroup";
import { ProjectGrid } from "./ProjectGrid";
import "./projects-page.css";
import type { Technology } from "@/types/technology";

type ProjectsPageContentProps = {
  projects: Project[];
  technologies: Technology[];
};

type ProjectsUIProps = {
  projects: Project[];
  technologies: Technology[];
  searchQuery: string;
  selectedTechIds: string[];
  onSearchChange: (query: string) => void;
  onToggleTech: (techId: string) => void;
  onClearFilters: () => void;
};

function ProjectsUI({
  projects,
  technologies,
  searchQuery,
  selectedTechIds,
  onSearchChange,
  onToggleTech,
  onClearFilters,
}: ProjectsUIProps) {
  const availableTechnologies = technologies;

  const filteredProjects = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          !trimmedQuery || project.name.toLowerCase().includes(trimmedQuery);

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
      .sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
  }, [projects, searchQuery, selectedTechIds]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedTechIds.length > 0;

  return (
    <main className="projects-page-container">
      <ProjectsHeader />

      <ProjectSearch value={searchQuery} onChange={onSearchChange} />

      <TechnologyFilterGroup
        availableTechnologies={availableTechnologies}
        selectedTechIds={selectedTechIds}
        onToggleTech={onToggleTech}
        onClearFilters={onClearFilters}
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
              {filteredProjects.length === 1 ? "projeto" : "projetos"}
            </>
          )}
        </span>
      </div>

      <ProjectGrid
        projects={filteredProjects}
        searchQuery={searchQuery}
        selectedTechIds={selectedTechIds}
        onSelectTechnology={onToggleTech}
        onClearFilters={onClearFilters}
      />
    </main>
  );
}

function ProjectsLogic({
  projects,
  technologies,
}: ProjectsPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const [prevSearch, setPrevSearch] = useState(searchParams.toString());

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
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

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

  return (
    <ProjectsUI
      projects={projects}
      technologies={technologies}
      searchQuery={searchQuery}
      selectedTechIds={selectedTechIds}
      onSearchChange={handleSearchChange}
      onToggleTech={handleToggleTech}
      onClearFilters={handleClearFilters}
    />
  );
}

export function ProjectsPageContent({
  projects,
  technologies,
}: ProjectsPageContentProps) {
  return (
    <Suspense
      fallback={
        <ProjectsUI
          projects={projects}
          technologies={technologies}
          searchQuery=""
          selectedTechIds={[]}
          onSearchChange={() => {}}
          onToggleTech={() => {}}
          onClearFilters={() => {}}
        />
      }
    >
      <ProjectsLogic
        projects={projects}
        technologies={technologies}
      />
    </Suspense>
  );
}