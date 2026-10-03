import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getProject } from "@/lib/data/projects";
import { getTechnologies } from "@/lib/data/technologies";
import ProjectForm from "@/components/admin/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const [project, technologies] = await Promise.all([
    getProject(id),
    getTechnologies(),
  ]);

  if (!project) {
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
          <h2 className="admin-empty-title">Projeto não encontrado</h2>
          <p className="admin-empty-desc">
            O projeto com ID <code>{id}</code> não foi encontrado no banco de dados ou foi removido.
          </p>
          <Link
            href="/admin/projetos"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={16} />
            <span>Voltar para a listagem</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProjectForm
      initialData={project}
      technologies={technologies}
      isEditing={true}
    />
  );
}
