"use client";

import { Search, X } from "lucide-react";

export type ProjectSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="project-search-container">
      <div className="project-search-input-wrapper">
        <Search className="project-search-icon" size={20} aria-hidden="true" />
        <input
          id="project-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar projetos pelo nome..."
          className="project-search-input"
          autoComplete="off"
          spellCheck="false"
          aria-label="Pesquisar projetos pelo nome"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="project-search-clear-btn"
            onClick={() => onChange("")}
            aria-label="Limpar pesquisa"
            title="Limpar pesquisa"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
