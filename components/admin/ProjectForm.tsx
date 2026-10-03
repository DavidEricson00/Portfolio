"use client";

import { useState, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Star,
} from "lucide-react";

function GithubIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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

import type {
  Project,
  ProjectDocument,
  ProjectSection,
  ProjectSectionType,
} from "@/types/project";
import { projectSectionConfigs } from "@/types/project";
import type { Technology } from "@/types/technology";
import { TechnologySelector } from "@/components/admin/TechnologySelector";
import { DynamicTextList } from "@/components/admin/DynamicTextList";
import { AddProjectSectionModal } from "@/components/admin/AddProjectSectionModal";
import { ProjectSectionEditor } from "@/components/admin/ProjectSectionEditor";
import { ConfirmSaveModal } from "@/components/admin/ConfirmSaveModal";
import { createProject, updateProject } from "@/lib/data/projects";
import { slugify } from "@/lib/utils/slugify";
import { revalidateProjects } from "@/lib/actions/projects";

interface ProjectFormProps {
  initialData?: Project | null;
  technologies: Technology[];
  isEditing?: boolean;
}

export default function ProjectForm({
  initialData,
  technologies = [],
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState(initialData?.name || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || "",
  );
  const [repositoryUrl, setRepositoryUrl] = useState(
    initialData?.repositoryUrl || "",
  );
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [ranking, setRanking] = useState(initialData?.ranking ?? 80);
  const [dateCreated, setDateCreated] = useState(
    initialData?.dateCreated || "",
  );

  // Technologies
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    initialData?.technologies?.map((t) => t.id) ||
      (initialData as unknown as { technologyIds?: string[] })
        ?.technologyIds ||
      [],
  );

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights || [],
  );

  // Sections (sorted by projectSectionConfigs[type].order)
  const [sections, setSections] = useState<ProjectSection[]>(() => {
    const rawSections = initialData?.sections || [];

    return [...rawSections].sort(
      (a, b) =>
        (projectSectionConfigs[a.type]?.order ?? 99) -
        (projectSectionConfigs[b.type]?.order ?? 99),
    );
  });

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  // Used section types to prevent duplicate sections
  const usedSectionTypes = useMemo(() => {
    return sections.map((s) => s.type);
  }, [sections]);

  function handleNameChange(newName: string) {
    setName(newName);

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  }

  function handleAddSection(type: ProjectSectionType) {
    // Prevent duplicates
    if (sections.some((s) => s.type === type)) {
      return;
    }

    const newSection: ProjectSection = {
      id: `${type}-${Date.now()}`,
      type,
      content: "",
      ...(type === "screenshots" ? { images: [] } : {}),
    };

    const nextSections = [...sections, newSection].sort(
      (a, b) =>
        (projectSectionConfigs[a.type]?.order ?? 99) -
        (projectSectionConfigs[b.type]?.order ?? 99),
    );

    setSections(nextSections);
  }

  function handleUpdateSection(updatedSection: ProjectSection) {
    setSections((current) =>
      current.map((s) => (s.id === updatedSection.id ? updatedSection : s)),
    );
  }

  function handleRemoveSection(sectionId: string) {
    setSections((current) =>
      current.filter((s) => s.id !== sectionId),
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "O nome do projeto é obrigatório.";
    }

    if (!summary.trim()) {
      newErrors.summary = "O resumo do projeto é obrigatório.";
    }

    const rankNum = Number(ranking);

    if (isNaN(rankNum) || rankNum < 1 || rankNum > 100) {
      newErrors.ranking = "O ranking deve ser um número entre 1 e 100.";
    }

    if (coverImage.trim()) {
      try {
        const url = new URL(coverImage.trim(), "http://localhost");

        if (
          !url.protocol.startsWith("http") &&
          !coverImage.startsWith("/")
        ) {
          newErrors.coverImage = "Informe uma URL válida de imagem.";
        }
      } catch {
        newErrors.coverImage = "Informe uma URL válida.";
      }
    }

    if (repositoryUrl.trim()) {
      try {
        new URL(repositoryUrl.trim());
      } catch {
        newErrors.repositoryUrl =
          "Informe uma URL de repositório válida (ex: https://github.com/...).";
      }
    }

    if (liveUrl.trim()) {
      try {
        new URL(liveUrl.trim());
      } catch {
        newErrors.liveUrl =
          "Informe uma URL pública válida (ex: https://...).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function executeSave() {
    setLoading(true);
    setGlobalError(null);

    try {
      const projectSlug = slugify(name.trim());

      // Clean highlights and section images
      const cleanedHighlights = highlights
        .map((h) => h.trim())
        .filter(Boolean);

      const cleanedSections = sections.map((sec) => {
        if (sec.type === "screenshots") {
          return {
            ...sec,
            images: (sec.images || [])
              .map((img) => img.trim())
              .filter(Boolean),
          };
        }

        return sec;
      });

      const payload: ProjectDocument = {
        name: name.trim(),
        slug: projectSlug,
        summary: summary.trim(),
        featured,
        ranking: Number(ranking),
        technologyIds,
        highlights: cleanedHighlights,
        sections: cleanedSections,
        ...(coverImage.trim()
          ? { coverImage: coverImage.trim() }
          : {}),
        ...(repositoryUrl.trim()
          ? { repositoryUrl: repositoryUrl.trim() }
          : {}),
        ...(liveUrl.trim() ? { liveUrl: liveUrl.trim() } : {}),
        ...(dateCreated.trim()
          ? { dateCreated: dateCreated.trim() }
          : {}),
      };

      if (isEditing && initialData) {
        await updateProject(initialData.id, payload);
      } else {
        await createProject(projectSlug, payload);
      }

      await revalidateProjects();

      setIsConfirmSaveOpen(false);
      router.push("/admin/projetos");
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao salvar projeto:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar o projeto. Tente novamente.";

      setGlobalError(errorMessage);
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
    <div className="admin-content">
      {/* Top Header */}
      <div className="admin-form-header">
        <Link href="/admin/projetos" className="admin-form-back-link">
          <ArrowLeft size={16} />
          <span>Voltar para Projetos</span>
        </Link>

        <div className="admin-page-title-row" style={{ marginTop: 8 }}>
          <h1 className="admin-page-title">
            {isEditing ? "Editar Projeto" : "Novo Projeto"}
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
          {/* Section 1: Informações Principais */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <FolderKanban size={18} />
              <span>Informações Gerais do Projeto</span>
            </h2>

            {/* Nome */}
            <div className="admin-form-group">
              <label htmlFor="proj-name" className="admin-form-label">
                <span>Nome do Projeto</span>
                <span className="required">*</span>
              </label>

              <input
                id="proj-name"
                type="text"
                placeholder="Ex: LetterDrop, Link Shortener..."
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`admin-form-input ${
                  errors.name ? "admin-form-input-error" : ""
                }`}
                disabled={loading}
              />

              {errors.name && (
                <span className="admin-form-error-msg">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Resumo */}
            <div className="admin-form-group">
              <label htmlFor="proj-summary" className="admin-form-label">
                <span>Resumo / Subtítulo</span>
                <span className="required">*</span>
              </label>

              <textarea
                id="proj-summary"
                rows={3}
                placeholder="Ex: Plataforma distribuída de newsletters com mensageria e alta disponibilidade..."
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);

                  if (errors.summary) {
                    setErrors((prev) => ({
                      ...prev,
                      summary: "",
                    }));
                  }
                }}
                className={`admin-form-input ${
                  errors.summary ? "admin-form-input-error" : ""
                }`}
                style={{ resize: "vertical" }}
                disabled={loading}
              />

              {errors.summary && (
                <span className="admin-form-error-msg">
                  {errors.summary}
                </span>
              )}
            </div>

            {/* Imagem de Capa e Data de Criação */}
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 2 }}>
                <label htmlFor="proj-cover" className="admin-form-label">
                  <span>URL da Imagem de Capa (Opcional)</span>
                </label>

                <div className="admin-input-wrapper">
                  <ImageIcon
                    size={16}
                    className="admin-input-icon"
                  />

                  <input
                    id="proj-cover"
                    type="text"
                    placeholder="https://... ou /projects/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="admin-input"
                    disabled={loading}
                  />
                </div>

                {errors.coverImage && (
                  <span className="admin-form-error-msg">
                    {errors.coverImage}
                  </span>
                )}
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="proj-date" className="admin-form-label">
                  <span>Data / Ano de Criação (Opcional)</span>
                </label>

                <input
                  id="proj-date"
                  type="text"
                  placeholder="Ex: 2024 ou 04/2024"
                  value={dateCreated}
                  onChange={(e) => setDateCreated(e.target.value)}
                  className="admin-form-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* URLs: Repositório e Live Demo */}
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="proj-repo" className="admin-form-label">
                  <span>URL do Repositório GitHub (Opcional)</span>
                </label>

                <div className="admin-input-wrapper">
                  <GithubIcon
                    size={16}
                    className="admin-input-icon"
                  />

                  <input
                    id="proj-repo"
                    type="url"
                    placeholder="https://github.com/usuario/repo"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    className="admin-input"
                    disabled={loading}
                  />
                </div>

                {errors.repositoryUrl && (
                  <span className="admin-form-error-msg">
                    {errors.repositoryUrl}
                  </span>
                )}
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="proj-live" className="admin-form-label">
                  <span>URL da Aplicação no Ar (Opcional)</span>
                </label>

                <div className="admin-input-wrapper">
                  <Globe
                    size={16}
                    className="admin-input-icon"
                  />

                  <input
                    id="proj-live"
                    type="url"
                    placeholder="https://meuprojeto.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="admin-input"
                    disabled={loading}
                  />
                </div>

                {errors.liveUrl && (
                  <span className="admin-form-error-msg">
                    {errors.liveUrl}
                  </span>
                )}
              </div>
            </div>

            {/* Ranking e Featured */}
            <div
              className="admin-form-row"
              style={{ alignItems: "center" }}
            >
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label
                  className="admin-checkbox-label"
                  style={{ marginTop: 24 }}
                >
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    disabled={loading}
                  />

                  <div className="admin-checkbox-custom">✓</div>

                  <span className="admin-checkbox-text">
                    Projeto em destaque (Featured)
                  </span>
                </label>
              </div>

              <div className="admin-form-group" style={{ flex: 1.5 }}>
                <label
                  htmlFor="proj-ranking"
                  className="admin-form-label"
                >
                  <span>Ranking de Relevância (1 a 100)</span>
                  <span className="required">*</span>
                </label>

                <div className="admin-range-container">
                  <span className="admin-range-value">
                    {ranking}
                  </span>

                  <input
                    id="proj-ranking"
                    type="range"
                    min={1}
                    max={100}
                    value={ranking}
                    onChange={(e) =>
                      setRanking(Number(e.target.value))
                    }
                    className="admin-range-slider"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tecnologias */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <Sparkles size={18} />
              <span>Tecnologias do Projeto</span>
            </h2>

            <p className="admin-form-section-desc">
              Selecione as tecnologias utilizadas na arquitetura deste projeto.
            </p>

            <TechnologySelector
              technologies={technologies}
              selectedTechnologyIds={technologyIds}
              onChange={setTechnologyIds}
              disabled={loading}
            />
          </div>

          {/* Section 3: Highlights */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <Star size={18} />
              <span>Highlights & Pontos de Destaque</span>
            </h2>

            <p className="admin-form-section-desc">
              Pontos-chave sobre decisões de arquitetura, mensageria,
              resiliência ou impacto.
            </p>

            <DynamicTextList
              items={highlights}
              onChange={setHighlights}
              placeholder="Ex: Arquitetura baseada em microsserviços com NestJS..."
              addButtonText="Adicionar highlight"
              emptyText="Nenhum highlight cadastrado para este projeto."
              disabled={loading}
            />
          </div>

          {/* Section 4: Seções Detalhadas do Projeto */}
          <div className="admin-form-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h2 className="admin-form-section-title">
                  <Layers size={18} />
                  <span>
                    Seções Detalhadas ({sections.length})
                  </span>
                </h2>

                <p
                  className="admin-form-section-desc"
                  style={{ marginTop: 4 }}
                >
                  As seções são ordenadas automaticamente pelo padrão
                  de arquitetura do portfólio.
                </p>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => setIsAddSectionModalOpen(true)}
                disabled={
                  loading || usedSectionTypes.length >= 9
                }
              >
                <Plus size={16} />
                <span>Adicionar seção</span>
              </button>
            </div>

            {/* List of Section Editors */}
            {sections.length === 0 ? (
              <div
                className="admin-empty-card"
                style={{ padding: "40px 20px" }}
              >
                <div
                  className="admin-empty-icon-wrap"
                  style={{ width: 44, height: 44 }}
                >
                  <Layers size={22} />
                </div>

                <h3
                  className="admin-empty-title"
                  style={{ fontSize: "1.05rem" }}
                >
                  Nenhuma seção adicionada
                </h3>

                <p className="admin-empty-desc">
                  Clique no botão &quot;Adicionar seção&quot; para
                  estruturar a visão geral, arquitetura, decisões
                  técnicas e screenshots.
                </p>
              </div>
            ) : (
              <div className="admin-sections-list-container">
                {sections.map((section) => (
                  <ProjectSectionEditor
                    key={section.id}
                    section={section}
                    onChange={handleUpdateSection}
                    onRemove={() =>
                      handleRemoveSection(section.id)
                    }
                    disabled={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Bottom Bar */}
        <div className="admin-form-bottom-bar">
          <Link
            href="/admin/projetos"
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
                <span>Criar projeto</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Add Section Modal */}
      <AddProjectSectionModal
        isOpen={isAddSectionModalOpen}
        usedSectionTypes={usedSectionTypes}
        onClose={() => setIsAddSectionModalOpen(false)}
        onSelectType={handleAddSection}
      />

      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        itemName={name.trim() || undefined}
        loading={loading}
        onClose={() => setIsConfirmSaveOpen(false)}
        onConfirm={executeSave}
      />
    </div>
  );
}