"use client";

import { useMemo } from "react";
import { RotateCcw, Filter } from "lucide-react";
import type { Technology } from "@/types/technology";
import { TechnologyFilter } from "./TechnologyFilter";

export type TechnologyFilterGroupProps = {
  availableTechnologies: Technology[];
  selectedTechIds: string[];
  onToggleTech: (techId: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
};

export function TechnologyFilterGroup({
  availableTechnologies,
  selectedTechIds,
  onToggleTech,
  onClearFilters,
  hasActiveFilters,
}: TechnologyFilterGroupProps) {
  // Sort technologies by category order or alphabetically for neat layout
  const sortedTechnologies = useMemo(() => {
    const categoryOrder: Record<string, number> = {
      backend: 1,
      banco_dados_orm: 2,
      frontend: 3,
      cloud_devops: 4,
      ferramentas_outros: 5,
    };

    return [...availableTechnologies].sort((a, b) => {
      const orderA = categoryOrder[a.category] ?? 99;
      const orderB = categoryOrder[b.category] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [availableTechnologies]);

  return (
    <div className="technology-filters-section">
      <div className="technology-filters-top-bar">
        <div className="technology-filters-heading">
          <Filter size={15} className="technology-filters-icon" aria-hidden="true" />
          <span className="technology-filters-title">Filtrar por tecnologia</span>
          {selectedTechIds.length > 0 && (
            <span className="technology-filters-badge">
              {selectedTechIds.length} {selectedTechIds.length === 1 ? "ativa" : "ativas"}
            </span>
          )}
        </div>

        <button
          type="button"
          className="technology-filters-clear-btn"
          onClick={onClearFilters}
          aria-label="Limpar todos os filtros"
          aria-hidden={!hasActiveFilters}
          tabIndex={hasActiveFilters ? 0 : -1}
          style={{ visibility: hasActiveFilters ? "visible" : "hidden" }}
        >
          <RotateCcw size={13} />
          <span>Limpar filtros</span>
        </button>
      </div>

      <div className="technology-filters-pills-wrap">
        {sortedTechnologies.map((tech) => (
          <TechnologyFilter
            key={tech.id}
            technology={tech}
            isSelected={selectedTechIds.includes(tech.id)}
            onToggle={onToggleTech}
          />
        ))}
      </div>
    </div>
  );
}
