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
      title: "Artigo não encontrado - David Ericson",
      description: "O artigo solicitado não foi encontrado.",
    };
  }

  return {
    title: `${post.title} | David Ericson`,
    description: post.content.slice(0, 160).replace(/[#*`_]/g, "").trim(),
    openGraph: {
      title: `${post.title} - David Ericson`,
      description: post.content.slice(0, 160).replace(/[#*`_]/g, "").trim(),
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - David Ericson`,
      description: post.content.slice(0, 160).replace(/[#*`_]/g, "").trim(),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatPostDate(post.date);
  const readingTime = estimateReadingTime(post.content);

  return (
    <main className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="blog-detail-breadcrumb" aria-label="Navegação de contexto">
          <Link href="/blog" className="blog-detail-breadcrumb-link">
            <ArrowLeft size={14} />
            <span>Blog</span>
          </Link>
          <ChevronRight size={13} className="blog-detail-breadcrumb-separator" />
          <span className="blog-detail-breadcrumb-current">{post.title}</span>
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
  );
}
