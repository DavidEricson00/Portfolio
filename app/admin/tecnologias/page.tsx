import { Plus, Cpu } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminTecnologiasPage() {
  return (
    <div>
      <AdminPageHeader
        title="Tecnologias"
        description="Gerenciamento de tecnologias, categorias, níveis de proficiência e rankings."
        action={
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Nova tecnologia</span>
          </button>
        }
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <Cpu size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Tecnologias</h2>
        <p className="admin-placeholder-desc">
          O gerenciamento da stack de tecnologias e suas ordenações de relevância
          serão implementados na próxima etapa.
        </p>
      </div>
    </div>
  );
}
