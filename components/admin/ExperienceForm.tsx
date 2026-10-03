"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Briefcase,
  Calendar,
  MapPin,
  Building,
} from "lucide-react";
import type {
  ExperienceInput,
  ExperienceWithTechnologies,
} from "@/types/experience";
import type { Technology } from "@/types/technology";
import { TechnologySelector } from "@/components/admin/TechnologySelector";
import { DynamicTextList } from "@/components/admin/DynamicTextList";
import { ConfirmSaveModal } from "@/components/admin/ConfirmSaveModal";
import { createExperience, updateExperience } from "@/lib/data/experiences";
import { slugify } from "@/lib/utils/slugify";

interface ExperienceFormProps {
  initialData?: ExperienceWithTechnologies | null;
  technologies: Technology[];
  isEditing?: boolean;
}

export default function ExperienceForm({
  initialData,
  technologies = [],
  isEditing = false,
}: ExperienceFormProps) {
  const router = useRouter();

  const [role, setRole] = useState(initialData?.role || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");

  const [isCurrent, setIsCurrent] = useState(
    isEditing ? initialData?.endDate === null : false,
  );

  const [endDate, setEndDate] = useState(initialData?.endDate || "");

  const [technologyIds, setTechnologyIds] = useState<string[]>(
    initialData?.technologies?.map((t) => t.id) ||
      (initialData as unknown as { technologyIds?: string[] })
        ?.technologyIds ||
      [],
  );

  const [points, setPoints] = useState<string[]>(
    initialData?.points || [""],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!role.trim()) {
      newErrors.role = "O cargo é obrigatório.";
    }

    if (!company.trim()) {
      newErrors.company = "A empresa é obrigatória.";
    }

    if (!startDate.trim()) {
      newErrors.startDate = "A data de início é obrigatória.";
    }

    if (!isCurrent && !endDate.trim()) {
      newErrors.endDate =
        "Informe a data final ou marque a opção 'Experiência atual / Em andamento'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function executeSave() {
    setLoading(true);
    setGlobalError(null);

    try {
      const cleanedPoints = points
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: ExperienceInput = {
        role: role.trim(),
        company: company.trim(),
        ...(location.trim() ? { location: location.trim() } : {}),
        startDate: startDate.trim(),
        endDate: isCurrent ? null : endDate.trim() || null,
        points: cleanedPoints,
        technologyIds,
      };

      if (isEditing && initialData) {
        await updateExperience(initialData.id, payload);
      } else {
        const generatedSlug = slugify(
          `${company.trim()}-${role.trim()}`,
        );

        const id = generatedSlug || `exp-${Date.now()}`;

        await createExperience(id, payload);
      }

      setIsConfirmSaveOpen(false);
      router.push("/admin/experiencias");
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao salvar experiência:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar a experiência. Tente novamente.";

      setGlobalError(errorMessage);
      setIsConfirmSaveOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditing) {
      setIsConfirmSaveOpen(true);
      return;
    }

    await executeSave();
  }

  return (
    <div className="admin-content">
      {/* Top Navigation / Breadcrumb */}
      <div className="admin-form-header">
        <Link
          href="/admin/experiencias"
          className="admin-form-back-link"
        >
          <ArrowLeft size={16} />
          <span>Voltar para Experiências</span>
        </Link>

        <div
          className="admin-page-title-row"
          style={{ marginTop: 8 }}
        >
          <h1 className="admin-page-title">
            {isEditing ? "Editar Experiência" : "Nova Experiência"}
          </h1>
        </div>
      </div>

      {globalError && (
        <div className="admin-alert-banner">
          <div className="admin-alert-content">
            <span>{globalError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-layout">
        <div className="admin-form-main-card">
          {/* Section: Informações Básicas */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <Briefcase size={18} />
              <span>Informações do Cargo & Empresa</span>
            </h2>

            <div className="admin-form-row">
              {/* Cargo */}
              <div
                className="admin-form-group"
                style={{ flex: 1.5 }}
              >
                <label
                  htmlFor="exp-role"
                  className="admin-form-label"
                >
                  <span>Cargo / Função</span>
                  <span className="required">*</span>
                </label>

                <div className="admin-input-wrapper">
                  <Briefcase
                    size={16}
                    className="admin-input-icon"
                  />

                  <input
                    id="exp-role"
                    type="text"
                    placeholder="Ex: Desenvolvedor Backend Pleno"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);

                      if (errors.role) {
                        setErrors((prev) => ({
                          ...prev,
                          role: "",
                        }));
                      }
                    }}
                    className={`admin-input ${
                      errors.role
                        ? "admin-form-input-error"
                        : ""
                    }`}
                    disabled={loading}
                  />
                </div>

                {errors.role && (
                  <span className="admin-form-error-msg">
                    {errors.role}
                  </span>
                )}
              </div>

              {/* Empresa */}
              <div
                className="admin-form-group"
                style={{ flex: 1.5 }}
              >
                <label
                  htmlFor="exp-company"
                  className="admin-form-label"
                >
                  <span>Empresa</span>
                  <span className="required">*</span>
                </label>

                <div className="admin-input-wrapper">
                  <Building
                    size={16}
                    className="admin-input-icon"
                  />

                  <input
                    id="exp-company"
                    type="text"
                    placeholder="Ex: Tech Solutions Inc."
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);

                      if (errors.company) {
                        setErrors((prev) => ({
                          ...prev,
                          company: "",
                        }));
                      }
                    }}
                    className={`admin-input ${
                      errors.company
                        ? "admin-form-input-error"
                        : ""
                    }`}
                    disabled={loading}
                  />
                </div>

                {errors.company && (
                  <span className="admin-form-error-msg">
                    {errors.company}
                  </span>
                )}
              </div>
            </div>

            {/* Localização */}
            <div className="admin-form-group">
              <label
                htmlFor="exp-location"
                className="admin-form-label"
              >
                <span>
                  Localização / Modalidade (Opcional)
                </span>
              </label>

              <div className="admin-input-wrapper">
                <MapPin
                  size={16}
                  className="admin-input-icon"
                />

                <input
                  id="exp-location"
                  type="text"
                  placeholder="Ex: Remoto, São Paulo - SP, Híbrido"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="admin-input"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Section: Período */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <Calendar size={18} />
              <span>Período de Atuação</span>
            </h2>

            <div className="admin-form-row">
              {/* Data Início */}
              <div
                className="admin-form-group"
                style={{ flex: 1 }}
              >
                <label
                  htmlFor="exp-startDate"
                  className="admin-form-label"
                >
                  <span>
                    Data Inicial (AAAA-MM-DD ou AAAA-MM)
                  </span>
                  <span className="required">*</span>
                </label>

                <input
                  id="exp-startDate"
                  type="text"
                  placeholder="Ex: 2024-04-01 ou 2024-04"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);

                    if (errors.startDate) {
                      setErrors((prev) => ({
                        ...prev,
                        startDate: "",
                      }));
                    }
                  }}
                  className={`admin-form-input ${
                    errors.startDate
                      ? "admin-form-input-error"
                      : ""
                  }`}
                  disabled={loading}
                />

                {errors.startDate && (
                  <span className="admin-form-error-msg">
                    {errors.startDate}
                  </span>
                )}
              </div>

              {/* Data Fim */}
              <div
                className="admin-form-group"
                style={{ flex: 1 }}
              >
                <label
                  htmlFor="exp-endDate"
                  className="admin-form-label"
                >
                  <span>Data Final</span>
                  {!isCurrent && (
                    <span className="required">*</span>
                  )}
                </label>

                <input
                  id="exp-endDate"
                  type="text"
                  placeholder={
                    isCurrent
                      ? "Atual (Em andamento)"
                      : "Ex: 2025-06-30 ou 2025-06"
                  }
                  value={isCurrent ? "" : endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);

                    if (errors.endDate) {
                      setErrors((prev) => ({
                        ...prev,
                        endDate: "",
                      }));
                    }
                  }}
                  className={`admin-form-input ${
                    errors.endDate && !isCurrent
                      ? "admin-form-input-error"
                      : ""
                  }`}
                  disabled={isCurrent || loading}
                />

                {errors.endDate && !isCurrent && (
                  <span className="admin-form-error-msg">
                    {errors.endDate}
                  </span>
                )}
              </div>
            </div>

            {/* Checkbox: Experiência Atual */}
            <div className="admin-form-group">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);

                    if (
                      e.target.checked &&
                      errors.endDate
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        endDate: "",
                      }));
                    }
                  }}
                  disabled={loading}
                />

                <div className="admin-checkbox-custom">
                  ✓
                </div>

                <span className="admin-checkbox-text">
                  Esta é minha experiência atual / ainda estou
                  trabalhando nesta empresa
                </span>
              </label>
            </div>
          </div>

          {/* Section: Tecnologias */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <span>Tecnologias Utilizadas</span>
            </h2>

            <p className="admin-form-section-desc">
              Selecione as tecnologias e ferramentas aplicadas
              nesta experiência.
            </p>

            <TechnologySelector
              technologies={technologies}
              selectedTechnologyIds={technologyIds}
              onChange={setTechnologyIds}
              disabled={loading}
            />
          </div>

          {/* Section: Pontos Principais */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <span>Pontos & Realizações</span>
            </h2>

            <p className="admin-form-section-desc">
              Descreva suas principais responsabilidades, projetos
              entregues, melhorias e métricas de impacto.
            </p>

            <DynamicTextList
              items={points}
              onChange={setPoints}
              placeholder="Ex: Desenvolvi APIs RESTful com NestJS e PostgreSQL, reduzindo a latência em 30%..."
              addButtonText="Adicionar ponto"
              emptyText="Nenhum ponto de atuação adicionado."
              disabled={loading}
            />
          </div>

          {/* Footer Actions Bar */}
          <div className="admin-form-bottom-bar">
            <Link
              href="/admin/experiencias"
              className="admin-btn admin-btn-secondary"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div
                    className="admin-loading-spinner"
                    style={{
                      width: 16,
                      height: 16,
                      borderWidth: 2,
                    }}
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
                  <span>Criar experiência</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        itemName={
          role.trim() && company.trim()
            ? `${role.trim()} na ${company.trim()}`
            : undefined
        }
        loading={loading}
        onClose={() => setIsConfirmSaveOpen(false)}
        onConfirm={executeSave}
      />
    </div>
  );
}