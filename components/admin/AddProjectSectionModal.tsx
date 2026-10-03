"use client";

import { useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
import type { ProjectSectionType } from "@/types/project";
import { projectSectionConfigs } from "@/types/project";

interface AddProjectSectionModalProps {
  isOpen: boolean;
  usedSectionTypes: ProjectSectionType[];
  onClose: () => void;
  onSelectType: (type: ProjectSectionType) => void;
}

const SECTION_TYPE_KEYS: ProjectSectionType[] = (
  Object.keys(projectSectionConfigs) as ProjectSectionType[]
).sort(
  (a, b) => projectSectionConfigs[a].order - projectSectionConfigs[b].order,
);

export function AddProjectSectionModal({
  isOpen,
  usedSectionTypes = [],
  onClose,
  onSelectType,
}: AddProjectSectionModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const usedSet = new Set(usedSectionTypes);

  return (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="admin-modal-card admin-add-section-modal">
        <div className="admin-modal-header">
          <div>
            <h2 className="admin-modal-title">Adicionar Seção</h2>
            <p className="admin-placeholder-desc" style={{ fontSize: "0.82rem", marginTop: 2 }}>
              Selecione o tipo de seção que deseja incluir no detalhamento do projeto.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-add-section-grid">
            {SECTION_TYPE_KEYS.map((type) => {
              const config = projectSectionConfigs[type];
              const Icon = config.icon;
              const isUsed = usedSet.has(type);

              return (
                <button
                  type="button"
                  key={type}
                  className={`admin-add-section-btn ${
                    isUsed ? "admin-add-section-btn-disabled" : ""
                  }`}
                  disabled={isUsed}
                  onClick={() => {
                    if (!isUsed) {
                      onSelectType(type);
                      onClose();
                    }
                  }}
                >
                  <div className="admin-add-section-icon-box">
                    <Icon size={18} />
                  </div>

                  <div className="admin-add-section-info">
                    <span className="admin-add-section-title">{config.title}</span>
                    <span className="admin-add-section-type">type: {type}</span>
                  </div>

                  <div className="admin-add-section-action-icon">
                    {isUsed ? (
                      <span className="admin-section-already-tag">
                        <Check size={12} />
                        Adicionada
                      </span>
                    ) : (
                      <Plus size={16} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
