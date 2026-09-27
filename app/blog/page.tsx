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

