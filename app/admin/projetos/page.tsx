import { getProjects } from "@/lib/data/projects";
import { getTechnologies } from "@/lib/data/technologies";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin";

export default async function AdminProjetosPage() {
  const [projects, technologies] = await Promise.all([
    getProjects(),
    getTechnologies(),
  ]);

  return (
    <ProjectsAdmin
      initialProjects={projects}
      technologies={technologies}
    />
  );
}
