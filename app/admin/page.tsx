import { getProjects } from "@/lib/data/projects";
import { getTechnologies } from "@/lib/data/technologies";
import { getPosts } from "@/lib/data/posts";
import { getExperiences } from "@/lib/data/experiences";
import { getEducations } from "@/lib/data/education";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const [
    projects,
    technologies,
    posts,
    experiences,
    educations,
  ] = await Promise.all([
    getProjects(),
    getTechnologies(),
    getPosts(),
    getExperiences(),
    getEducations(),
  ]);

  return (
    <AdminDashboard
      stats={{
        projects: projects.length,
        technologies: technologies.length,
        posts: posts.length,
        experiences: experiences.length,
        education: educations.length,
      }}
    />
  );
}