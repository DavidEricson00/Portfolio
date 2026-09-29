"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
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

// ----------------------------------------------------------------------
// 1. COMPONENTE DE UI PURO (APRESENTAÇÃO)
// Não sabe nada sobre URL, rotas ou Suspense. Apenas renderiza os dados.
// ----------------------------------------------------------------------
type ProjectsUIProps = {
  projects: Project[];
  searchQuery: string;
  selectedTechIds: string[];
  onSearchChange: (query: string) => void;
  onToggleTech: (techId: string) => void;
  onClearFilters: () => void;
};

function ProjectsUI({
  projects,
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

// ----------------------------------------------------------------------
// 2. COMPONENTE LÓGICO (CLIENT-SIDE COM HOOKS DE NAVEGAÇÃO)
// Lê a URL e passa os estados para o componente de apresentação
// ----------------------------------------------------------------------
function ProjectsLogic({ projects }: ProjectsPageContentProps) {
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
      searchQuery={searchQuery}
      selectedTechIds={selectedTechIds}
      onSearchChange={handleSearchChange}
      onToggleTech={handleToggleTech}
      onClearFilters={handleClearFilters}
    />
  );
}

// ----------------------------------------------------------------------
// 3. EXPORT PRINCIPAL (WRAPPER COM SUSPENSE E FALLBACK ESTATICO)
// ----------------------------------------------------------------------
export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  return (
    <Suspense
      // Este Fallback renderiza a UI estática com os filtros zerados.
      // É exatamente isso que os Crawlers de SEO e o HTML Inicial (SSR) verão.
      fallback={
        <ProjectsUI
          projects={projects}
          searchQuery=""
          selectedTechIds={[]}
          onSearchChange={() => {}}
          onToggleTech={() => {}}
          onClearFilters={() => {}}
        />
      }
    >
      {/* Somente a parte lógica que utiliza useSearchParams é suspensa */}
      <ProjectsLogic projects={projects} />
    </Suspense>
  );
}