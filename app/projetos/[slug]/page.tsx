import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/data/projects.mock";
import { getProjectSectionConfig } from "@/types/project";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectSection } from "@/components/projects/ProjectSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProjectSchema } from "@/lib/seo/schemas/project";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas/breadcrumb";
import { SITE_CONFIG } from "@/lib/seo/config";
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
      title: "Projeto não encontrado",
      description: "O projeto solicitado não foi encontrado.",
    };
  }

  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: projectUrl },
    openGraph: {
      type: "website",
      url: projectUrl,
      title: project.name,
      description: project.summary,
      images: project.coverImage
        ? [{ url: project.coverImage, alt: `Screenshot de ${project.name}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
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

  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;

  // Sort sections dynamically based on the central section configuration order
  const sortedSections = [...project.sections].sort((a, b) => {
    const orderA = getProjectSectionConfig(a.type).order;
    const orderB = getProjectSectionConfig(b.type).order;
    return orderA - orderB;
  });

  const breadcrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Projetos", url: `${SITE_CONFIG.url}/projetos` },
    { name: project.name, url: projectUrl },
  ];

  return (
    <>
      <JsonLd
        schema={[
          buildBreadcrumbSchema(breadcrumbs),
          buildProjectSchema(project),
        ]}
      />
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
    </>
  );
}

