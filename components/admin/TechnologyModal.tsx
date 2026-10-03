"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, Save, Plus, ChevronDown } from "lucide-react";
import type { Technology, TechnologyCategory, TechnologyInput } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";

interface TechnologyModalProps {
  isOpen: boolean;
  technologyToEdit?: Technology | null;
  onClose: () => void;
  onSave: (data: TechnologyInput) => Promise<void>;
}

const CATEGORY_OPTIONS: TechnologyCategory[] = [
  "backend",
  "frontend",
  "banco_dados_orm",
  "cloud_devops",
  "ferramentas_outros",
];

interface FormContentProps {
  technologyToEdit?: Technology | null;
  onClose: () => void;
  onSave: (data: TechnologyInput) => Promise<void>;
}

function TechnologyModalForm({
  technologyToEdit,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(technologyToEdit);

  const [name, setName] = useState(technologyToEdit?.name || "");
  const [category, setCategory] = useState<TechnologyCategory>(
    technologyToEdit?.category || "backend"
  );
  const [ranking, setRanking] = useState(technologyToEdit?.ranking ?? 80);
  const [featured, setFeatured] = useState(Boolean(technologyToEdit?.featured));
  const [iconUrl, setIconUrl] = useState(technologyToEdit?.iconUrl || "");
  const [iconPreviewError, setIconPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "O nome da tecnologia é obrigatório.";
    }

    if (!category || !CATEGORY_OPTIONS.includes(category)) {
      newErrors.category = "Selecione uma categoria válida.";
    }

    const rankNum = Number(ranking);
    if (isNaN(rankNum) || rankNum < 1 || rankNum > 100) {
      newErrors.ranking = "O ranking deve ser um número entre 1 e 100.";
    }

    if (iconUrl.trim()) {
      try {
        const url = new URL(iconUrl.trim(), "http://localhost");
        if (!url.protocol.startsWith("http") && !iconUrl.startsWith("/")) {
          newErrors.iconUrl = "Informe uma URL válida (ex: https://... ou /icons/...).";
        }
      } catch {
        newErrors.iconUrl = "Informe uma URL válida.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const data: TechnologyInput = {
        name: name.trim(),
        category,
        ranking: Number(ranking),
        featured,
        ...(iconUrl.trim() ? { iconUrl: iconUrl.trim() } : {}),
      };

      await onSave(data);
    } catch (err) {
      console.error("Erro ao salvar tecnologia:", err);
      setErrors({ form: "Ocorreu um erro ao salvar a tecnologia. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  const categoryConfig = technologyCategoryConfig[category];
  const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : "?";
  const showFallback = iconPreviewError || !iconUrl.trim();

  return (
    <div className="admin-modal-card">
      <div className="admin-modal-header">
        <h2 className="admin-modal-title">
          {isEditing ? "Editar tecnologia" : "Nova tecnologia"}
        </h2>
        <button
          type="button"
          className="admin-modal-close-btn"
          onClick={onClose}
          disabled={loading}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <div className="admin-modal-body">
          {errors.form && (
            <div className="admin-login-error" role="alert">
              <span>{errors.form}</span>
            </div>
          )}

          {/* Nome */}
          <div className="admin-form-group">
            <label htmlFor="tech-name" className="admin-form-label">
              <span>Nome da tecnologia</span>
              <span className="required">*</span>
            </label>
            <input
              id="tech-name"
              type="text"
              placeholder="Ex: Next.js, PostgreSQL, Docker..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`admin-form-input ${errors.name ? "admin-form-input-error" : ""}`}
              autoFocus
              disabled={loading}
            />
            {errors.name && <span className="admin-form-error-msg">{errors.name}</span>}
          </div>

          {/* Categoria */}
          <div className="admin-form-group">
            <label htmlFor="tech-category" className="admin-form-label">
              <span>Categoria</span>
              <span className="required">*</span>
            </label>

            <div className="admin-select-wrapper">
              <select
                id="tech-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TechnologyCategory)
                }
                className={`admin-form-select ${
                  errors.category ? "admin-form-input-error" : ""
                }`}
                disabled={loading}
              >
                {CATEGORY_OPTIONS.map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {technologyCategoryConfig[catKey].label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={22}
                className="admin-select-icon"
                aria-hidden="true"
              />
            </div>

            {errors.category && (
              <span className="admin-form-error-msg">
                {errors.category}
              </span>
            )}
          </div>

          {/* Ranking */}
          <div className="admin-form-group">
            <label htmlFor="tech-ranking" className="admin-form-label">
              <span>Ranking de relevância (1 a 100)</span>
              <span className="required">*</span>
            </label>

            <div className="admin-range-container">
              <span className="admin-range-value">{ranking}</span>

              <input
                id="tech-ranking"
                type="range"
                min={1}
                max={100}
                value={ranking}
                onChange={(e) => setRanking(Number(e.target.value))}
                className="admin-range-slider"
                disabled={loading}
              />
            </div>

            {errors.ranking && (
              <span className="admin-form-error-msg">{errors.ranking}</span>
            )}
          </div>

          {/* Featured */}
          <div className="admin-form-group">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                disabled={loading}
              />
              <div className="admin-checkbox-custom">
                ✓
              </div>
              <span className="admin-checkbox-text">
                Exibir como tecnologia em destaque (Featured)
              </span>
            </label>
          </div>

          {/* URL do Ícone */}
          <div className="admin-form-group">
            <label htmlFor="tech-icon-url" className="admin-form-label">
              <span>URL do Ícone (Opcional)</span>
            </label>
            <div className="admin-icon-preview-row">
              <div className="admin-icon-preview-box">
                {!showFallback ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={iconUrl.trim()}
                    alt=""
                    className="admin-tech-icon-img"
                    onError={() => setIconPreviewError(true)}
                  />
                ) : (
                  <span
                    className="admin-tech-icon-fallback"
                    style={{ color: categoryConfig?.accentColor }}
                  >
                    {initial}
                  </span>
                )}
              </div>
              <input
                id="tech-icon-url"
                type="text"
                placeholder="https://cdn.jsdelivr.net/... ou /icons/..."
                value={iconUrl}
                onChange={(e) => {
                  setIconUrl(e.target.value);
                  setIconPreviewError(false);
                  if (errors.iconUrl) setErrors((prev) => ({ ...prev, iconUrl: "" }));
                }}
                className={`admin-form-input ${errors.iconUrl ? "admin-form-input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.iconUrl && (
              <span className="admin-form-error-msg">{errors.iconUrl}</span>
            )}
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="admin-loading-spinner"
                  style={{ width: 16, height: 16, borderWidth: 2 }}
                />
                <span>Salvando...</span>
              </>
            ) : isEditing ? (
              <>
                <Save size={16} />
                <span>Salvar alterações</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Criar tecnologia</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function TechnologyModal({
  isOpen,
  technologyToEdit,
  onClose,
  onSave,
}: TechnologyModalProps) {
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
      <TechnologyModalForm
        key={technologyToEdit?.id ?? "new"}
        technologyToEdit={technologyToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
