// lib/seo/schemas/article.ts
import type { Post } from "@/types/post";
import { SITE_CONFIG } from "../config";
import { compact, extractExcerpt, countWords } from "../utils";

export function buildArticleSchema(post: Post) {
  const articleUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const description = post.excerpt ?? extractExcerpt(post.content);

  const schema = compact({
    "@context": "https://schema.org" as const,
    "@type": "BlogPosting" as const,
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: description,
    datePublished: post.date,
    dateModified: post.dateModified,
    inLanguage: SITE_CONFIG.language,
    wordCount: countWords(post.content),
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    author: { "@id": SITE_CONFIG.personId },
    publisher: { "@id": SITE_CONFIG.personId },
    image: post.coverImage,
  });

  return schema;
}
