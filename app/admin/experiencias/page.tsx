import { getExperiences } from "@/lib/data/experiences";
import ExperienceAdmin from "@/components/admin/ExperienceAdmin";

export default async function AdminExperienciasPage() {
  const experiences = await getExperiences();

  return <ExperienceAdmin initialExperiences={experiences} />;
}
