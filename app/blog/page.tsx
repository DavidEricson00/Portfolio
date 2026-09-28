import type { Metadata } from "next";
import { getAllPosts } from "@/data/posts.mock";
import { BlogTimelineItem } from "@/components/blog/BlogTimelineItem";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBlogListSchema } from "@/lib/seo/schemas/collection";
import { SITE_CONFIG } from "@/lib/seo/config";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_CONFIG.url}/blog`,
    title: `Blog — ${SITE_CONFIG.name}`,
    description:
      "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `Blog — ${SITE_CONFIG.name}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `Blog — ${SITE_CONFIG.name}`,
    description:
      "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
    images: [`${SITE_CONFIG.url}/og-image.png`],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd schema={buildBlogListSchema(posts)} />
      <main className="blog-page-container">
        <header className="blog-page-header">
          <span className="blog-page-eyebrow">BLOG & ARTIGOS</span>
          <h1 className="blog-page-title">Anotações de um Desenvolvedor</h1>
          <p className="blog-page-description">
            Coisas que eu aprendi, construí, descobri e achei interessante 
            o bastante para escrever sobre.
          </p>
        </header>

        <section className="blog-timeline" aria-label="Lista de artigos">
          {posts.map((post, index) => (
            <BlogTimelineItem
              key={post.id}
              post={post}
              isLast={index === posts.length - 1}
            />
          ))}
        </section>
      </main>
    </>
  );
}

