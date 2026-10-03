import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getPost } from "@/lib/data/posts";
import PostForm from "@/components/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <div className="admin-content">
        <div className="admin-empty-card">
          <div
            className="admin-empty-icon-wrap"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
            }}
          >
            <AlertCircle size={28} />
          </div>
          <h2 className="admin-empty-title">Post não encontrado</h2>
          <p className="admin-empty-desc">
            O post com ID <code>{id}</code> não foi encontrado no banco de dados ou foi removido.
          </p>
          <Link
            href="/admin/posts"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={16} />
            <span>Voltar para o Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return <PostForm initialData={post} isEditing={true} />;
}
