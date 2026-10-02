import { Plus, Briefcase } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminExperienciasPage() {
  return (
    <div>
      <AdminPageHeader
        title="Experiências"
        description="Gerenciamento do histórico profissional, empresas, cargos e realizações."
        action={
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Nova experiência</span>
          </button>
        }
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <Briefcase size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Experiências</h2>
        <p className="admin-placeholder-desc">
          O cadastro e a listagem de experiências profissionais e tecnologias
          associadas estarão disponíveis nas etapas seguintes.
        </p>
        <span className="admin-placeholder-tag">Placeholder funcional</span>
      </div>
    </div>
  );
}
