"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  FileText,
  Calendar,
  Image as ImageIcon,
  Clock,
  Link2,
} from "lucide-react";
import type { Post } from "@/types/post";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmSaveModal } from "@/components/admin/ConfirmSaveModal";
import { createPost, updatePost } from "@/lib/data/posts";
import { revalidatePosts } from "@/lib/actions/posts";
import { slugify } from "@/lib/utils/slugify";

interface PostFormProps {
  initialData?: Post | null;
  isEditing?: boolean;
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PostForm({
  initialData,
  isEditing = false,
}: PostFormProps) {
  const router = useRouter();

  // Basic Post Data
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(
    isEditing || Boolean(initialData?.slug),
  );

  const [date, setDate] = useState(
    initialData?.date || getTodayDateString(),
  );
  const [dateModified, setDateModified] = useState(
    initialData?.dateModified || "",
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || "",
  );
  const [content, setContent] = useState(initialData?.content || "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }

    // Auto-generate slug only on creation mode and when user hasn't manually edited the slug
    if (!isEditing && !isSlugManual) {
      const autoSlug = slugify(newTitle);
      setSlug(autoSlug);
      if (errors.slug) {
        setErrors((prev) => ({ ...prev, slug: "" }));
      }
    }
  }

  function handleSlugChange(rawSlug: string) {
    setIsSlugManual(true);
    setSlug(rawSlug);

    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  }

  function handleSlugBlur() {
    if (slug.trim()) {
      setSlug(slugify(slug));
    }
  }

  function handleContentChange(newContent: string) {
    setContent(newContent);
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "O título do post é obrigatório.";
    }

    const normalizedSlug = slugify(slug.trim());
    if (!normalizedSlug) {
      newErrors.slug = "O slug do post é obrigatório e deve conter caracteres válidos.";
    }

    if (!date.trim()) {
      newErrors.date = "A data de publicação é obrigatória.";
    } else {
      // Validate date format YYYY-MM-DD or valid date string
      const dateParts = date.trim().split("-");
      if (
        dateParts.length !== 3 ||
        isNaN(Number(dateParts[0])) ||
        isNaN(Number(dateParts[1])) ||
        isNaN(Number(dateParts[2]))
      ) {
        newErrors.date = "Formato de data inválido. Use AAAA-MM-DD.";
      }
    }

    if (dateModified.trim()) {
      const modParts = dateModified.trim().split("-");
      if (
        modParts.length !== 3 ||
        isNaN(Number(modParts[0])) ||
        isNaN(Number(modParts[1])) ||
        isNaN(Number(modParts[2]))
      ) {
        newErrors.dateModified = "Formato de data inválido. Use AAAA-MM-DD.";
      }
    }

    if (!content.trim()) {
      newErrors.content = "O conteúdo do post em Markdown é obrigatório.";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function executeSave() {
    setLoading(true);
    setGlobalError(null);

    try {
      const finalSlug = slugify(slug.trim());

      const payload: Omit<Post, "id"> = {
        title: title.trim(),
        slug: finalSlug,
        date: date.trim(),
        content: content.trim(),
        ...(excerpt.trim() ? { excerpt: excerpt.trim() } : {}),
        ...(coverImage.trim() ? { coverImage: coverImage.trim() } : {}),
        ...(dateModified.trim() ? { dateModified: dateModified.trim() } : {}),
      };

      if (isEditing && initialData) {
        await updatePost(initialData.id, payload);
      } else {
        await createPost(finalSlug, payload);
      }

      await revalidatePosts();

      setIsConfirmSaveOpen(false);
      router.push("/admin/posts");
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao salvar post:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar o post. Tente novamente.";

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
        <Link href="/admin/posts" className="admin-form-back-link">
          <ArrowLeft size={16} />
          <span>Voltar para Blog</span>
        </Link>

        <div className="admin-page-title-row" style={{ marginTop: 8 }}>
          <h1 className="admin-page-title">
            {isEditing ? "Editar Post" : "Novo Post"}
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
          {/* Section 1: Dados Básicos */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <FileText size={18} />
              <span>Dados Básicos do Post</span>
            </h2>

            {/* Título */}
            <div className="admin-form-group">
              <label htmlFor="post-title" className="admin-form-label">
                <span>Título do Post</span>
                <span className="required">*</span>
              </label>

              <input
                id="post-title"
                type="text"
                placeholder="Ex: O que aprendi sobre SEO, GEO e AIO na prática"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`admin-form-input ${
                  errors.title ? "admin-form-input-error" : ""
                }`}
                disabled={loading}
              />

              {errors.title && (
                <span className="admin-form-error-msg">
                  {errors.title}
                </span>
              )}
            </div>

            {/* Slug */}
            <div className="admin-form-group">
              <label htmlFor="post-slug" className="admin-form-label">
                <span>Slug (URL Pública)</span>
                <span className="required">*</span>
              </label>

              <div className="admin-input-wrapper">
                <Link2 size={16} className="admin-input-icon" />
                <input
                  id="post-slug"
                  type="text"
                  placeholder="o-que-aprendi-sobre-seo-geo-e-aio"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onBlur={handleSlugBlur}
                  className={`admin-input ${
                    errors.slug ? "admin-form-input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 4,
                  fontSize: "0.78rem",
                  color: "#8b90a0",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                <span>
                  URL pública: /blog/{slugify(slug) || "slug-do-post"}
                </span>
                {!isEditing && isSlugManual && (
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary-hover)",
                      cursor: "pointer",
                      fontSize: "0.76rem",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                    onClick={() => {
                      setIsSlugManual(false);
                      setSlug(slugify(title));
                    }}
                  >
                    Regenerar a partir do título
                  </button>
                )}
              </div>

              {errors.slug && (
                <span className="admin-form-error-msg">
                  {errors.slug}
                </span>
              )}
            </div>

            {/* Datas */}
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="post-date" className="admin-form-label">
                  <span>Data de Publicação</span>
                  <span className="required">*</span>
                </label>

                <div className="admin-input-wrapper">
                  <Calendar size={16} className="admin-input-icon" />
                  <input
                    id="post-date"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) {
                        setErrors((prev) => ({ ...prev, date: "" }));
                      }
                    }}
                    className={`admin-input ${
                      errors.date ? "admin-form-input-error" : ""
                    }`}
                    disabled={loading}
                  />
                </div>

                {errors.date && (
                  <span className="admin-form-error-msg">
                    {errors.date}
                  </span>
                )}
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="post-date-modified" className="admin-form-label">
                  <span>Data de Modificação (Opcional)</span>
                </label>

                <div className="admin-input-wrapper">
                  <Clock size={16} className="admin-input-icon" />
                  <input
                    id="post-date-modified"
                    type="date"
                    value={dateModified}
                    onChange={(e) => {
                      setDateModified(e.target.value);
                      if (errors.dateModified) {
                        setErrors((prev) => ({
                          ...prev,
                          dateModified: "",
                        }));
                      }
                    }}
                    className={`admin-input ${
                      errors.dateModified ? "admin-form-input-error" : ""
                    }`}
                    disabled={loading}
                  />
                </div>

                {errors.dateModified && (
                  <span className="admin-form-error-msg">
                    {errors.dateModified}
                  </span>
                )}
              </div>
            </div>

            {/* Imagem de Capa */}
            <div className="admin-form-group">
              <label htmlFor="post-cover" className="admin-form-label">
                <span>URL da Imagem de Capa (Opcional)</span>
              </label>

              <div className="admin-input-wrapper">
                <ImageIcon size={16} className="admin-input-icon" />
                <input
                  id="post-cover"
                  type="text"
                  placeholder="https://... ou /assets/..."
                  value={coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                    if (errors.coverImage) {
                      setErrors((prev) => ({
                        ...prev,
                        coverImage: "",
                      }));
                    }
                  }}
                  className={`admin-input ${
                    errors.coverImage ? "admin-form-input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>

              {errors.coverImage && (
                <span className="admin-form-error-msg">
                  {errors.coverImage}
                </span>
              )}
            </div>

            {/* Resumo / Excerpt */}
            <div className="admin-form-group">
              <label htmlFor="post-excerpt" className="admin-form-label">
                <span>Resumo / Excerpt (Opcional)</span>
              </label>

              <textarea
                id="post-excerpt"
                rows={3}
                placeholder="Breve resumo ou chamada para listagens e metatags de SEO..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="admin-form-input"
                style={{ resize: "vertical" }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Section 2: Conteúdo Markdown */}
          <div className="admin-form-section">
            <h2 className="admin-form-section-title">
              <span>Conteúdo do Artigo (Markdown)</span>
              <span className="required" style={{ color: "#f87171" }}>
                *
              </span>
            </h2>

            <p className="admin-form-section-desc">
              Utilize o editor Markdown abaixo. Você pode alternar entre edição,
              preview ou modo dividido em tempo real.
            </p>

            <MarkdownEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Comece a escrever o conteúdo completo do post aqui utilizando Markdown..."
              minHeight={420}
              disabled={loading}
            />

            {errors.content && (
              <span className="admin-form-error-msg" style={{ marginTop: 6 }}>
                {errors.content}
              </span>
            )}
          </div>
        </div>

        {/* Form Bottom Bar */}
        <div className="admin-form-bottom-bar">
          <Link
            href="/admin/posts"
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
                <span>Criar post</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Confirm Save Modal for Editing */}
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
