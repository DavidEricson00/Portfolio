import { Plus, GraduationCap } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminFormacaoPage() {
  return (
    <div>
      <AdminPageHeader
        title="Formação"
        description="Gerenciamento de graduações, pós-graduações, cursos e certificações."
        action={
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Nova formação</span>
          </button>
        }
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <GraduationCap size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Formação</h2>
        <p className="admin-placeholder-desc">
          O controle de cursos, certificações acadêmicas e instituições de ensino
          será implementado na próxima etapa do painel.
        </p>
      </div>
    </div>
  );
}
