import { getTechnologies } from "@/lib/data/technologies";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const technologies = await getTechnologies();

  return <ProjectForm technologies={technologies} isEditing={false} />;
}
