"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/types/post";
import {
  formatPostDate,
  estimateReadingTime,
} from "@/lib/data/posts";

export type BlogTimelineItemProps = {
  post: Post;
  isLast?: boolean;
};

export function BlogTimelineItem({
  post,
  isLast = false,
}: BlogTimelineItemProps) {
  const formattedDate = formatPostDate(post.date);
  const readTime = estimateReadingTime(post.content);

  return (
    <article className="blog-timeline-item">
      {/* Timeline Node Column (Consistent with Portfolio Timeline style) */}
      <div className="blog-node-column" aria-hidden="true">
        <div className="blog-node-marker">
          <div className="blog-node-dot" />
          <div className="blog-node-glow" />
        </div>
        {!isLast && <div className="blog-node-line" />}
      </div>

      {/* Post Content Link */}
      <Link
        href={`/blog/${post.slug}`}
        className="blog-post-card"
        aria-label={`Ler artigo: ${post.title}`}
      >
        <div className="blog-post-meta">
          <time dateTime={post.date} className="blog-post-date">
            {formattedDate}
          </time>
          <span className="blog-post-separator" aria-hidden="true">
            •
          </span>
          <span className="blog-post-readtime">{readTime} min de leitura</span>
        </div>

        <div className="blog-post-title-row">
          <h2 className="blog-post-title">{post.title}</h2>
          <ArrowUpRight className="blog-post-arrow" size={18} aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}
