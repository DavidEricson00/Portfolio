// lib/seo/schemas/website.ts
import { SITE_CONFIG } from "../config";

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    "@id": SITE_CONFIG.websiteId,
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    author: { "@id": SITE_CONFIG.personId },
    publisher: { "@id": SITE_CONFIG.personId },
  };
}
