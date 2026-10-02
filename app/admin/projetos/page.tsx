import { Plus, FolderKanban } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminProjetosPage() {
  return (
    <div>
      <AdminPageHeader
        title="Projetos"
        description="Gerenciamento dos projetos em destaque e catálogo completo do portfólio."
        action={
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Novo projeto</span>
          </button>
        }
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <FolderKanban size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Projetos</h2>
        <p className="admin-placeholder-desc">
          A listagem e os formulários de cadastro, edição e exclusão de projetos
          serão integrados na próxima etapa de desenvolvimento.
        </p>
      </div>
    </div>
  );
}
