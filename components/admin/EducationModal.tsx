"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, Save, Plus, ChevronDown } from "lucide-react";
import type {
  Education,
  EducationCategory,
} from "@/types/education";
import { educationCategoryConfig } from "@/types/education";
import { DynamicTextList } from "@/components/admin/DynamicTextList";
import { ConfirmSaveModal } from "@/components/admin/ConfirmSaveModal";
import { slugify } from "@/lib/utils/slugify";

interface EducationModalProps {
  isOpen: boolean;
  educationToEdit?: Education | null;
  onClose: () => void;
  onSave: (
    id: string,
    data: Omit<Education, "id">,
    isEditing: boolean,
  ) => Promise<void>;
}

const CATEGORY_KEYS: EducationCategory[] = [
  "graduacao",
  "tecnico",
  "curso",
  "certificacao",
  "bootcamp",
];

interface FormContentProps {
  educationToEdit?: Education | null;
  onClose: () => void;
  onSave: (
    id: string,
    data: Omit<Education, "id">,
    isEditing: boolean,
  ) => Promise<void>;
}

function EducationModalForm({
  educationToEdit,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(educationToEdit);

  const [category, setCategory] = useState<EducationCategory>(
    educationToEdit?.category || "graduacao",
  );
  const [institution, setInstitution] = useState(
    educationToEdit?.institution || "",
  );
  const [title, setTitle] = useState(educationToEdit?.title || "");
  const [startDate, setStartDate] = useState(
    educationToEdit?.startDate || "",
  );
  const [endDate, setEndDate] = useState(educationToEdit?.endDate || "");
  const [workload, setWorkload] = useState(
    educationToEdit?.workload || "",
  );
  const [grade, setGrade] = useState(educationToEdit?.grade || "");
  const [highlights, setHighlights] = useState<string[]>(
    educationToEdit?.highlights || [],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "O título da formação é obrigatório.";
    }

    if (!institution.trim()) {
      newErrors.institution = "A instituição de ensino é obrigatória.";
    }

    if (!category || !CATEGORY_KEYS.includes(category)) {
      newErrors.category = "Selecione uma categoria válida.";
    }

    if (!startDate.trim()) {
      newErrors.startDate = "A data ou ano inicial é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function executeSave() {
    setLoading(true);
    try {
      // Clean highlights - ignore empty strings
      const cleanedHighlights = highlights
        .map((h) => h.trim())
        .filter(Boolean);

      const data: Omit<Education, "id"> = {
        category,
        institution: institution.trim(),
        title: title.trim(),
        startDate: startDate.trim(),
        ...(endDate.trim() ? { endDate: endDate.trim() } : {}),
        ...(workload.trim() ? { workload: workload.trim() } : {}),
        ...(grade.trim() ? { grade: grade.trim() } : {}),
        ...(cleanedHighlights.length > 0
          ? { highlights: cleanedHighlights }
          : {}),
      };

      let id = educationToEdit?.id;
      if (!id) {
        // Generate a safe unique ID
        const generatedSlug = slugify(
          `${institution.trim()}-${title.trim()}`,
        );
        id = generatedSlug || `education-${Date.now()}`;
      }

      await onSave(id, data, isEditing);
      setIsConfirmSaveOpen(false);
    } catch (err) {
      console.error("Erro ao salvar formação:", err);
      setErrors({
        form: "Ocorreu um erro ao salvar a formação. Tente novamente.",
      });
      setIsConfirmSaveOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    if (isEditing) {
      setIsConfirmSaveOpen(true);
      return;
    }

    await executeSave();
  }

  return (
    <div className="admin-modal-card admin-modal-card-lg">
      <div className="admin-modal-header">
        <h2 className="admin-modal-title">
          {isEditing ? "Editar formação" : "Nova formação"}
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

          {/* Categoria e Instituição */}
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label htmlFor="edu-category" className="admin-form-label">
                <span>Categoria</span>
                <span className="required">*</span>
              </label>
                <div className="admin-select-wrapper">
                  <select
                    id="edu-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as EducationCategory)
                    }
                    className={`admin-form-select ${
                      errors.category ? "admin-form-input-error" : ""
                    }`}
                    disabled={loading}
                  >
                    {CATEGORY_KEYS.map((catKey) => {
                      const config = educationCategoryConfig[catKey];

                      return (
                        <option key={catKey} value={catKey}>
                          {config.label}
                        </option>
                      );
                    })}
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

            <div className="admin-form-group" style={{ flex: 1.5 }}>
              <label
                htmlFor="edu-institution"
                className="admin-form-label"
              >
                <span>Instituição</span>
                <span className="required">*</span>
              </label>
              <input
                id="edu-institution"
                type="text"
                placeholder="Ex: IFCE, Alura, Rocketseat..."
                value={institution}
                onChange={(e) => {
                  setInstitution(e.target.value);
                  if (errors.institution)
                    setErrors((prev) => ({ ...prev, institution: "" }));
                }}
                className={`admin-form-input ${
                  errors.institution ? "admin-form-input-error" : ""
                }`}
                disabled={loading}
              />
              {errors.institution && (
                <span className="admin-form-error-msg">
                  {errors.institution}
                </span>
              )}
            </div>
          </div>

          {/* Título da Formação */}
          <div className="admin-form-group">
            <label htmlFor="edu-title" className="admin-form-label">
              <span>Título / Nome do Curso</span>
              <span className="required">*</span>
            </label>
            <input
              id="edu-title"
              type="text"
              placeholder="Ex: Bacharelado em Sistemas de Informação"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title)
                  setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`admin-form-input ${
                errors.title ? "admin-form-input-error" : ""
              }`}
              disabled={loading}
            />
            {errors.title && (
              <span className="admin-form-error-msg">{errors.title}</span>
            )}
          </div>

          {/* Datas (Início e Fim) */}
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label htmlFor="edu-startDate" className="admin-form-label">
                <span>Data de Início</span>
                <span className="required">*</span>
              </label>
              <input
                id="edu-startDate"
                type="text"
                placeholder="Ex: 2023 ou 02/2023"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate)
                    setErrors((prev) => ({ ...prev, startDate: "" }));
                }}
                className={`admin-form-input ${
                  errors.startDate ? "admin-form-input-error" : ""
                }`}
                disabled={loading}
              />
              {errors.startDate && (
                <span className="admin-form-error-msg">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div className="admin-form-group" style={{ flex: 1 }}>
              <label htmlFor="edu-endDate" className="admin-form-label">
                <span>Data de Conclusão / Término</span>
              </label>
              <input
                id="edu-endDate"
                type="text"
                placeholder="Ex: 2027 ou 12/2027 (deixe vazio se atual)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="admin-form-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Carga Horária e Nota / CR */}
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label htmlFor="edu-workload" className="admin-form-label">
                <span>Carga Horária (Opcional)</span>
              </label>
              <input
                id="edu-workload"
                type="text"
                placeholder="Ex: 3200h, 4 anos, 40h..."
                value={workload}
                onChange={(e) => setWorkload(e.target.value)}
                className="admin-form-input"
                disabled={loading}
              />
            </div>

            <div className="admin-form-group" style={{ flex: 1 }}>
              <label htmlFor="edu-grade" className="admin-form-label">
                <span>Nota / Média / CR (Opcional)</span>
              </label>
              <input
                id="edu-grade"
                type="text"
                placeholder="Ex: 9.4 ou 9.4/10"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="admin-form-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* DynamicTextList para Highlights */}
          <div className="admin-form-group" style={{ marginTop: 8 }}>
            <DynamicTextList
              label="Destaques / Principais Aprendizados"
              description="Adicione tópicos relevantes sobre a sua formação acadêmica ou curso."
              items={highlights}
              onChange={setHighlights}
              placeholder="Ex: Monitor de Estruturas de Dados e Algoritmos..."
              addButtonText="Adicionar destaque"
              emptyText="Nenhum destaque adicionado ainda."
              disabled={loading}
            />
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
                <span>Criar formação</span>
              </>
            )}
          </button>
        </div>
      </form>

      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        itemName={title.trim() || undefined}
        loading={loading}
        onClose={() => setIsConfirmSaveOpen(false)}
        onConfirm={executeSave}
      />
    </div>
  );
}

export function EducationModal({
  isOpen,
  educationToEdit,
  onClose,
  onSave,
}: EducationModalProps) {
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
      <EducationModalForm
        key={educationToEdit?.id ?? "new"}
        educationToEdit={educationToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
