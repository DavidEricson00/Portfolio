// lib/seo/utils.ts
import { SITE_CONFIG } from "./config";

/**
 * Remove propriedades undefined, null ou "" de um objeto schema
 * antes de serializar para JSON-LD
 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>;
}

/**
 * Garante URL absoluta — converte path relativo para URL completa
 */
export function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_CONFIG.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Extrai excerpt limpo de conteúdo Markdown
 * Remove: code blocks, inline code, headings, bold/italic, blockquotes, listas
 */
export function extractExcerpt(content: string, maxLength = 160): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/>\s+/g, "")
    .replace(/[-*+]\s+/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Conta palavras de conteúdo Markdown (sem marcadores)
 */
export function countWords(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/#{1,6}\s+/g, "")
    .trim();
  return text.split(/\s+/).filter(Boolean).length;
}
