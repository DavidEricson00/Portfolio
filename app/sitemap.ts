import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/data/projects";
import { getPosts } from "@/lib/data/posts";

import { SITE_CONFIG } from "@/lib/seo/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = SITE_CONFIG.url;

  const [projects, posts] = await Promise.all([
    getProjects(),
    getPosts(),
  ]);

  return [
    {
      url: BASE,
      changeFrequency: "monthly",
      priority: 1.0,
    },

    {
      url: `${BASE}/projetos`,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    {
      url: `${BASE}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    ...projects.map((project) => ({
      url: `${BASE}/projetos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
  ];
}