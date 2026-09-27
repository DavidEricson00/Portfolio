# Auditoria Técnica de SEO — Portfólio David Ericson
## Parte 2: Resultados, Arquitetura e Código de Implementação

---

## A. ESTADO ATUAL — Tabela Resumo

| Área | Estado | Problema | Prioridade |
|------|--------|----------|------------|
| `metadataBase` | ❌ Ausente | URLs OG inválidas | **P0** |
| `sitemap.xml` | ❌ Ausente | Sem indexação estruturada | **P0** |
| `robots.txt` | ❌ Ausente | Crawlers sem orientação | **P0** |
| JSON-LD global | ❌ Ausente | Sem identidade semântica | **P0** |
| JSON-LD por página | ❌ Ausente | Sem dados estruturados | **P0** |
| Open Graph na Home | ❌ Ausente | Sem preview social | **P0** |
| Imagem OG global | ❌ Ausente | Sem preview em páginas sem coverImage | **P0** |
| `og:type` em projetos | ⚠️ `article` | Semanticamente errado | **P1** |
| Breadcrumb JSON-LD | ❌ Ausente | Sem rich result de breadcrumb | **P1** |
| `title.template` | ❌ Ausente | Sufixo repetido manualmente | **P1** |
| Canonical explícita | ❌ Ausente | Sem controle de duplicação | **P1** |
| `og:locale` + `og:site_name` | ❌ Ausentes | Sem localização de OG | **P1** |
| JSON-LD `ProfilePage` | ❌ Ausente | Home sem identidade semântica | **P1** |
| JSON-LD `BlogPosting` | ❌ Ausente | Posts sem dados estruturados | **P1** |
| JSON-LD projetos | ❌ Ausente | Projetos sem dados estruturados | **P1** |
| `keywords` meta-tag | ⚠️ Presente | Custo sem retorno | **P2** |
| `<img>` nativo em projetos | ⚠️ | CLS, sem lazy loading | **P2** |
| Breadcrumb HTML `<ol>/<li>` | ⚠️ | Semântica incompleta | **P2** |
| `estimateReadingTime` regex | ⚠️ Bug | `\\s+` string em vez de regex | **P2** |
| `next.config.ts` remotePatterns | ❌ Ausente | Impossibilita `next/image` para externos | **P2** |
| `Post.coverImage` | ❌ Sem campo | Sem rich result de artigos | **P3** |
| `Post.dateModified` | ❌ Sem campo | Rich result incompleto | **P3** |
| Foto real de David | ❌ Sem campo | `Person.image` no JSON-LD | **P3** |

---

## B. O QUE IMPLEMENTAR

### P0 — Essencial
1. `metadataBase` no `layout.tsx`
2. `app/robots.ts`
3. `app/sitemap.ts`
4. JSON-LD global: `Person` + `WebSite` embutido no `layout.tsx`
5. Open Graph na Home com imagem padrão
6. Criar `public/og-image.png` (1200×630px)

### P1 — Importante
1. `title.template` no layout
2. JSON-LD `ProfilePage` na Home
3. JSON-LD `BlogPosting` + `BreadcrumbList` em `/blog/[slug]`
4. JSON-LD `CreativeWork`/`WebApplication` + `BreadcrumbList` em `/projetos/[slug]`
5. JSON-LD `CollectionPage` em `/projetos` e `/blog`
6. Canonical explícita via `alternates` por página
7. `og:locale`, `og:site_name` em todas as páginas
8. Corrigir `og:type` em projetos para `"website"`

### P2 — Melhoria
1. Remover `keywords` meta-tag de todas as páginas
2. `next.config.ts` com `remotePatterns`
3. Substituir `<img>` nativo por `next/image` em ProjectHero
4. Corrigir bug `estimateReadingTime`: `split(/\\s+/)` → `split(/\s+/)`
5. Breadcrumb HTML com `<ol>/<li>`

### P3 — Opcional
1. Adicionar `coverImage?: string` ao tipo `Post`
2. Adicionar `dateModified?: string` ao tipo `Post`
3. Foto real ao site config
4. `twitter:creator` se tiver handle confirmado

---

## C. ARQUITETURA RECOMENDADA

```
src/
├── app/
│   ├── layout.tsx              # metadataBase, title.template, JSON-LD global
│   ├── robots.ts               # NOVO
│   ├── sitemap.ts              # NOVO
│   ├── page.tsx                # metadata Home + JSON-LD ProfilePage
│   ├── projetos/
│   │   ├── page.tsx            # metadata + JSON-LD CollectionPage
│   │   └── [slug]/page.tsx     # generateMetadata + JSON-LD CreativeWork/WebApp + Breadcrumb
│   └── blog/
│       ├── page.tsx            # metadata + JSON-LD CollectionPage
│       └── [slug]/page.tsx     # generateMetadata + JSON-LD BlogPosting + Breadcrumb
│
├── lib/
│   └── seo/
│       ├── config.ts           # NOVO — SITE_CONFIG (URL, nome, IDs de entidades)
│       ├── utils.ts            # NOVO — compact(), extractExcerpt(), toAbsoluteUrl()
│       └── schemas/
│           ├── person.ts       # NOVO — buildPersonSchema()
│           ├── website.ts      # NOVO — buildWebsiteSchema()
│           ├── profile-page.ts # NOVO — buildProfilePageSchema()
│           ├── project.ts      # NOVO — buildProjectSchema(project)
│           ├── article.ts      # NOVO — buildArticleSchema(post)
│           ├── breadcrumb.ts   # NOVO — buildBreadcrumbSchema(items)
│           ├── collection.ts   # NOVO — buildProjectListSchema() + buildBlogListSchema()
│           └── index.ts        # re-exports
│
└── components/
    └── seo/
        └── JsonLd.tsx          # NOVO — <script type="application/ld+json">
```

**Responsabilidades:**
- `lib/seo/config.ts` — única fonte de verdade para URL base e IDs
- `lib/seo/schemas/` — mappers de domínio → Schema.org (puro TypeScript, sem React)
- `components/seo/JsonLd.tsx` — componente que serializa e injeta o JSON-LD
- Pages — chamam os builders e passam para `<JsonLd>`

---

## D. ALTERAÇÕES NOS MODELOS

### `Post` — adicionar campos opcionais

```ts
// types/post.ts
export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  // P3 — opcionais
  coverImage?: string;    // Para og:image e BlogPosting.image
  dateModified?: string;  // YYYY-MM-DD
  excerpt?: string;       // Alternativa à extração do Markdown
};
```

### `Project` — adicionar data

```ts
// types/project.ts — adicionar ao tipo Project
dateCreated?: string;   // YYYY-MM-DD — para dateCreated no JSON-LD
```

### `SITE_CONFIG` — novo arquivo

```ts
// lib/seo/config.ts
export const SITE_CONFIG = {
  url: "https://davidericson.dev",
  name: "David Ericson",
  siteName: "David Ericson — Portfólio",
  description: "Portfólio de David Ericson, desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e arquitetura de sistemas.",
  jobTitle: "Desenvolvedor Fullstack",
  email: "davidestudofcg@gmail.com",
  github: "https://github.com/DavidEricson00",
  linkedin: "https://www.linkedin.com/in/davidericson00/",
  locale: "pt_BR",
  language: "pt-BR",
  // IDs de entidades para linked data
  personId: "https://davidericson.dev/#person",
  websiteId: "https://davidericson.dev/#website",
  // P3 — adicionar quando disponível
  // personImage: "https://davidericson.dev/foto-perfil.jpg",
} as const;

export type SiteConfig = typeof SITE_CONFIG;
```

**Não adicionar** ao modelos: `seoDescription`, `keywords`, `applicationCategory`, `programmingLanguages` — todos são deriváveis ou desnecessários.

---

## E. GERADORES (Funções)

```ts
// lib/seo/schemas/index.ts
buildPersonSchema(): WithContext<Person>
buildWebsiteSchema(): WithContext<WebSite>
buildProfilePageSchema(): WithContext<ProfilePage>
buildProjectSchema(project: Project): WithContext<CreativeWork | WebApplication>
buildArticleSchema(post: Post): WithContext<BlogPosting>
buildBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList>
buildProjectListSchema(projects: Project[]): WithContext<CollectionPage>
buildBlogListSchema(posts: Post[]): WithContext<CollectionPage>
```

---

## F. EXEMPLOS DE JSON-LD FINAIS

### 1. Home (`/`) — 3 schemas em array

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://davidericson.dev/#website",
    "name": "David Ericson — Portfólio",
    "url": "https://davidericson.dev",
    "description": "Portfólio de David Ericson, desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e arquitetura de sistemas.",
    "inLanguage": "pt-BR",
    "author": { "@id": "https://davidericson.dev/#person" },
    "publisher": { "@id": "https://davidericson.dev/#person" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://davidericson.dev/#person",
    "name": "David Ericson",
    "url": "https://davidericson.dev",
    "email": "davidestudofcg@gmail.com",
    "jobTitle": "Desenvolvedor Fullstack",
    "description": "Desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e arquitetura de sistemas.",
    "sameAs": [
      "https://github.com/DavidEricson00",
      "https://www.linkedin.com/in/davidericson00/"
    ],
    "knowsAbout": [
      "Node.js", "TypeScript", "NestJS", "Express", "React",
      "Next.js", "PostgreSQL", "MongoDB", "Docker", "AWS Lambda", "RabbitMQ"
    ],
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE)"
      },
      {
        "@type": "EducationalOrganization",
        "name": "EEEP Wellington Belém de Figueiredo"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://davidericson.dev/#profile-page",
    "url": "https://davidericson.dev",
    "name": "David Ericson | Fullstack Dev",
    "description": "Portfólio de David Ericson, desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e arquitetura de sistemas.",
    "inLanguage": "pt-BR",
    "mainEntity": { "@id": "https://davidericson.dev/#person" }
  }
]
```

### 2. `/projetos`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "url": "https://davidericson.dev/projetos",
  "name": "Projetos — David Ericson",
  "description": "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS, banco de dados e aplicações fullstack.",
  "inLanguage": "pt-BR",
  "author": { "@id": "https://davidericson.dev/#person" },
  "hasPart": [
    {
      "@type": "CreativeWork",
      "name": "LetterDrop",
      "url": "https://davidericson.dev/projetos/letterdrop",
      "description": "Plataforma de newsletter baseada em microsserviços NestJS e RabbitMQ."
    },
    {
      "@type": "WebApplication",
      "name": "LinkShortener",
      "url": "https://davidericson.dev/projetos/linkshortener",
      "description": "Encurtador de URLs serverless desenvolvido na AWS."
    },
    {
      "@type": "WebApplication",
      "name": "SupportDesk",
      "url": "https://davidericson.dev/projetos/supportdesk",
      "description": "Plataforma fullstack de gerenciamento de tickets de suporte."
    },
    {
      "@type": "CreativeWork",
      "name": "PedeAi",
      "url": "https://davidericson.dev/projetos/pedeai",
      "description": "Sistema de pedidos via Telegram com n8n e Google Gemini."
    },
    {
      "@type": "WebApplication",
      "name": "DialoGO",
      "url": "https://davidericson.dev/projetos/dialogo",
      "description": "Plataforma de chat em tempo real com WebSockets e Socket.IO."
    }
  ]
}
```

### 3. `/projetos/letterdrop`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://davidericson.dev" },
      { "@type": "ListItem", "position": 2, "name": "Projetos", "item": "https://davidericson.dev/projetos" },
      { "@type": "ListItem", "position": 3, "name": "LetterDrop", "item": "https://davidericson.dev/projetos/letterdrop" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": "https://davidericson.dev/projetos/letterdrop#project",
    "name": "LetterDrop",
    "description": "Plataforma de newsletter baseada em microsserviços NestJS e RabbitMQ, com processamento assíncrono, entrega idempotente e recuperação de falhas.",
    "url": "https://davidericson.dev/projetos/letterdrop",
    "mainEntityOfPage": "https://davidericson.dev/projetos/letterdrop",
    "author": { "@id": "https://davidericson.dev/#person" },
    "inLanguage": "pt-BR",
    "keywords": "NestJS, TypeScript, RabbitMQ, PostgreSQL, TypeORM, JWT, Jest, Docker, Swagger, Resend, Pino",
    "programmingLanguage": ["TypeScript"],
    "codeRepository": "https://github.com/DavidEricson00/LetterDrop"
  }
]
```

> `coverImage` e `liveUrl` ausentes em LetterDrop — não geram campos no JSON-LD. `image` e `url` omitidos.

### 4. `/blog`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "url": "https://davidericson.dev/blog",
  "name": "Blog — David Ericson",
  "description": "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
  "inLanguage": "pt-BR",
  "author": { "@id": "https://davidericson.dev/#person" },
  "hasPart": [
    {
      "@type": "BlogPosting",
      "headline": "Construindo Microsserviços Resilientes com NestJS, RabbitMQ e Dead Letter Queues",
      "url": "https://davidericson.dev/blog/microsservicos-resilientes-rabbitmq-nestjs",
      "datePublished": "2025-03-20",
      "author": { "@id": "https://davidericson.dev/#person" }
    },
    {
      "@type": "BlogPosting",
      "headline": "APIs Serverless de Baixo Custo: Maximizando DynamoDB TTL e Lambda Authorizers",
      "url": "https://davidericson.dev/blog/arquitetura-serverless-aws-lambda-dynamodb",
      "datePublished": "2025-02-28",
      "author": { "@id": "https://davidericson.dev/#person" }
    },
    {
      "@type": "BlogPosting",
      "headline": "Modelagem de Máquinas de Estados Finitas no Backend para Fluxos Críticos",
      "url": "https://davidericson.dev/blog/maquinas-de-estado-fluxos-criticos-backend",
      "datePublished": "2025-01-14",
      "author": { "@id": "https://davidericson.dev/#person" }
    }
  ]
}
```

### 5. `/blog/microsservicos-resilientes-rabbitmq-nestjs`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://davidericson.dev" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://davidericson.dev/blog" },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Construindo Microsserviços Resilientes com NestJS, RabbitMQ e Dead Letter Queues",
        "item": "https://davidericson.dev/blog/microsservicos-resilientes-rabbitmq-nestjs"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://davidericson.dev/blog/microsservicos-resilientes-rabbitmq-nestjs#article",
    "headline": "Construindo Microsserviços Resilientes com NestJS, RabbitMQ e Dead Letter Queues",
    "description": "Em sistemas distribuídos modernos, o envio de notificações e processamento de cargas assíncronas em segundo plano exige muito mais do que apenas disparar uma requisição HTTP.",
    "datePublished": "2025-03-20",
    "inLanguage": "pt-BR",
    "wordCount": 390,
    "url": "https://davidericson.dev/blog/microsservicos-resilientes-rabbitmq-nestjs",
    "mainEntityOfPage": "https://davidericson.dev/blog/microsservicos-resilientes-rabbitmq-nestjs",
    "author": { "@id": "https://davidericson.dev/#person" },
    "publisher": { "@id": "https://davidericson.dev/#person" }
  }
]
```

> Sem `image` — `Post` não tem `coverImage` atualmente. Sem `dateModified` — campo não existe. `wordCount: 390` derivado do content real.

---

## G. CÓDIGO DE IMPLEMENTAÇÃO

### `components/seo/JsonLd.tsx`

```tsx
// components/seo/JsonLd.tsx
import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  schema: WithContext<Thing> | WithContext<Thing>[];
};

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

> **Nota**: `schema-dts` é um pacote de tipos TypeScript para Schema.org. Instalar: `npm install schema-dts`. Se preferir evitar dependência externa, use `Record<string, unknown>` e valide manualmente.

### `lib/seo/utils.ts`

```ts
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
```

### `lib/seo/schemas/person.ts`

```ts
// lib/seo/schemas/person.ts
import { SITE_CONFIG } from "../config";
import { getAllEducations } from "@/data/education.mock";
import { technologies } from "@/data/technologies.mock";

// Tecnologias que valem como knowsAbout (principais)
const KNOW_ABOUT_CATEGORIES = ["backend", "banco_dados_orm", "cloud_devops"];
const KNOW_ABOUT_MAX = 15;

// Linguagens de programação reais para programmingLanguage
export const PROGRAMMING_LANGUAGE_IDS = [
  "typescript", "javascript", "python", "java", "php", "c"
];

export function buildPersonSchema() {
  const educations = getAllEducations();
  const degree = educations.find(e => e.type === "graduacao");
  const technical = educations.find(e => e.type === "tecnico");

  const knowsAbout = technologies
    .filter(t => KNOW_ABOUT_CATEGORIES.includes(t.category))
    .map(t => t.name)
    .slice(0, KNOW_ABOUT_MAX);

  const alumniOf = [
    degree && {
      "@type": "CollegeOrUniversity" as const,
      "name": degree.institution,
    },
    technical && {
      "@type": "EducationalOrganization" as const,
      "name": technical.institution,
    },
  ].filter(Boolean);

  return {
    "@context": "https://schema.org" as const,
    "@type": "Person" as const,
    "@id": SITE_CONFIG.personId,
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "email": SITE_CONFIG.email,
    "jobTitle": SITE_CONFIG.jobTitle,
    "description": SITE_CONFIG.description,
    "sameAs": [SITE_CONFIG.github, SITE_CONFIG.linkedin],
    "knowsAbout": knowsAbout,
    "alumniOf": alumniOf,
  };
}
```

### `lib/seo/schemas/website.ts`

```ts
// lib/seo/schemas/website.ts
import { SITE_CONFIG } from "../config";

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    "@id": SITE_CONFIG.websiteId,
    "name": SITE_CONFIG.siteName,
    "url": SITE_CONFIG.url,
    "description": SITE_CONFIG.description,
    "inLanguage": SITE_CONFIG.language,
    "author": { "@id": SITE_CONFIG.personId },
    "publisher": { "@id": SITE_CONFIG.personId },
  };
}
```

### `lib/seo/schemas/profile-page.ts`

```ts
// lib/seo/schemas/profile-page.ts
import { SITE_CONFIG } from "../config";

export function buildProfilePageSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "ProfilePage" as const,
    "@id": `${SITE_CONFIG.url}/#profile-page`,
    "url": SITE_CONFIG.url,
    "name": `${SITE_CONFIG.name} | Fullstack Dev`,
    "description": SITE_CONFIG.description,
    "inLanguage": SITE_CONFIG.language,
    "mainEntity": { "@id": SITE_CONFIG.personId },
  };
}
```

### `lib/seo/schemas/project.ts`

```ts
// lib/seo/schemas/project.ts
import type { Project } from "@/types/project";
import { SITE_CONFIG } from "../config";
import { compact } from "../utils";
import { PROGRAMMING_LANGUAGE_IDS } from "./person";

// Determina o tipo Schema.org correto baseado nos dados reais do projeto
function getProjectSchemaType(project: Project): "WebApplication" | "CreativeWork" {
  // WebApplication: tem interface web acessível publicamente
  if (project.liveUrl) return "WebApplication";
  return "CreativeWork";
}

export function buildProjectSchema(project: Project) {
  const schemaType = getProjectSchemaType(project);
  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;

  const programmingLanguages = project.technologies
    .filter(t => PROGRAMMING_LANGUAGE_IDS.includes(t.id))
    .map(t => t.name);

  const schema = compact({
    "@context": "https://schema.org" as const,
    "@type": schemaType as "WebApplication" | "CreativeWork",
    "@id": `${projectUrl}#project`,
    "name": project.name,
    "description": project.summary,
    "url": project.liveUrl || projectUrl,
    "mainEntityOfPage": projectUrl,
    "author": { "@id": SITE_CONFIG.personId },
    "inLanguage": SITE_CONFIG.language,
    "keywords": project.technologies.map(t => t.name).join(", "),
    "image": project.coverImage, // compact() remove se undefined
    "codeRepository": project.repositoryUrl, // compact() remove se undefined
    ...(programmingLanguages.length > 0 && {
      "programmingLanguage": programmingLanguages,
    }),
    ...(project.dateCreated && { "dateCreated": project.dateCreated }),
  });

  return schema;
}
```

### `lib/seo/schemas/article.ts`

```ts
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
    "headline": post.title,
    "description": description,
    "datePublished": post.date,
    "dateModified": post.dateModified, // compact() remove se undefined
    "inLanguage": SITE_CONFIG.language,
    "wordCount": countWords(post.content),
    "url": articleUrl,
    "mainEntityOfPage": articleUrl,
    "author": { "@id": SITE_CONFIG.personId },
    "publisher": { "@id": SITE_CONFIG.personId },
    "image": post.coverImage, // compact() remove se undefined
  });

  return schema;
}
```

### `lib/seo/schemas/breadcrumb.ts`

```ts
// lib/seo/schemas/breadcrumb.ts
export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem" as const,
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
```

### `lib/seo/schemas/collection.ts`

```ts
// lib/seo/schemas/collection.ts
import type { Project } from "@/types/project";
import type { Post } from "@/types/post";
import { SITE_CONFIG } from "../config";
import { getProjectSchemaType } from "./project"; // extrair função se necessário

export function buildProjectListSchema(projects: Project[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "CollectionPage" as const,
    "url": `${SITE_CONFIG.url}/projetos`,
    "name": `Projetos — ${SITE_CONFIG.name}`,
    "description": "Explore todos os projetos de David Ericson: microsserviços NestJS, backend com Node.js e Python, infraestrutura serverless na AWS e aplicações fullstack.",
    "inLanguage": SITE_CONFIG.language,
    "author": { "@id": SITE_CONFIG.personId },
    "hasPart": projects.map(p => ({
      "@type": p.liveUrl ? "WebApplication" : "CreativeWork",
      "name": p.name,
      "url": `${SITE_CONFIG.url}/projetos/${p.slug}`,
      "description": p.summary,
    })),
  };
}

export function buildBlogListSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "CollectionPage" as const,
    "url": `${SITE_CONFIG.url}/blog`,
    "name": `Blog — ${SITE_CONFIG.name}`,
    "description": "Artigos, notas de arquitetura e aprendizados práticos sobre engenharia de software, microsserviços, backend e sistemas distribuídos.",
    "inLanguage": SITE_CONFIG.language,
    "author": { "@id": SITE_CONFIG.personId },
    "hasPart": posts.map(p => ({
      "@type": "BlogPosting" as const,
      "headline": p.title,
      "url": `${SITE_CONFIG.url}/blog/${p.slug}`,
      "datePublished": p.date,
      "author": { "@id": SITE_CONFIG.personId },
    })),
  };
}
```

### Atualização do `app/layout.tsx`

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPersonSchema } from "@/lib/seo/schemas/person";
import { buildWebsiteSchema } from "@/lib/seo/schemas/website";
import { SITE_CONFIG } from "@/lib/seo/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url), // ← CRÍTICO
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} | Fullstack Dev`,
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  // keywords removidas — sem impacto no Google
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    type: "website",
    // Imagem OG padrão — criar public/og-image.png (1200x630)
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_CONFIG.siteName }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SITE_CONFIG.language} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* JSON-LD global: Person + WebSite definidos uma vez, referenciados nas páginas */}
        <JsonLd schema={[buildPersonSchema(), buildWebsiteSchema()]} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### Atualização do `app/page.tsx` (Home)

```tsx
// app/page.tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SectionProgress } from "@/components/navigation/SectionProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProfilePageSchema } from "@/lib/seo/schemas/profile-page";
import { SITE_CONFIG } from "@/lib/seo/config";
import "./home.css";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Fullstack Dev`,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd schema={buildProfilePageSchema()} />
      <main>
        <SectionProgress />
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>
    </>
  );
}
```

### Atualização do `app/projetos/[slug]/page.tsx`

```tsx
// app/projetos/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/data/projects.mock";
import { getProjectSectionConfig } from "@/types/project";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectSection } from "@/components/projects/ProjectSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProjectSchema } from "@/lib/seo/schemas/project";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas/breadcrumb";
import { SITE_CONFIG } from "@/lib/seo/config";
import "@/components/projects/project-detail.css";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProjects().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado",
      description: "O projeto solicitado não foi encontrado.",
    };
  }

  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: projectUrl },
    openGraph: {
      type: "website", // projetos não são artigos
      url: projectUrl,
      title: project.name,
      description: project.summary,
      images: project.coverImage
        ? [{ url: project.coverImage, alt: `Screenshot de ${project.name}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projectUrl = `${SITE_CONFIG.url}/projetos/${project.slug}`;
  const sortedSections = [...project.sections].sort((a, b) =>
    getProjectSectionConfig(a.type).order - getProjectSectionConfig(b.type).order
  );

  const breadcrumbs = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Projetos", url: `${SITE_CONFIG.url}/projetos` },
    { name: project.name, url: projectUrl },
  ];

  return (
    <>
      <JsonLd schema={[
        buildBreadcrumbSchema(breadcrumbs),
        buildProjectSchema(project),
      ]} />
      <main className="project-detail-page">
        <div className="project-detail-container">
          <ProjectHero project={project} />
          <div className="project-sections-timeline">
            {sortedSections.map((section, index) => (
              <ProjectSection
                key={section.id}
                section={section}
                projectName={project.name}
                isLast={index === sortedSections.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
```

### Atualização do `app/blog/[slug]/page.tsx`

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { getAllPosts, getPostBySlug, formatPostDate, estimateReadingTime } from "@/data/posts.mock";
import { MarkdownRenderer } from "@/components/projects/MarkdownRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleSchema } from "@/lib/seo/schemas/article";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas/breadcrumb";
import { SITE_CONFIG } from "@/lib/seo/config";
import { extractExcerpt } from "@/lib/seo/utils";
import "@/components/projects/project-detail.css";
import "@/components/blog/blog.css";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

  if (!post) notFound();

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
      <JsonLd schema={[
        buildBreadcrumbSchema(breadcrumbs),
        buildArticleSchema(post),
      ]} />
      <main className="blog-detail-page">
        <div className="blog-detail-container">
          <nav className="blog-detail-breadcrumb" aria-label="Navegação de contexto">
            <ol style={{ listStyle: "none", display: "flex", alignItems: "center", gap: "8px", padding: 0, margin: 0 }}>
              <li>
                <Link href="/blog" className="blog-detail-breadcrumb-link">
                  <ArrowLeft size={14} />
                  <span>Blog</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="blog-detail-breadcrumb-separator" />
              </li>
              <li aria-current="page">
                <span className="blog-detail-breadcrumb-current">{post.title}</span>
              </li>
            </ol>
          </nav>

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

          <article className="blog-detail-article">
            <MarkdownRenderer content={post.content} />
          </article>

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
```

### `app/robots.ts`

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
```

### `app/sitemap.ts`

```ts
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
    ...projects.map(p => ({
      url: `${BASE}/projetos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
  ];
}
```

### `next.config.ts` atualizado

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "user-images.githubusercontent.com" },
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "go-skill-icons.vercel.app" },
    ],
  },
};

export default nextConfig;
```

### Correção do bug `estimateReadingTime`

```ts
// data/posts.mock.ts — linha 242
// ANTES (bug):
const words = content.trim().split(/\\s+/).length;

// DEPOIS (correto):
const words = content.trim().split(/\s+/).filter(Boolean).length;
```

---

## H. O QUE NÃO IMPLEMENTAR

| Item | Por quê não |
|------|-------------|
| `keywords` meta-tag | Sem impacto no Google desde 2009. Zero retorno. |
| `SoftwareApplication` para projetos apenas com repositório | Pressupõe produto com usuários. Sem `aggregateRating`, é apenas semântica genérica. `CreativeWork` é mais honesto. |
| `WorkExperience` | Não existe no Schema.org oficial. |
| Cada tecnologia como `SoftwareApplication` em `mentions` | Abuso semântico. Zero benefício comprovado. |
| `BreadcrumbList` na Home | Home não tem hierarquia acima. |
| `worksFor` com todas as experiências | Só para emprego atual. Histórico via HTML semântico. |
| `birthDate`, `nationality`, `gender` | Informação privada sem dado disponível. |
| `aggregateRating` em projetos | Sem sistema de avaliação real. Viola diretrizes do Google. |
| `articleBody` com Markdown bruto | Inútil e problemático no JSON-LD. |
| `SearchAction` no `WebSite` | Requer endpoint de busca funcional. Filtro é client-side. |
| Pixel art como `Person.image` | JSON-LD espera retrato real. Pixel art é ilustração. |
| `about` em projetos apontando para tecnologias | `about` = assunto do conteúdo, não ferramentas usadas. |
| `telephone` de WhatsApp no JSON-LD | Expõe número pessoal desnecessariamente em dado público. |
| `Event` para experiências | Experiência profissional não é evento. |
| `FAQPage` | Sem seção de FAQ no site. |
| `HowTo` | Artigos são narrativos, não tutoriais estruturados passo a passo. |

