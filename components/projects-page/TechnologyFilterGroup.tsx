"use client";

import { useState, useMemo } from "react";
import { RotateCcw, Filter, Search, X } from "lucide-react";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";
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
  const [techSearchQuery, setTechSearchQuery] = useState("");

  // Mantém as tecnologias agrupadas por categoria e, dentro de cada categoria,
  // ordenadas alfabeticamente. A busca continua sendo aplicada depois.
  const filteredAndSortedTechnologies = useMemo(() => {
    const categoryOrder: Record<string, number> = {
      backend: 1,
      banco_dados_orm: 2,
      frontend: 3,
      cloud_devops: 4,
      ferramentas_outros: 5,
    };

    const query = techSearchQuery.trim().toLowerCase();

    const sorted = [...availableTechnologies].sort((a, b) => {
      const orderA = categoryOrder[a.category] ?? 99;
      const orderB = categoryOrder[b.category] ?? 99;

      if (orderA !== orderB) return orderA - orderB;

      return a.name.localeCompare(b.name);
    });

    if (!query) return sorted;

    return sorted.filter((tech) => {
      const matchName = tech.name.toLowerCase().includes(query);
      const matchCategory = tech.category.toLowerCase().includes(query);

      const categoryLabel =
        technologyCategoryConfig[tech.category]?.label?.toLowerCase() ?? "";

      const matchCategoryLabel = categoryLabel.includes(query);

      return matchName || matchCategory || matchCategoryLabel;
    });
  }, [availableTechnologies, techSearchQuery]);

  return (
    <div className="technology-filters-section">
      <div className="technology-filters-top-bar">
        <div className="technology-filters-heading">
          <Filter
            size={15}
            className="technology-filters-icon"
            aria-hidden="true"
          />

          <span className="technology-filters-title">
            Filtrar por tecnologia
          </span>

          {selectedTechIds.length > 0 && (
            <span className="technology-filters-badge">
              {selectedTechIds.length}{" "}
              {selectedTechIds.length === 1 ? "ativa" : "ativas"}
            </span>
          )}
        </div>

        <div className="technology-filters-actions">
          <div className="technology-filters-search-wrapper">
            <Search
              size={14}
              className="technology-filters-search-icon"
              aria-hidden="true"
            />

            <input
              type="text"
              className="technology-filters-search-input"
              placeholder="Buscar tecnologia..."
              value={techSearchQuery}
              onChange={(e) => setTechSearchQuery(e.target.value)}
              aria-label="Buscar tecnologia no filtro"
            />

            {techSearchQuery && (
              <button
                type="button"
                className="technology-filters-search-clear"
                onClick={() => setTechSearchQuery("")}
                aria-label="Limpar busca de tecnologia"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="technology-filters-clear-btn"
            onClick={onClearFilters}
            aria-label="Limpar todos os filtros"
            aria-hidden={!hasActiveFilters}
            tabIndex={hasActiveFilters ? 0 : -1}
            style={{
              visibility: hasActiveFilters ? "visible" : "hidden",
            }}
          >
            <RotateCcw size={13} />
            <span>Limpar filtros</span>
          </button>
        </div>
      </div>

      {filteredAndSortedTechnologies.length === 0 ? (
        <div className="technology-filters-empty">
          <p>
            Nenhuma tecnologia encontrada para &ldquo;
            {techSearchQuery}
            &rdquo;
          </p>
        </div>
      ) : (
        <div className="technology-filters-pills-wrap">
          {filteredAndSortedTechnologies.map((tech) => (
            <TechnologyFilter
              key={tech.id}
              technology={tech}
              isSelected={selectedTechIds.includes(tech.id)}
              onToggle={onToggleTech}
            />
          ))}
        </div>
      )}
    </div>
  );
}