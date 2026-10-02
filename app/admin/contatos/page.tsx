import { Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminContatosPage() {
  return (
    <div>
      <AdminPageHeader
        title="Contatos"
        description="Visualização e gerenciamento das mensagens recebidas pelo portfólio."
      />

      <div className="admin-placeholder-card">
        <div className="admin-placeholder-icon-wrap">
          <Mail size={30} />
        </div>
        <h2 className="admin-placeholder-title">Módulo de Mensagens</h2>
        <p className="admin-placeholder-desc">
          A caixa de entrada de mensagens recebidas através do formulário de contato
          estará disponível na etapa de gerenciamento de contatos.
        </p>
        <span className="admin-placeholder-tag">Placeholder funcional</span>
      </div>
    </div>
  );
}
