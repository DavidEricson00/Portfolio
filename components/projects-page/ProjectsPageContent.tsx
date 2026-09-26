"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getAllProjects, getAvailableProjectTechnologies } from "@/data/projects.mock";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectSearch } from "./ProjectSearch";
import { TechnologyFilterGroup } from "./TechnologyFilterGroup";
import { ProjectGrid } from "./ProjectGrid";
import "./projects-page.css";

export function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // All projects sorted by ranking descending
  const allProjects = useMemo(() => getAllProjects(), []);
  const availableTechnologies = useMemo(() => getAvailableProjectTechnologies(), []);

  // Initialize filters from search params
  const initialTechs = useMemo(() => {
    const techParam = searchParams.get("tech");
    if (!techParam) return [];
    return techParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }, [searchParams]);

  const initialSearch = useMemo(() => {
    return searchParams.get("q") || "";
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(initialTechs);

  // Sync state when URL searchParams change (e.g. from back/forward navigation or clicking external link)
  useEffect(() => {
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
  }, [searchParams]);

  // Update URL search params when filters change without reload
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

  // Handler for search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    syncUrlParams(query, selectedTechIds);
  };

  // Handler for toggling a tech filter
  const handleToggleTech = (techId: string) => {
    const nextTechs = selectedTechIds.includes(techId)
      ? selectedTechIds.filter((id) => id !== techId)
      : [...selectedTechIds, techId];

    setSelectedTechIds(nextTechs);
    syncUrlParams(searchQuery, nextTechs);
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTechIds([]);
    router.replace(pathname, { scroll: false });
  };

  // Filter projects based on search query (case-insensitive name) and selected technologies (AND condition)
  const filteredProjects = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return allProjects.filter((project) => {
      // Name match
      const matchesSearch =
        !trimmedQuery || project.name.toLowerCase().includes(trimmedQuery);

      if (!matchesSearch) return false;

      // Technology match (must have ALL selected technologies)
      if (selectedTechIds.length > 0) {
        const projectTechIds = new Set(project.technologies.map((t) => t.id));
        const hasAllSelectedTechs = selectedTechIds.every((id) =>
          projectTechIds.has(id)
        );
        if (!hasAllSelectedTechs) return false;
      }

      return true;
    });
  }, [allProjects, searchQuery, selectedTechIds]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedTechIds.length > 0;

  return (
    <main className="projects-page-container">
      {/* Page Header */}
      <ProjectsHeader />

      {/* Search Bar */}
      <ProjectSearch
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Technology Filters */}
      <TechnologyFilterGroup
        availableTechnologies={availableTechnologies}
        selectedTechIds={selectedTechIds}
        onToggleTech={handleToggleTech}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Count Bar */}
      <div className="projects-results-bar">
        <span className="projects-results-count">
          {hasActiveFilters ? (
            <>
              <span className="projects-results-count-number">{filteredProjects.length}</span>{" "}
              {filteredProjects.length === 1 ? "projeto encontrado" : "projetos encontrados"}
            </>
          ) : (
            <>
              <span className="projects-results-count-number">{filteredProjects.length}</span>{" "}
              {filteredProjects.length === 1 ? "projeto" : "projetos"}
            </>
          )}
        </span>
      </div>

      {/* Projects Grid or Empty State */}
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
