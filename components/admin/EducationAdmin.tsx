"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Award,
  Layers,
  GraduationCap,
} from "lucide-react";
import type { Education } from "@/types/education";
import { educationCategoryConfig } from "@/types/education";
import { EducationModal } from "@/components/admin/EducationModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/data/education";

interface EducationAdminProps {
  initialEducations: Education[];
}

export default function EducationAdmin({
  initialEducations,
}: EducationAdminProps) {
  const [educations, setEducations] =
    useState<Education[]>(initialEducations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [educationToEdit, setEducationToEdit] =
    useState<Education | null>(null);
  const [educationToDelete, setEducationToDelete] =
    useState<Education | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function openCreateModal() {
    setEducationToEdit(null);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  }

  function openEditModal(education: Education) {
    setEducationToEdit(education);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEducationToEdit(null);
  }

  async function handleSaveEducation(
    id: string,
    data: Omit<Education, "id">,
    isEditing: boolean,
  ) {
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        await updateEducation(id, data);

        setEducations((current) =>
          current.map((item) =>
            item.id === id ? ({ id, ...data } as Education) : item,
          ),
        );

        setSuccess("Formação atualizada com sucesso.");
      } else {
        await createEducation(id, data);

        const newEducation: Education = {
          id,
          ...data,
        };

        setEducations((current) => [newEducation, ...current]);
        setSuccess("Formação criada com sucesso.");
      }

      closeModal();
    } catch (err: unknown) {
      console.error("Erro ao salvar formação:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar a formação.";
      setError(errorMessage);
    }
  }

  async function handleDeleteEducation() {
    if (!educationToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteEducation(educationToDelete.id);

      setEducations((current) =>
        current.filter((item) => item.id !== educationToDelete.id),
      );

      setEducationToDelete(null);
      setSuccess("Formação excluída com sucesso.");
    } catch (err: unknown) {
      console.error("Erro ao excluir formação:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir a formação.";
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
            <h1 className="admin-page-title">Formação</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <span>Nova formação</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Total Count */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count-badge">
            {educations.length}{" "}
            {educations.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="admin-alert-banner">
          <div className="admin-alert-content">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* List / Cards */}
      {educations.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-icon-wrap">
            <GraduationCap size={28} />
          </div>
          <h2 className="admin-empty-title">Nenhuma formação cadastrada</h2>
          <p className="admin-empty-desc">
            Cadastre graduações, cursos ou certificações acadêmicas para exibir em seu portfólio.
          </p>
        </div>
      ) : (
        <div className="admin-education-grid">
          {educations.map((edu) => {
            const config = educationCategoryConfig[edu.category];
            const CategoryIcon = config?.icon || GraduationCap;
            const periodText = edu.endDate
              ? `${edu.startDate} — ${edu.endDate}`
              : `${edu.startDate} — Atual`;

            return (
              <div key={edu.id} className="admin-education-card">
                <div className="admin-education-card-header">
                  <div className="admin-education-cat-badge">
                    <CategoryIcon size={14} className="admin-education-cat-icon" />
                    <span>{config?.label || edu.category}</span>
                  </div>

                  <div className="admin-education-card-actions">
                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn-edit"
                      onClick={() => openEditModal(edu)}
                      title="Editar formação"
                      aria-label={`Editar ${edu.title}`}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn-delete"
                      onClick={() => setEducationToDelete(edu)}
                      title="Excluir formação"
                      aria-label={`Excluir ${edu.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="admin-education-card-body">
                  <h2 className="admin-education-card-title">{edu.title}</h2>
                  <p className="admin-education-card-inst">{edu.institution}</p>

                  <div className="admin-education-card-meta">
                    <div className="admin-education-meta-item">
                      <Calendar size={13} />
                      <span>{periodText}</span>
                    </div>

                    {edu.workload && (
                      <div className="admin-education-meta-item">
                        <Clock size={13} />
                        <span>{edu.workload}</span>
                      </div>
                    )}

                    {edu.grade && (
                      <div className="admin-education-meta-item">
                        <Award size={13} />
                        <span>CR: {edu.grade}</span>
                      </div>
                    )}

                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="admin-education-meta-item">
                        <Layers size={13} />
                        <span>
                          {edu.highlights.length}{" "}
                          {edu.highlights.length === 1
                            ? "destaque"
                            : "destaques"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">
            {success}
          </div>
        </div>
      )}

      {/* Modal */}
      <EducationModal
        isOpen={isModalOpen}
        educationToEdit={educationToEdit}
        onClose={closeModal}
        onSave={handleSaveEducation}
      />

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={educationToDelete !== null}
        title="Excluir formação"
        message={
          educationToDelete
            ? `Tem certeza que deseja excluir "${educationToDelete.title}" da instituição "${educationToDelete.institution}"? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setEducationToDelete(null);
          }
        }}
        onConfirm={handleDeleteEducation}
      />
    </div>
  );
}
