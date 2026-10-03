"use client";

import { useState, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import type { Technology, TechnologyCategory } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export interface TechnologySelectorProps {
  technologies: Technology[];
  selectedTechnologyIds: string[];
  onChange: (newTechnologyIds: string[]) => void;
  disabled?: boolean;
}

const CATEGORY_KEYS: TechnologyCategory[] = [
  "backend",
  "frontend",
  "banco_dados_orm",
  "cloud_devops",
  "ferramentas_outros",
];

export function TechnologySelector({
  technologies = [],
  selectedTechnologyIds = [],
  onChange,
  disabled = false,
}: TechnologySelectorProps) {
  const [search, setSearch] = useState("");

  // Map for quick lookup
  const techMap = useMemo(() => {
    return new Map(technologies.map((t) => [t.id, t]));
  }, [technologies]);

  const selectedSet = useMemo(() => {
    return new Set(selectedTechnologyIds);
  }, [selectedTechnologyIds]);

  const selectedList = useMemo(() => {
    return selectedTechnologyIds
      .map((id) => techMap.get(id))
      .filter((t): t is Technology => Boolean(t));
  }, [selectedTechnologyIds, techMap]);

  // Group technologies by category
  const filteredGroupedTechnologies = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result: Record<TechnologyCategory, Technology[]> = {
      backend: [],
      frontend: [],
      banco_dados_orm: [],
      cloud_devops: [],
      ferramentas_outros: [],
    };

    technologies.forEach((tech) => {
      const matches =
        term.length === 0 || tech.name.toLowerCase().includes(term);

      if (matches && result[tech.category]) {
        result[tech.category].push(tech);
      }
    });

    return result;
  }, [technologies, search]);

  function toggleTechnology(id: string) {
    if (disabled) return;

    if (selectedSet.has(id)) {
      onChange(selectedTechnologyIds.filter((item) => item !== id));
    } else {
      onChange([...selectedTechnologyIds, id]);
    }
  }

  function removeTechnology(id: string) {
    if (disabled) return;
    onChange(selectedTechnologyIds.filter((item) => item !== id));
  }

  return (
    <div className="admin-tech-selector-container">
      {/* Search Input */}
      <div className="admin-search-wrapper admin-tech-selector-search">
        <Search size={16} className="admin-search-icon" />
        <input
          type="search"
          className="admin-search-input"
          placeholder="Pesquisar tecnologias para selecionar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Selected Items Bar */}
      {selectedList.length > 0 && (
        <div className="admin-tech-selector-selected-box">
          <div className="admin-tech-selector-selected-header">
            <span className="admin-tech-selector-selected-label">
              Selecionadas ({selectedList.length}):
            </span>
            <button
              type="button"
              className="admin-tech-selector-clear-btn"
              onClick={() => onChange([])}
              disabled={disabled}
            >
              Limpar todas
            </button>
          </div>

          <div className="admin-tech-selector-selected-chips">
            {selectedList.map((tech) => {
              const categoryConfig = technologyCategoryConfig[tech.category];

              return (
                <button
                  type="button"
                  key={tech.id}
                  className="admin-tech-chip admin-tech-chip-active"
                  style={{
                    borderColor: categoryConfig?.hoverBorder || "rgba(108, 140, 255, 0.4)",
                    backgroundColor: categoryConfig?.hoverBg || "rgba(108, 140, 255, 0.12)",
                  }}
                  onClick={() => removeTechnology(tech.id)}
                  disabled={disabled}
                  title={`Remover ${tech.name}`}
                >
                  <span className="admin-tech-chip-text">{tech.name}</span>
                  <X size={14} className="admin-tech-chip-remove" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorized Options */}
      <div className="admin-tech-selector-groups">
        {CATEGORY_KEYS.map((catKey) => {
          const catConfig = technologyCategoryConfig[catKey];
          const items = filteredGroupedTechnologies[catKey] || [];

          if (items.length === 0) return null;

          return (
            <div key={catKey} className="admin-tech-selector-category-section">
              <div className="admin-tech-selector-cat-title">
                <span
                  className="admin-tech-selector-cat-dot"
                  style={{ backgroundColor: catConfig.accentColor }}
                />
                <span>{catConfig.label}</span>
                <span className="admin-tech-selector-cat-count">
                  ({items.length})
                </span>
              </div>

              <div className="admin-tech-selector-grid">
                {items.map((tech) => {
                  const isSelected = selectedSet.has(tech.id);

                  return (
                    <button
                      type="button"
                      key={tech.id}
                      onClick={() => toggleTechnology(tech.id)}
                      disabled={disabled}
                      className={`admin-tech-option-btn ${
                        isSelected ? "admin-tech-option-selected" : ""
                      }`}
                      style={
                        isSelected
                          ? {
                              borderColor: catConfig.hoverBorder,
                              backgroundColor: catConfig.hoverBg,
                              color: "#ffffff",
                            }
                          : undefined
                      }
                    >
                      <div className="admin-tech-option-icon">
                        {isSelected ? (
                          <Check size={14} style={{ color: catConfig.accentColor }} />
                        ) : (
                          <span
                            className="admin-tech-option-indicator"
                            style={{ borderColor: catConfig.accentColor }}
                          />
                        )}
                      </div>
                      <span className="admin-tech-option-name">{tech.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {technologies.length === 0 && (
          <div className="admin-dynamic-list-empty">
            <span>Nenhuma tecnologia cadastrada no sistema.</span>
          </div>
        )}
      </div>
    </div>
  );
}
