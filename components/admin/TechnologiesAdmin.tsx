"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import type {
  Technology,
  TechnologyCategory,
  TechnologyInput,
} from "@/types/technology";

import { technologyCategoryConfig } from "@/types/technology";
import { TechnologyModal } from "@/components/admin/TechnologyModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

import {
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "@/lib/data/technologies";
import { revalidateTechnologies } from "@/lib/actions/technologies";
import { technologyId } from "@/lib/utils/slugify";

interface TechnologiesAdminProps {
  initialTechnologies: Technology[];
}

export default function TechnologiesAdmin({
  initialTechnologies,
}: TechnologiesAdminProps) {
  const router = useRouter();
  const [prevInitialTechnologies, setPrevInitialTechnologies] =
    useState<Technology[]>(initialTechnologies);
  const [technologies, setTechnologies] =
    useState<Technology[]>(initialTechnologies);

  if (initialTechnologies !== prevInitialTechnologies) {
    setPrevInitialTechnologies(initialTechnologies);
    setTechnologies(initialTechnologies);
  }

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<"all" | TechnologyCategory>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [technologyToEdit, setTechnologyToEdit] =
    useState<Technology | null>(null);

  const [technologyToDelete, setTechnologyToDelete] =
    useState<Technology | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredTechnologies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return technologies.filter((technology) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        technology.name.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" ||
        technology.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [technologies, search, categoryFilter]);

  function openCreateModal() {
    setTechnologyToEdit(null);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  }

  function openEditModal(technology: Technology) {
    setTechnologyToEdit(technology);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setTechnologyToEdit(null);
  }

  async function handleSaveTechnology(data: TechnologyInput) {
    setError(null);
    setSuccess(null);

    try {
      if (technologyToEdit) {
        await updateTechnology(technologyToEdit.id, data);
        await revalidateTechnologies();

        setTechnologies((current) =>
          current
            .map((technology) =>
              technology.id === technologyToEdit.id
                ? {
                    ...technology,
                    ...data,
                  }
                : technology,
            )
            .sort((a, b) => b.ranking - a.ranking),
        );

        setSuccess("Tecnologia atualizada com sucesso.");
      } else {
        const newId = technologyId(data.name);

        if (!newId) {
          setError("ID inválido gerado a partir do nome.");
          return;
        }

        await createTechnology(newId, data);
        await revalidateTechnologies();

        setTechnologies((current) =>
          [...current, { id: newId, ...data }].sort(
            (a, b) => b.ranking - a.ranking,
          ),
        );

        setSuccess("Tecnologia criada com sucesso.");
      }

      closeModal();
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao salvar tecnologia:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar a tecnologia.";

      setError(errorMessage);
    }
  }

  async function handleDeleteTechnology() {
    if (!technologyToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteTechnology(technologyToDelete.id);
      await revalidateTechnologies();

      setTechnologies((current) =>
        current.filter(
          (technology) => technology.id !== technologyToDelete.id,
        ),
      );

      setTechnologyToDelete(null);
      setSuccess("Tecnologia excluída com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao excluir tecnologia:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro ao excluir a tecnologia.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-header-titles">
          <div className="admin-page-title-row">
            <h1 className="admin-page-title">Tecnologias</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nova tecnologia
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-wrapper">
            <Search
              size={18}
              className="admin-search-icon"
            />

            <input
              type="search"
              className="admin-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar tecnologia..."
            />
          </div>

          <div className="admin-select-wrapper">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as "all" | TechnologyCategory,
                )
              }
              className="admin-select"
            >
              <option value="all">Todas as categorias</option>

              {(
                Object.entries(technologyCategoryConfig) as [
                  TechnologyCategory,
                  (typeof technologyCategoryConfig)[TechnologyCategory],
                ][]
              ).map(([category, config]) => (
                <option key={category} value={category}>
                  {config.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="admin-select-icon"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="admin-toolbar-right">
          <span className="admin-count-badge">
            {filteredTechnologies.length}{" "}
            {filteredTechnologies.length === 1
              ? "tecnologia"
              : "tecnologias"}
          </span>
        </div>
      </div>

      {error && (
        <div className="admin-alert-banner">
          <div className="admin-alert-content">
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="admin-table-card">
        {filteredTechnologies.length === 0 ? (
          <div className="admin-empty-card">
            <div className="admin-empty-icon-wrap">
              <Search size={24} />
            </div>

            <h2 className="admin-empty-title">
              {technologies.length === 0
                ? "Nenhuma tecnologia cadastrada"
                : "Nenhum resultado encontrado"}
            </h2>

            <p className="admin-empty-desc">
              {technologies.length === 0
                ? "Cadastre sua primeira tecnologia para começar."
                : "Tente alterar a pesquisa ou o filtro de categoria."}
            </p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tecnologia</th>
                  <th>Categoria</th>
                  <th>Ranking</th>
                  <th>Featured</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredTechnologies.map((technology) => {
                  const category =
                    technologyCategoryConfig[technology.category];

                  return (
                    <tr key={technology.id}>
                      <td>
                        <div className="admin-tech-name-cell">
                          <div className="admin-tech-icon-wrap">
                            {technology.iconUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={technology.iconUrl}
                                alt=""
                                className="admin-tech-icon-img"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <span className="admin-tech-icon-fallback">
                                {technology.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <span>{technology.name}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="admin-category-badge"
                          style={{
                            borderColor: category.hoverBorder,
                            backgroundColor: category.hoverBg,
                            color: category.accentColor,
                          }}
                        >
                          {category.label}
                        </span>
                      </td>

                      <td>
                        <div className="admin-rank-cell">
                          <span className="admin-rank-number">
                            {technology.ranking}
                          </span>
                        </div>
                      </td>

                      <td>
                        {technology.featured ? (
                          <span className="admin-featured-pill">
                            <Star
                              size={14}
                              fill="currentColor"
                            />
                            Sim
                          </span>
                        ) : (
                          <span className="admin-standard-pill">
                            Não
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn-edit"
                            onClick={() =>
                              openEditModal(technology)
                            }
                            aria-label={`Editar ${technology.name}`}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn-delete"
                            onClick={() =>
                              setTechnologyToDelete(technology)
                            }
                            aria-label={`Excluir ${technology.name}`}
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">
            {success}
          </div>
        </div>
      )}

      <TechnologyModal
        isOpen={isModalOpen}
        technologyToEdit={technologyToEdit}
        onClose={closeModal}
        onSave={handleSaveTechnology}
      />

      <ConfirmDeleteModal
        isOpen={technologyToDelete !== null}
        title="Excluir tecnologia"
        message={
          technologyToDelete
            ? `Tem certeza que deseja excluir "${technologyToDelete.name}"? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setTechnologyToDelete(null);
          }
        }}
        onConfirm={handleDeleteTechnology}
      />
    </div>
  );
}