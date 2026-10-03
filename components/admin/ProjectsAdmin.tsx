"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  FolderKanban,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";

function GithubIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
import type { Project } from "@/types/project";
import type { Technology } from "@/types/technology";
import { technologyCategoryConfig } from "@/types/technology";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { deleteProject } from "@/lib/data/projects";
import { revalidateProjects } from "@/lib/actions/projects";

interface ProjectsAdminProps {
  initialProjects: Project[];
  technologies?: Technology[];
}

export default function ProjectsAdmin({
  initialProjects = [],
}: ProjectsAdminProps) {
  const router = useRouter();
  const [prevInitialProjects, setPrevInitialProjects] = useState(initialProjects);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  if (initialProjects !== prevInitialProjects) {
    setPrevInitialProjects(initialProjects);
    setProjects(initialProjects);
  }

  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "standard"
  >("all");

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchName =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.slug.toLowerCase().includes(term);

      const matchFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && project.featured) ||
        (featuredFilter === "standard" && !project.featured);

      return matchName && matchFeatured;
    });
  }, [projects, search, featuredFilter]);

  async function handleDeleteProject() {
    if (!projectToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteProject(projectToDelete.id);
      await revalidateProjects();

      setProjects((current) =>
        current.filter((item) => item.id !== projectToDelete.id),
      );

      setProjectToDelete(null);
      setSuccess("Projeto excluído com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao excluir projeto:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir o projeto.";
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
            <h1 className="admin-page-title">Projetos</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <Link
            href="/admin/projetos/novo"
            className="admin-btn admin-btn-primary"
          >
            <Plus size={18} />
            <span>Novo projeto</span>
          </Link>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-wrapper">
            <Search size={18} className="admin-search-icon" />
            <input
              type="search"
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar projetos por nome..."
            />
          </div>

          <div className="admin-select-wrapper">
            <select
              value={featuredFilter}
              onChange={(e) =>
                setFeaturedFilter(
                  e.target.value as "all" | "featured" | "standard",
                )
              }
              className="admin-select"
            >
              <option value="all">Todos os projetos</option>
              <option value="featured">Apenas Featured (Destaques)</option>
              <option value="standard">Não destacados</option>
            </select>
          </div>
        </div>

        <div className="admin-toolbar-right">
          <span className="admin-count-badge">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "projeto" : "projetos"}
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

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-icon-wrap">
            <FolderKanban size={28} />
          </div>
          <h2 className="admin-empty-title">
            {projects.length === 0
              ? "Nenhum projeto cadastrado"
              : "Nenhum resultado encontrado"}
          </h2>
          <p className="admin-empty-desc">
            {projects.length === 0
              ? "Cadastre o primeiro projeto do seu portfólio completo com arquitetura e tecnologias."
              : "Tente alterar os termos de busca ou o filtro de destaque."}
          </p>

          {projects.length === 0 ? (
            <Link
              href="/admin/projetos/novo"
              className="admin-btn admin-btn-primary"
            >
              <Plus size={18} />
              <span>Novo projeto</span>
            </Link>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setSearch("");
                setFeaturedFilter("all");
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="admin-projects-grid">
          {filteredProjects.map((project) => {
            const visibleTechs = project.technologies?.slice(0, 4) || [];
            const remainingTechsCount =
              (project.technologies?.length || 0) - visibleTechs.length;

            const visibleHighlights = project.highlights?.slice(0, 2) || [];
            const remainingHighlightsCount =
              (project.highlights?.length || 0) - visibleHighlights.length;

            const sectionCount = project.sections?.length || 0;

            return (
              <div key={project.id} className="admin-project-card">
                {/* Project Cover Image / Fallback Header */}
                <div className="admin-project-cover-wrap">
                  {project.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="admin-project-cover-img"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="admin-project-cover-placeholder">
                      <FolderKanban size={32} />
                    </div>
                  )}

                  {project.featured && (
                    <span className="admin-project-featured-badge">
                      <Star size={12} fill="currentColor" />
                      Destaque
                    </span>
                  )}

                  <div className="admin-project-rank-pill">
                    <span>Rank: {project.ranking}</span>
                  </div>
                </div>

                {/* Project Card Body */}
                <div className="admin-project-card-body">
                  <div className="admin-project-header-row">
                    <div>
                      <h2 className="admin-project-name">{project.name}</h2>
                      <span className="admin-project-slug">/{project.slug}</span>
                    </div>

                    <div className="admin-project-quick-links">
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-action-btn"
                          title="Repositório GitHub"
                        >
                          <GithubIcon size={15} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-action-btn"
                          title="Aplicação no ar"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="admin-project-summary line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Technologies Pills */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="admin-project-techs-row">
                      {visibleTechs.map((tech) => {
                        const catConfig =
                          technologyCategoryConfig[tech.category];

                        return (
                          <span
                            key={tech.id}
                            className="admin-project-tech-pill"
                            style={{
                              borderColor:
                                catConfig?.hoverBorder || "rgba(255,255,255,0.1)",
                              backgroundColor:
                                catConfig?.hoverBg || "rgba(255,255,255,0.03)",
                              color: catConfig?.accentColor || "#ffffff",
                            }}
                          >
                            {tech.name}
                          </span>
                        );
                      })}

                      {remainingTechsCount > 0 && (
                        <span className="admin-project-tech-overflow">
                          +{remainingTechsCount}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Highlights Preview */}
                  {visibleHighlights.length > 0 && (
                    <div className="admin-project-highlights-box">
                      <span className="admin-project-box-title">
                        <Sparkles size={13} />
                        Destaques
                      </span>
                      <ul className="admin-project-highlights-list">
                        {visibleHighlights.map((hl, idx) => (
                          <li key={idx} className="line-clamp-1">
                            • {hl}
                          </li>
                        ))}
                        {remainingHighlightsCount > 0 && (
                          <li className="admin-project-more-text">
                            +{remainingHighlightsCount}{" "}
                            {remainingHighlightsCount === 1
                              ? "outro destaque..."
                              : "outros destaques..."}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Meta Specs & Actions Footer */}
                  <div className="admin-project-card-footer">
                    <div className="admin-project-meta-specs">
                      <span className="admin-project-spec-item">
                        <Layers size={13} />
                        <span>
                          {sectionCount}{" "}
                          {sectionCount === 1 ? "seção" : "seções"}
                        </span>
                      </span>
                    </div>

                    <div className="admin-project-actions">
                      <Link
                        href={`/admin/projetos/${project.id}/editar`}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title={`Editar ${project.name}`}
                      >
                        <Pencil size={14} />
                        <span>Editar</span>
                      </Link>

                      <button
                        type="button"
                        className="admin-action-btn admin-action-btn-delete"
                        onClick={() => setProjectToDelete(project)}
                        title={`Excluir ${project.name}`}
                        aria-label={`Excluir ${project.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Feedback */}
      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">{success}</div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={projectToDelete !== null}
        title="Excluir projeto"
        message={
          projectToDelete
            ? `Tem certeza que deseja excluir o projeto "${projectToDelete.name}" (${projectToDelete.slug})? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setProjectToDelete(null);
          }
        }}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
