"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  ExternalLink,
  Clock,
} from "lucide-react";
import type { Post } from "@/types/post";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { deletePost, formatPostDate } from "@/lib/data/posts";

interface PostsAdminProps {
  initialPosts: Post[];
}

export default function PostsAdmin({ initialPosts = [] }: PostsAdminProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return posts;
    }

    return posts.filter((post) => {
      const matchTitle = post.title.toLowerCase().includes(term);
      const matchSlug = post.slug.toLowerCase().includes(term);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(term);

      return matchTitle || matchSlug || matchExcerpt;
    });
  }, [posts, search]);

  async function handleDeletePost() {
    if (!postToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deletePost(postToDelete.id);

      setPosts((current) =>
        current.filter((item) => item.id !== postToDelete.id),
      );

      setPostToDelete(null);
      setSuccess("Post excluído com sucesso.");
    } catch (err: unknown) {
      console.error("Erro ao excluir post:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir o post.";

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
            <h1 className="admin-page-title">Blog</h1>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <Link
            href="/admin/posts/novo"
            className="admin-btn admin-btn-primary"
          >
            <Plus size={18} />
            <span>Novo post</span>
          </Link>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-wrapper">
            <Search size={18} className="admin-search-icon" />

            <input
              type="search"
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar posts por título ou slug..."
            />
          </div>
        </div>

        <div className="admin-toolbar-right">
          <span className="admin-count-badge">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
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

      {filteredPosts.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-icon-wrap">
            <FileText size={28} />
          </div>

          <h2 className="admin-empty-title">
            {posts.length === 0
              ? "Nenhum post publicado"
              : "Nenhum resultado encontrado"}
          </h2>

          <p className="admin-empty-desc">
            {posts.length === 0
              ? "Crie seu primeiro artigo técnico ou publicação para o blog."
              : "Tente alterar os termos de busca para encontrar o artigo desejado."}
          </p>

          {posts.length === 0 ? (
            <Link
              href="/admin/posts/novo"
              className="admin-btn admin-btn-primary"
            >
              <Plus size={18} />
              <span>Novo post</span>
            </Link>
          ) : (
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
        <div className="admin-table-card admin-posts-table-card">
          <div className="admin-table-responsive">
            <table className="admin-table admin-posts-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredPosts.map((post) => {
                  const formattedDate = formatPostDate(post.date);
                  const formattedModifiedDate = post.dateModified
                    ? formatPostDate(post.dateModified)
                    : null;

                  return (
                    <tr key={post.id}>
                      <td>
                        <div className="admin-post-title-cell">
                          <span className="admin-post-title">
                            {post.title}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-post-date-wrap">
                          <div className="admin-post-date-main">
                            <Calendar
                              size={14}
                              className="admin-post-date-icon"
                            />
                            <span>{formattedDate}</span>
                          </div>

                          {formattedModifiedDate && (
                            <div className="admin-post-date-modified">
                              <Clock size={11} />
                              <span>
                                Editado em {formattedModifiedDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="admin-post-actions">
                          <Link
                            href={`/admin/posts/${post.id}/editar`}
                            className="admin-post-action-btn admin-post-action-edit"
                            title={`Editar "${post.title}"`}
                            aria-label={`Editar "${post.title}"`}
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            type="button"
                            className="admin-post-action-btn admin-post-action-delete"
                            onClick={() => setPostToDelete(post)}
                            title={`Excluir "${post.title}"`}
                            aria-label={`Excluir "${post.title}"`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {success && (
        <div className="admin-toast-container">
          <div className="admin-toast admin-toast-success">{success}</div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={postToDelete !== null}
        title="Excluir post"
        message={
          postToDelete
            ? `Tem certeza que deseja excluir o artigo "${postToDelete.title}" (/blog/${postToDelete.slug})? Essa ação não pode ser desfeita.`
            : ""
        }
        loading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setPostToDelete(null);
          }
        }}
        onConfirm={handleDeletePost}
      />
    </div>
  );
}