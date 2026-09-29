"use client";

import { useState } from "react";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

export type TechnologyFilterProps = {
  technology: Technology;
  isSelected: boolean;
  onToggle: (technologyId: string) => void;
};

export function TechnologyFilter({
  technology,
  isSelected,
  onToggle,
}: TechnologyFilterProps) {
  const [imageError, setImageError] = useState(false);
  const config = technologyCategoryConfig[technology.category];
  const accentColor = config?.accentColor ?? "var(--primary)";
  const initial = technology.name ? technology.name.charAt(0).toUpperCase() : "?";

  return (
    <button
      type="button"
      className={`technology-filter-pill ${isSelected ? "technology-filter-pill-selected" : ""}`}
      onClick={() => onToggle(technology.id)}
      aria-pressed={isSelected}
      title={`${isSelected ? "Remover filtro" : "Filtrar por"} ${technology.name}`}
      style={
        {
          "--filter-accent": accentColor,
        } as React.CSSProperties
      }
    >
      {!imageError && technology.iconUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={technology.iconUrl}
          alt=""
          className="technology-filter-icon"
          loading="lazy"
          width={16}
          height={16}
          aria-hidden="true"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="technology-filter-fallback-icon" aria-hidden="true">
          {initial}
        </span>
      )}
      <span className="technology-filter-label">{technology.name}</span>
    </button>
  );
}
