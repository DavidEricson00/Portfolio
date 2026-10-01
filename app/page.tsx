import type { Metadata } from "next";

import { HeroSection } from "@/components/hero/HeroSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SectionProgress } from "@/components/navigation/SectionProgress";

import { JsonLd } from "@/components/seo/JsonLd";

import { buildProfilePageSchema } from "@/lib/seo/schemas/profile-page";
import { SITE_CONFIG } from "@/lib/seo/config";

import { getTechnologies } from "@/lib/data/technologies";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getExperiences } from "@/lib/data/experiences";

import "./home.css";
import { getEducations } from "@/lib/data/education";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Fullstack Dev`,
  description: SITE_CONFIG.description,

  alternates: {
    canonical: SITE_CONFIG.url,
  },

  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} | Fullstack Dev`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.png`],
  },
};

export default async function Home() {
  const [
    technologies,
    featuredProjects,
    experiences,
    educations,
  ] = await Promise.all([
    getTechnologies(),
    getFeaturedProjects(),
    getExperiences(),
    getEducations(),
  ]);

  return (
    <>
      <JsonLd
        schema={buildProfilePageSchema(technologies)}
      />

      <main>
        <SectionProgress />

        <HeroSection />

        <ExperienceSection
          experiences={experiences}
        />

        <ProjectsSection
          projects={featuredProjects}
        />

        <SkillsSection
          technologies={technologies}
        />

        <EducationSection
          educations={educations}
        />

        <ContactSection />
      </main>
    </>
  );
}