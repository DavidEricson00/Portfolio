"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Building,
  Briefcase,
} from "lucide-react";
import type { ExperienceWithTechnologies } from "@/types/experience";
import { technologyCategoryConfig } from "@/types/technology";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { deleteExperience } from "@/lib/data/experiences";

interface ExperienceAdminProps {
  initialExperiences: ExperienceWithTechnologies[];
}

export default function ExperienceAdmin({
  initialExperiences,
}: ExperienceAdminProps) {
  const [experiences, setExperiences] =
    useState<ExperienceWithTechnologies[]>(initialExperiences);
  const [search, setSearch] = useState("");

  const [experienceToDelete, setExperienceToDelete] =
    useState<ExperienceWithTechnologies | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredExperiences = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return experiences;

    return experiences.filter((exp) => {
      const matchRole = exp.role.toLowerCase().includes(term);
      const matchCompany = exp.company.toLowerCase().includes(term);
      const matchLocation = exp.location?.toLowerCase().includes(term);
      return matchRole || matchCompany || matchLocation;
    });
  }, [experiences, search]);

  async function handleDeleteExperience() {
    if (!experienceToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteExperience(experienceToDelete.id);

      setExperiences((current) =>
        current.filter((item) => item.id !== experienceToDelete.id),
      );

      setExperienceToDelete(null);
      setSuccess("Experiência excluída com sucesso.");
    } catch (err: unknown) {
      console.error("Erro ao excluir experiência:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir a experiência.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="admin-content">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-titles">
          <div className="admin-page-title-row">
            <h1 className="admin-page-title">Experiências</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <Link
            href="/admin/experiencias/novo"
            className="admin-btn admin-btn-primary"
          >
            <Plus size={18} />
            <span>Nova experiência</span>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-wrapper">
            <Search size={18} className="admin-search-icon" />
            <input
              type="search"
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por cargo ou empresa..."
            />
          </div>
        </div>

        <div className="admin-toolbar-right">
          <span className="admin-count-badge">
            {filteredExperiences.length}{" "}
            {filteredExperiences.length === 1
              ? "experiência"
              : "experiências"}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="admin-alert-banner">
          <div className="admin-alert-content">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Experiences Grid */}
      {filteredExperiences.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-icon-wrap">
            <Briefcase size={28} />
          </div>
          <h2 className="admin-empty-title">
            {experiences.length === 0
              ? "Nenhuma experiência cadastrada"
              : "Nenhum resultado encontrado"}
          </h2>
          <p className="admin-empty-desc">
            {experiences.length === 0
              ? "Cadastre sua primeira experiência profissional para enriquecer seu portfólio."
              : "Tente buscar por outro termo ou nome de empresa."}
          </p>

          {experiences.length > 0 && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSearch("")}
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <div className="admin-experience-grid">
          {filteredExperiences.map((exp) => {
            const periodText = exp.endDate
              ? `${exp.startDate} — ${exp.endDate}`
              : `${exp.startDate} — Atual`;

            const pointsPreview = exp.points.slice(0, 3);
            const remainingPointsCount = exp.points.length - pointsPreview.length;

            return (
              <div key={exp.id} className="admin-experience-card">
                <div className="admin-experience-card-header">
                  <div className="admin-experience-header-main">
                    <h2 className="admin-experience-role">{exp.role}</h2>
                    <div className="admin-experience-company-row">
                      <span className="admin-experience-company">
                        <Building size={14} className="admin-exp-icon" />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="admin-experience-location">
                          <MapPin size={14} className="admin-exp-icon" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="admin-experience-card-actions">
                    <Link
                      href={`/admin/experiencias/${exp.id}/editar`}
                      className="admin-action-btn admin-action-btn-edit"
                      title="Editar experiência"
                      aria-label={`Editar ${exp.role} em ${exp.company}`}
                    >
                      <Pencil size={15} />
                    </Link>

                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn-delete"
                      onClick={() => setExperienceToDelete(exp)}
                      title="Excluir experiência"
                      aria-label={`Excluir ${exp.role} em ${exp.company}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="admin-experience-period-badge">
                  <Calendar size={13} />
                  <span>{periodText}</span>
                  {!exp.endDate && (
                    <span className="admin-experience-current-tag">Atual</span>
                  )}
                </div>

                {/* Technologies List */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="admin-experience-techs">
                    {exp.technologies.map((tech) => {
                      const categoryConfig =
                        technologyCategoryConfig[tech.category];

                      return (
                        <span
                          key={tech.id}
                          className="admin-experience-tech-chip"
                          style={{
                            borderColor:
                              categoryConfig?.hoverBorder || "rgba(255,255,255,0.1)",
                            backgroundColor:
                              categoryConfig?.hoverBg || "rgba(255,255,255,0.04)",
                            color: categoryConfig?.accentColor || "var(--foreground)",
                          }}
                        >
                          {tech.name}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Points Preview (visual clamp) */}
                {pointsPreview.length > 0 && (
                  <ul className="admin-experience-points-list">
                    {pointsPreview.map((point, idx) => (
                      <li key={idx} className="admin-experience-point-item">
                        <span className="admin-experience-point-bullet">•</span>
                        <span className="admin-experience-point-text line-clamp-2">
                          {point}
                        </span>
                      </li>
                    ))}
                    {remainingPointsCount > 0 && (
                      <li className="admin-experience-more-points">
                        +{remainingPointsCount}{" "}
                        {remainingPointsCount === 1
                          ? "outro ponto registrado..."
                          : "outros pontos registrados..."}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Feedback */}
      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">
            {success}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={experienceToDelete !== null}
        title="Excluir experiência"
        message={
          experienceToDelete
            ? `Tem certeza que deseja excluir "${experienceToDelete.role}" na empresa "${experienceToDelete.company}"? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setExperienceToDelete(null);
          }
        }}
        onConfirm={handleDeleteExperience}
      />
    </div>
  );
}
