"use client";

import { Trash2, Image as ImageIcon, Plus } from "lucide-react";
import type { ProjectSection } from "@/types/project";
import { getProjectSectionConfig } from "@/types/project";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

export interface ProjectSectionEditorProps {
  section: ProjectSection;
  onChange: (updatedSection: ProjectSection) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ProjectSectionEditor({
  section,
  onChange,
  onRemove,
  disabled = false,
}: ProjectSectionEditorProps) {
  const config = getProjectSectionConfig(section.type);
  const Icon = config.icon;

  const isScreenshots = section.type === "screenshots";
  const images = section.images || [];

  function handleContentChange(content: string) {
    onChange({
      ...section,
      content,
    });
  }

  function handleImageChange(index: number, url: string) {
    const nextImages = [...images];
    nextImages[index] = url;
    onChange({
      ...section,
      images: nextImages,
    });
  }

  function handleAddImage() {
    onChange({
      ...section,
      images: [...images, ""],
    });
  }

  function handleRemoveImage(index: number) {
    const nextImages = images.filter((_, idx) => idx !== index);
    onChange({
      ...section,
      images: nextImages,
    });
  }

  return (
    <div className="admin-section-block-card">
      {/* Section Block Header */}
      <div className="admin-section-block-header">
        <div className="admin-section-block-title-wrap">
          <div className="admin-section-block-icon">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="admin-section-block-title">{config.title}</h3>
            <span className="admin-section-block-type">
              type: <code>{section.type}</code> (Ordem #{config.order})
            </span>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-danger admin-section-remove-btn"
          onClick={onRemove}
          disabled={disabled}
          title={`Excluir seção ${config.title}`}
        >
          <Trash2 size={15} />
          <span>Remover seção</span>
        </button>
      </div>

      {/* Section Content Editor */}
      <div className="admin-section-block-body">
        {isScreenshots && (
          <div className="admin-section-screenshots-area">
            <label className="admin-form-label">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ImageIcon size={16} />
                URLs das Imagens / Screenshots
              </span>
            </label>
            <p className="admin-form-section-desc">
              Informe os links diretos das imagens de demonstração ou capturas de tela do projeto.
            </p>

            <div className="admin-dynamic-list-items" style={{ marginTop: 8 }}>
              {images.map((imgUrl, idx) => (
                <div key={idx} className="admin-dynamic-list-row">
                  <input
                    type="url"
                    className="admin-form-input admin-dynamic-list-input"
                    placeholder="https://exemplo.com/screenshot.png ou /projects/..."
                    value={imgUrl}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    className="admin-action-btn admin-action-btn-delete admin-dynamic-list-del-btn"
                    onClick={() => handleRemoveImage(idx)}
                    disabled={disabled}
                    title="Remover imagem"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {images.length === 0 && (
                <div className="admin-dynamic-list-empty">
                  <span>Nenhuma imagem adicionada para esta seção.</span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-dynamic-list-add-btn"
              onClick={handleAddImage}
              disabled={disabled}
            >
              <Plus size={16} />
              <span>Adicionar URL de imagem</span>
            </button>
          </div>
        )}

        {/* Markdown Content Field */}
        <div style={{ marginTop: isScreenshots ? 18 : 0 }}>
          <MarkdownEditor
            label={
              isScreenshots
                ? "Texto descritivo das screenshots (Opcional)"
                : undefined
            }
            value={section.content}
            onChange={handleContentChange}
            placeholder={`Escreva o conteúdo em Markdown para ${config.title.toLowerCase()}...`}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
