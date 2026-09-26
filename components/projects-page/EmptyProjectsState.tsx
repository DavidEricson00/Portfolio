"use client";

import { motion } from "motion/react";
import { FolderSearch, RotateCcw } from "lucide-react";

export type EmptyProjectsStateProps = {
  searchQuery: string;
  selectedTechCount: number;
  onClear: () => void;
};

export function EmptyProjectsState({
  searchQuery,
  selectedTechCount,
  onClear,
}: EmptyProjectsStateProps) {
  return (
    <motion.div
      className="projects-empty-state"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="projects-empty-icon-box">
        <FolderSearch className="projects-empty-icon" size={36} />
      </div>

      <h3 className="projects-empty-title">Nenhum projeto encontrado</h3>

      <p className="projects-empty-description">
        {searchQuery && selectedTechCount > 0
          ? `Nenhum projeto combinou com o termo "${searchQuery}" e as ${selectedTechCount} tecnologias selecionadas.`
          : searchQuery
            ? `Nenhum projeto corresponde ao termo "${searchQuery}".`
            : "Nenhum projeto corresponde às tecnologias selecionadas."}
      </p>

      <button
        type="button"
        className="button button-primary projects-empty-clear-btn"
        onClick={onClear}
      >
        <RotateCcw size={15} />
        <span>Limpar filtros e pesquisa</span>
      </button>
    </motion.div>
  );
}
