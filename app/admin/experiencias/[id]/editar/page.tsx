import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getExperience } from "@/lib/data/experiences";
import { getTechnologies } from "@/lib/data/technologies";
import ExperienceForm from "@/components/admin/ExperienceForm";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;

  const [experience, technologies] = await Promise.all([
    getExperience(id),
    getTechnologies(),
  ]);

  if (!experience) {
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
          <h2 className="admin-empty-title">Experiência não encontrada</h2>
          <p className="admin-empty-desc">
            O registro de experiência com ID <code>{id}</code> não existe ou foi removido.
          </p>
          <Link
            href="/admin/experiencias"
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
    <ExperienceForm
      initialData={experience}
      technologies={technologies}
      isEditing={true}
    />
  );
}
