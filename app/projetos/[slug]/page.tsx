import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/data/projects.mock";
import { getProjectSectionConfig } from "@/types/project";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectSection } from "@/components/projects/ProjectSection";
import "@/components/projects/project-detail.css";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado — David Ericson",
      description: "O projeto solicitado não foi encontrado.",
    };
  }

  const techNames = project.technologies.map((t) => t.name).join(", ");

  return {
    title: `${project.name} — Projetos | David Ericson`,
    description: project.summary,
    keywords: [
      project.name,
      ...project.technologies.map((t) => t.name),
      "David Ericson",
      "Fullstack Developer",
      "Projetos",
    ],
    openGraph: {
      title: `${project.name} — David Ericson`,
      description: project.summary,
      type: "article",
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — David Ericson`,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Sort sections dynamically based on the central section configuration order
  const sortedSections = [...project.sections].sort((a, b) => {
    const orderA = getProjectSectionConfig(a.type).order;
    const orderB = getProjectSectionConfig(b.type).order;
    return orderA - orderB;
  });

  return (
    <main className="project-detail-page">
      <div className="project-detail-container">
        <ProjectHero project={project} />

        <div className="project-sections-timeline">
          {sortedSections.map((section, index) => (
            <ProjectSection
              key={section.id}
              section={section}
              projectName={project.name}
              isLast={index === sortedSections.length - 1}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
