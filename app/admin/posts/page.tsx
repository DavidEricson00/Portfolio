import { Plus, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminPostsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Blog / Posts"
        description="Gerenciamento, criação e publicação de artigos técnicos no blog."
        action={
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Novo post</span>
          </button>
        }
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <FileText size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Posts</h2>
        <p className="admin-placeholder-desc">
          O editor de postagens em Markdown, gerenciamento de slugs, tags e status
          de publicação serão implementados nas próximas etapas.
        </p>
      </div>
    </div>
  );
}
