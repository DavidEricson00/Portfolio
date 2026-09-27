import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import {
  getAllPosts,
  getPostBySlug,
  formatPostDate,
  estimateReadingTime,
} from "@/data/posts.mock";
import { MarkdownRenderer } from "@/components/projects/MarkdownRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleSchema } from "@/lib/seo/schemas/article";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas/breadcrumb";
import { SITE_CONFIG } from "@/lib/seo/config";
import { extractExcerpt } from "@/lib/seo/utils";
import "@/components/projects/project-detail.css";
import "@/components/blog/blog.css";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artigo não encontrado",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const description = post.excerpt ?? extractExcerpt(post.content);

  return {
    title: post.title,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const formattedDate = formatPostDate(post.date);
  const readingTime = estimateReadingTime(post.content);

  const breadcrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
    { name: post.title, url: postUrl },
  ];

  return (
    <>
      <JsonLd
        schema={[
          buildBreadcrumbSchema(breadcrumbs),
          buildArticleSchema(post),
        ]}
      />
      <main className="blog-detail-page">
        <div className="blog-detail-container">
          {/* Breadcrumb Navigation */}
          <nav
            className="blog-detail-breadcrumb"
            aria-label="Navegação de contexto"
          >
            <ol
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <Link href="/blog" className="blog-detail-breadcrumb-link">
                  <ArrowLeft size={14} />
                  <span>Blog</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight
                  size={13}
                  className="blog-detail-breadcrumb-separator"
                />
              </li>
              <li aria-current="page">
                <span className="blog-detail-breadcrumb-current">
                  {post.title}
                </span>
              </li>
            </ol>
          </nav>

          {/* Post Header */}
          <header className="blog-detail-header">
            <h1 className="blog-detail-title">{post.title}</h1>

            <div className="blog-detail-meta-row">
              <div className="blog-detail-meta-item">
                <Calendar size={14} aria-hidden="true" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>

              <div className="blog-detail-meta-item">
                <Clock size={14} aria-hidden="true" />
                <span>{readingTime} min de leitura</span>
              </div>
            </div>
          </header>

          {/* Post Content (Rich Markdown) */}
          <article className="blog-detail-article">
            <MarkdownRenderer content={post.content} />
          </article>

          {/* Post Footer */}
          <footer className="blog-detail-footer">
            <Link href="/blog" className="blog-back-btn">
              <ArrowLeft size={15} />
              <span>Voltar para todos os artigos</span>
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}

