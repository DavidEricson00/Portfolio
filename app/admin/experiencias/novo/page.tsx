import { getTechnologies } from "@/lib/data/technologies";
import ExperienceForm from "@/components/admin/ExperienceForm";

export default async function NewExperiencePage() {
  const technologies = await getTechnologies();

  return <ExperienceForm technologies={technologies} isEditing={false} />;
}
