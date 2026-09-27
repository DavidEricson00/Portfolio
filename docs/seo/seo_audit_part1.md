# Auditoria Técnica de SEO — Portfólio David Ericson
## Parte 1: Estado Atual e Análise Semântica

> Baseada na leitura direta de todos os arquivos. Nenhuma suposição foi feita.

---

## 1. ESTADO ATUAL

### ✅ O que já está correto

| Item | Localização |
|------|-------------|
| `lang="pt-BR"` no `<html>` | `layout.tsx:40` |
| `<meta name="author">` via `authors` | `layout.tsx:21` |
| `generateStaticParams` nos slugs | ambos `[slug]/page.tsx` |
| `generateMetadata` dinâmico por página | projetos e posts |
| `<time dateTime={post.date}>` | `blog/[slug]/page.tsx:89` |
| `<article>` para conteúdo de post | `blog/[slug]/page.tsx:100` |
| `<nav aria-label>` nos breadcrumbs visuais | ProjectHero e blog slug |
| `<section aria-label="Lista de artigos">` | `blog/page.tsx:39` |
| `<footer>` semântico global | `Footer.tsx` |
| `notFound()` para slugs inválidos | ambos `[slug]/page.tsx` |
| `rel="noopener noreferrer"` em externos | Footer e ProjectHero |
| `alt` descritivo na imagem do hero | `"Pixel art de David Ericson..."` |

### ❌ O que está incompleto

| Item | Problema |
|------|----------|
| **`metadataBase` ausente** | Sem isso, Next.js não resolve URLs absolutas. Todas as URLs de `og:image` ficam relativas e inválidas para scrapers externos. **Crítico.** |
| **`sitemap.xml` ausente** | Não existe `app/sitemap.ts`. Crawlers não têm mapa de URLs. |
| **`robots.txt` ausente** | Não existe `app/robots.ts`. Sem orientação para crawlers. |
| **JSON-LD ausente em todas as páginas** | Zero dados estruturados. |
| **Open Graph na Home** | A Home não tem OG algum — sem card ao compartilhar. |
| **`og:site_name` e `og:locale`** | Ausentes em todas as páginas. |
| **Breadcrumb apenas visual, sem JSON-LD** | BreadcrumbList inexistente. |
| **Descrição de post com limpeza incompleta** | `slice(0, 160).replace(/[#*\`_]/g, "")` — não remove `**`, `~~`, `>`, code blocks. |
| **`og:type` errado em projetos** | `"article"` — projetos não são artigos. Deveria ser `"website"`. |
| **Imagens de projeto com `<img>` nativo** | `ProjectHero.tsx:121` usa `<img>` sem `next/image` — sem CLS protection, sem lazy load. |
| **`manifest.json` ausente** | Sem manifest para PWA/instalação. |

### ⚠️ O que está redundante

| Item | Problema |
|------|----------|
| `keywords` em todas as páginas | Sem impacto no Google desde 2009. Zero retorno sobre custo de manutenção. |
| Sufixo `"| David Ericson"` repetido manualmente | Layout não usa `title.template` do Next.js. |
| `David Ericson` como keyword em todas as páginas | Repetição desnecessária. |

### 🔴 O que está mal modelado

| Item | Problema |
|------|----------|
| `og:type: "article"` em projetos | Projetos de software não são artigos. |
| Breadcrumb sem `<ol>/<li>` | Padrão semântico correto para navegação hierárquica. |
| `estimateReadingTime` bug | `split(/\\s+/)` (string) em vez de `split(/\s+/)` (regex). Contagem incorreta. |
| `unoptimized` no hero | Desativa todas as otimizações do Next.js Image para imagem local. |
| `<h3>` e `<h4>` no Footer | Fora de hierarquia de heading — sem `<h1-2>` anterior no footer. |

---

## 2. IDENTIDADE SEMÂNTICA

### Propriedades `Person` viáveis agora

| Propriedade | Classificação | Fonte |
|-------------|--------------|-------|
| `name: "David Ericson"` | **A** — Diretamente sustentado | layout, footer, contact |
| `url` | **A** | URL do site |
| `email` | **A** | `contact.mock.ts` |
| `sameAs` [GitHub, LinkedIn] | **A** | `contact.mock.ts` |
| `jobTitle: "Desenvolvedor Fullstack"` | **A** | HeroSection, Footer |
| `description` | **A** | layout.tsx description |
| `alumniOf` [IFCE, EEEP] | **A** | `education.mock.ts` |
| `knowsAbout` [tecnologias principais] | **B** — Derivável | `technologies.mock.ts` |
| `image` (foto real) | **C** — Exige novo campo | Só existe pixel art |
| `worksFor` (empresa atual) | **C** — Ambíguo | Dados de exp têm datas futuras |
| `telephone` (WhatsApp) | **C** — Decisão pessoal | Existe mas expor é invasivo |
| `alternateName`, `birthDate` | **D** — Não implementar | Sem dado |

> **Sobre a pixel art**: `app/assets/images/pixel-david.png` é uma ilustração, não retrato real. Usar como `Person.image` no JSON-LD seria semanticamente enganoso. Não usar.

### Schema `Person` completo derivável dos dados atuais

```json
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
    "Node.js", "TypeScript", "NestJS", "Express",
    "React", "Next.js", "PostgreSQL", "MongoDB",
    "Docker", "AWS Lambda", "RabbitMQ"
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
}
```

---

## 3. TIPOS SCHEMA.ORG POR ENTIDADE

### Home: `ProfilePage` + `WebSite` + `Person`

**Por que `ProfilePage`?** Introduzida no Schema.org v16 para portfólios e perfis profissionais. Mais específica que `WebPage`. Google documenta suporte no contexto de Knowledge Graph.

**Por que não `ItemList`?** A Home tem seções diversas (experiência, projetos, formação, contato). Não é lista homogênea. `ItemList` seria forçado.

```
ProfilePage → mainEntity → Person
WebSite → author → Person
```

### Experiências: `worksFor` + `Occupation`

- `WorkExperience` **não existe** no Schema.org oficial. Não usar.
- `EmployeeRole` existe mas listar todo o histórico de experiências em JSON-LD não é bem suportado.
- **Recomendação**: Apenas `worksFor` (emprego mais recente) no schema `Person`. O histórico completo está no HTML semântico — crawlers lerão isso.

| Propriedade | Classificação |
|-------------|--------------|
| `role` → `jobTitle` | **A** |
| `company` → `Organization.name` | **A** |
| `startDate` / `endDate` | **A** |
| `points` → `description` | **B** (join com `\n`) |
| `location` | **C** (tipo tem o campo, dados não preencheram) |
| `technologies` via schema | **D** (Schema.org não tem propriedade para skills de role) |

### Formação: mapeamento por tipo

| `Education.type` | Schema.org |
|-----------------|-----------|
| `"graduacao"` | `CollegeOrUniversity` em `alumniOf` |
| `"curso"` | `Course` com `provider: EducationalOrganization` |
| `"tecnico"` | `EducationalOrganization` em `alumniOf` |
| `"bootcamp"` | `Course` com `provider: EducationalOrganization` |
| `"certificacao"` | `EducationalOccupationalCredential` |

### Projetos: decisão por projeto

| Projeto | Tipo recomendado | Justificativa |
|---------|-----------------|---------------|
| LetterDrop | `CreativeWork` | API/microsserviço sem UI pública |
| LinkShortener | `WebApplication` | Tem `liveUrl` com interface web |
| SupportDesk | `WebApplication` | Plataforma fullstack com frontend |
| PedeAi | `CreativeWork` | Bot Telegram — não é web app |
| DialoGO | `WebApplication` | Frontend de chat acessível |

**Por que não `SoftwareApplication` para todos?**
- `SoftwareApplication` pressupõe produto com usuários finais instalando/executando.
- Rich results do Google com `SoftwareApplication` requerem `aggregateRating` ou `offers` — sem eles, é apenas semântica.
- Projetos de portfólio que são apenas repositórios GitHub não se qualificam bem.

**Por que não `Project` do Schema.org?**
- `Project` é subclasse de `Organization` no Schema.org — representa projeto como entidade organizacional. Semanticamente errado para portfólios de desenvolvimento.

### Tecnologias nos projetos: como representar

| Propriedade | Adequação |
|-------------|-----------|
| `keywords` | ✅ Correto — tecnologias são palavras-chave válidas |
| `programmingLanguage` | ✅ Apenas para linguagens reais (TypeScript, Python, JavaScript, etc.) |
| `applicationSubCategory` | ❌ Não é para tecnologias individuais |
| `about` | ❌ Abuso — sobre o conteúdo, não ferramentas |
| `mentions` | ❌ Para referências no texto |
| `softwareRequirements` | ❌ Requisitos de uso, não de desenvolvimento |

```ts
const PROGRAMMING_LANGUAGES = ["typescript", "javascript", "python", "java", "php", "c"];

// keywords: todas as tecnologias
keywords: project.technologies.map(t => t.name).join(", ")

// programmingLanguage: apenas linguagens
programmingLanguage: project.technologies
  .filter(t => PROGRAMMING_LANGUAGES.includes(t.id))
  .map(t => t.name)
```

### Blog: `BlogPosting` > `Article`

`BlogPosting` é subclasse de `Article` — mais específico para blogs.

| Propriedade | Classificação | Derivação |
|-------------|--------------|-----------|
| `headline` | **A** | `post.title` |
| `datePublished` | **A** | `post.date` (já em ISO 8601) |
| `author` + `publisher` | **A** | `{ "@id": ".../#person" }` |
| `mainEntityOfPage` | **A** | URL absoluta do artigo |
| `inLanguage: "pt-BR"` | **A** | Fixo |
| `description` | **B** | Excerpt limpo do Markdown |
| `wordCount` | **B** | `content.split(/\s+/).length` |
| `dateModified` | **C** | Não existe em `Post` |
| `image` | **C** | `Post` não tem `coverImage` |
| `keywords` | **D** | Inferência especulativa |
| `articleBody` | **D** | Nunca colocar Markdown bruto no JSON-LD |

**Requisito mais importante para rich result de artigo no Google: `image`**. Sem ela, rich result não aparece. Adicionar `Post.coverImage?: string` é altamente recomendado.

### Breadcrumbs: onde e como

| Página | Necessário? |
|--------|------------|
| `/` | ❌ Home não tem hierarquia acima |
| `/projetos` | ❌ Apenas 1 nível |
| `/projetos/[slug]` | ✅ 2 níveis — tem breadcrumb visual |
| `/blog` | ❌ Apenas 1 nível |
| `/blog/[slug]` | ✅ 2 níveis — tem breadcrumb visual |

Breadcrumbs visuais já existem e devem ser espelhados no JSON-LD. O HTML deve usar `<ol>/<li>`:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/projetos">Projetos</a></li>
    <li aria-current="page">LetterDrop</li>
  </ol>
</nav>
```

### Arquitetura de `@id` para evitar duplicação

```json
// Global (layout.tsx): definição completa
{ "@type": "Person", "@id": "https://davidericson.dev/#person", "name": "David Ericson" }

// Em cada artigo/projeto: apenas referência
{ "author": { "@id": "https://davidericson.dev/#person" } }
```

---

## 4. SEO vs. RICH RESULTS vs. RANKING

| Schema | Compreensão semântica | Rich Result possível | Requer para RR |
|--------|----------------------|---------------------|----------------|
| `Person` | ✅ | Knowledge Panel (incerto) | `name`, `url`, imagem |
| `ProfilePage` | ✅ | Possível | `mainEntity: Person` |
| `WebSite` | ✅ | Apenas Sitelinks Searchbox | `SearchAction` |
| `BlogPosting` | ✅ | ✅ Rich article result | `image` (obrigatório) |
| `BreadcrumbList` | ✅ | ✅ Breadcrumb no SERP | Refletir navegação real |
| `CreativeWork` | ✅ | ❌ | — |
| `WebApplication` | ✅ | ❌ sem aggregateRating | `aggregateRating` |

> **Nenhum schema tem impacto direto comprovado em ranking**. Structured data ajuda compreensão e pode gerar rich results visuais, mas não é fator de ranking confirmado.

---

## 5. METADATA, OG, CANONICAL E ROBOTS

### `og:type` correto por página

| Página | `og:type` |
|--------|----------|
| Home | `website` |
| `/projetos` | `website` |
| `/projetos/[slug]` | `website` (não `article`) |
| `/blog` | `website` |
| `/blog/[slug]` | `article` ✅ |

### Canonical por página

| Página | Canonical |
|--------|----------|
| `/` | `https://davidericson.dev/` (auto via metadataBase) |
| `/projetos` | `https://davidericson.dev/projetos` (explícita) |
| `/projetos?tech=nodejs` | `https://davidericson.dev/projetos` (canonical para base) |
| `/projetos/[slug]` | Auto via metadataBase + slug |
| `/blog/[slug]` | Auto via metadataBase + slug |

> **Nota importante**: `ProjectsPageContent` é `"use client"` e atualiza a URL via `window.history.replaceState`. O servidor **sempre** renderiza `/projetos` sem query params. A canonical do servidor já é `/projetos` — boa arquitetura SEO.

### URLs indexáveis

| URL | Indexável? |
|-----|-----------|
| `/`, `/projetos`, `/blog` | ✅ |
| `/projetos/[slug]` existente | ✅ |
| `/blog/[slug]` existente | ✅ |
| `/projetos?tech=...` | ❌ (não chega ao servidor) |
| `/projetos/[slug]` inexistente | ❌ (404 via `notFound()`) |

### Imagens externas — riscos

| Origem | Risco |
|--------|-------|
| Imgur (`i.imgur.com`) | CDN de terceiro, imagens podem ser removidas |
| GitHub attachments (`user-attachments/assets`) | URLs podem mudar ou expirar |
| skillicons.dev | CDN externo sem SLA |

**Necessidade de `remotePatterns` no `next.config.ts`** para usar `next/image` com essas fontes:

```ts
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
```

---

## 6. CHECKLIST DE VALIDAÇÃO

### Antes de publicar

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — páginas individuais
- [ ] [Schema.org Validator](https://validator.schema.org/) — conformidade Schema.org
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — OG
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] DevTools > Elements > `<head>` — todas as meta tags
- [ ] Verificar `rel="canonical"` em todas as páginas
- [ ] `/robots.txt` em produção — conteúdo correto
- [ ] `/sitemap.xml` em produção — todas as URLs
- [ ] `og:image` é URL absoluta e acessível externamente
- [ ] Lighthouse Accessibility — hierarquia de headings, alt text
- [ ] [axe DevTools](https://www.deque.com/axe/) — issues semânticas

