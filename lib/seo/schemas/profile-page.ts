// lib/seo/schemas/profile-page.ts
import { SITE_CONFIG } from "../config";

export function buildProfilePageSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "ProfilePage" as const,
    "@id": `${SITE_CONFIG.url}/#profile-page`,
    url: SITE_CONFIG.url,
    name: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    mainEntity: { "@id": SITE_CONFIG.personId },
  };
}
