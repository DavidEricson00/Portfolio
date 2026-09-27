// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllProjects } from "@/data/projects.mock";
import { getAllPosts } from "@/data/posts.mock";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = SITE_CONFIG.url;
  const projects = getAllProjects();
  const posts = getAllPosts();

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
    ...projects.map((p) => ({
      url: `${BASE}/projetos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
  ];
}
