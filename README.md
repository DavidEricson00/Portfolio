# Portfolio Web Application

A modern, high-performance personal portfolio and content management platform built with Next.js (App Router), React, TypeScript, and Google Cloud Firestore. The application is engineered with an emphasis on performance, structured data, search and AI discovery, multi-vendor telemetry, and client-side content administration.

Live Application: [davidericson.vercel.app](https://davidericson.vercel.app/?utm_source=github&utm_medium=profile&utm_campaign=portfolio)

---

## Architectural Overview

The portfolio is structured as a fullstack application leveraging Next.js React Server Components (RSC) for public data delivery and Client Components where user interactivity, motion, or administrative state are required.

Data flows through a centralized access layer in `lib/data/`, connecting directly to Firebase Cloud Firestore for asynchronous persistence. Administrative operations trigger Next.js Server Actions to revalidate cached pages on demand via Incremental Static Regeneration (ISR).

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js App Router                    │
│                                                             │
│   Public Routes (RSC)                 Admin Portal (Client) │
│   ├── / (Home)                        ├── /admin            │
│   ├── /projetos                       ├── /admin/login      │
│   ├── /projetos/[slug]                ├── /admin/projetos   │
│   └── /blog                           └── /admin/*          │
│         │                                    │              │
│         ▼                                    ▼              │
│   Data Access Layer                    AdminGuard &         │
│   (lib/data/*)                         Firebase Auth        │
│         │                                    │              │
│         ├────────────────────────────────────┘              │
│         ▼                                                   │
│   Cloud Firestore & Firebase Auth                           │
│                                                             │
│   Server Actions (lib/actions/*)                            │
│   └── revalidatePath() ──> ISR Cache Purge                  │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
├── app/                  # Next.js App Router pages, layouts, and route handlers
│   ├── admin/            # Administrative portal (CRUD modules & login)
│   ├── api/contact/      # Contact form submission route handler
│   ├── blog/             # Technical blog listing and dynamic post pages
│   ├── projetos/         # Projects directory and dynamic detail pages
│   ├── layout.tsx        # Root layout with fonts, metadata, and analytics
│   ├── page.tsx          # Home page composing major portfolio sections
│   ├── robots.ts         # Dynamic search engine crawler instructions
│   └── sitemap.ts        # Dynamic XML sitemap generator
├── components/           # Modular React components by feature domain
│   ├── admin/            # CMS forms, tables, modals, and auth guard
│   ├── analytics/        # Telemetry providers and URL cleanup utilities
│   ├── hero/             # Interactive hero section with canvas hit-testing
│   ├── navigation/       # Header, footer, and section scroll progress
│   ├── projects/         # Carousel, detail timeline, and markdown renderer
│   ├── projects-page/    # Search, multi-tag filtering, and project grid
│   └── seo/              # JSON-LD structured data injector
├── data/                 # Static navigation definitions and contact channels
├── lib/                  # Business logic and external integrations
│   ├── actions/          # Server Actions for on-demand cache revalidation
│   ├── data/             # Cloud Firestore data access services
│   ├── firebase/         # Firebase app, auth, firestore, and event tracking
│   └── seo/              # Metadata configurations and Schema.org schemas
├── public/               # Static assets, icons, manifest, and llms.txt
└── types/                # TypeScript type definitions and interfaces
```

---

## Technology Stack

| Category | Technologies | Purpose |
|---|---|---|
| **Core Framework** | Next.js 16, React 19, TypeScript 5 | App Router architecture, React Server Components, server actions, and type safety |
| **Styling & Design** | Tailwind CSS v4, Modular CSS | Global token design, layout utilities, and component-scoped stylesheets |
| **Animation & UX** | Motion (`motion/react`), Swiper 14, Lucide React | Scroll-triggered entrance animations, touch carousel, and icon system |
| **Content Processing** | `react-markdown`, `remark-gfm`, `rehype-highlight` | Markdown parsing, tables, and syntax-highlighted code blocks |
| **Persistence & Auth** | Google Cloud Firestore, Firebase Authentication | Relational NoSQL data storage and administrative email/password authentication |
| **Analytics & Metrics** | Google Tag Manager, Firebase Analytics, Microsoft Clarity, Vercel Analytics, Speed Insights | User behavior tracking, event telemetry, session recording, and Core Web Vitals |
| **Hosting & Edge** | Vercel | Global CDN deployment, image optimization, and edge routing |

---

## Content Management System (CMS) & Firebase

The application includes an administrative management panel accessible under `/admin`, backed by Firebase Authentication and Cloud Firestore.

### Data Layer & Relational Mapping

Firestore stores portfolio entities across dedicated collections:

- `technologies`: Tech stack registry with categorization, display ranking, and icon identifiers.
- `projects`: Detailed case studies with summary, repository links, deployment URLs, section arrays, and relational technology IDs.
- `posts`: Technical articles authored in Markdown with metadata and timestamps.
- `experiences`: Professional timeline entries referencing associated technologies.
- `education`: Academic and technical certifications.
- `contacts`: Inbox records submitted via the public contact form.

While Cloud Firestore is a document-oriented NoSQL database, the data layer implements a relational resolution pattern: `projects` and `experiences` store arrays of foreign keys (`technologyIds`). When queried, `lib/data/projects.ts` and `lib/data/experiences.ts` fetch the `technologies` catalog concurrently, map relations, and sort them in descending order based on each technology's configured ranking.

### Administrative Capabilities

- **Project Management:** Project creation and updates with automatic slug generation, Markdown content authoring, screenshot gallery management, and technology association.
- **Article Publishing:** Markdown-driven blog editor with reading time calculation and excerpt extraction.
- **Experience & Education Timelines:** Structured editors for work history, date parsing, and credential categorizations.
- **Technology Catalog:** Classification by domain (Frontend, Backend, Database/ORM, Cloud/DevOps, Tools) and ordering control.
- **Contact Inbox:** Real-time inbox for reviewing incoming contact submissions, text search across sender/subject/body, and deletion with confirmation dialogs.

### On-Demand Cache Revalidation

To maintain the performance benefits of static rendering while reflecting CMS updates immediately, write operations invoke Next.js Server Actions in `lib/actions/`. These actions call `revalidatePath` to purge cached static responses across both public routes (`/`, `/projetos`, `/projetos/[slug]`, `/sitemap.xml`) and administrative interfaces.

---

## Analytics, Telemetry & Data Hygiene

The platform integrates a multi-tier telemetry architecture designed for insights while maintaining user privacy and clean URLs.

### Telemetry Services

- **Google Tag Manager (GTM):** Configured via `@next/third-parties/google` (`GTM-TCMMB226`) to orchestrate third-party tags.
- **Microsoft Clarity:** Integrated via GTM with domain permissions defined in the Content Security Policy to capture heatmaps, session recordings, and interface friction signals.
- **Firebase Analytics:** Client-side tracking using the Firebase SDK (`logEvent`), gated behind browser support verification (`isSupported()`).
- **Vercel Analytics & Speed Insights:** Real-user Core Web Vitals monitoring (LCP, FID/INP, CLS) and page view analytics.

### Typed Event Telemetry

Event dispatching is centralized through `lib/firebase/track.ts` and strictly typed via `AnalyticsEventMap`:

- `cta_hero_click`: Interaction with primary call-to-action buttons (view projects, resume download, contact navigation).
- `project_card_click`: Navigation from featured carousel or project directory to project details.
- `project_github_click` & `project_demo_click`: Outbound clicks to source repositories and live deployments.
- `project_tech_filter`: Multi-tag selection and deselection metrics with active filter counts.
- `project_search`: Debounced search query monitoring (recording query character length and matched result counts without capturing raw sensitive keystrokes).
- `project_filter_clear`: Filter reset tracking.
- `social_click`: Interaction with external profiles (GitHub, LinkedIn, WhatsApp, email).
- `contact_form_submit` & `contact_form_error`: Form completion and submission error monitoring.

### Privacy & Hygiene Controls

- **Route Gating:** The `FirebaseAnalytics` component inspects the current pathname and aborts execution when entering `/admin*`, preventing administrative activity from polluting public metrics.
- **URL Parameter Sanitization (`UtmCleaner`):** Marketing and attribution parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are processed and cleanly stripped from the browser address bar using `window.history.replaceState`. This preserves the user's clean URL bar without triggering page reloads.
- **Non-blocking Execution:** The tracking wrapper isolates telemetry within `try/catch` blocks so analytical errors never degrade or disrupt user interactions.

---

## SEO, GEO & AI Discoverability

The site implements modern search engine optimization (SEO), Generative Engine Optimization (GEO), and Artificial Intelligence Optimization (AIO).

### Dynamic Metadata & Social Previews

Each route implements `generateMetadata` configuring:

- Unique titles using templates (`%s | David Ericson`).
- Contextual meta descriptions.
- Explicit canonical URLs (`alternates.canonical`) matching the production domain.
- Open Graph and Twitter Card tags configured with `summary_large_image` and standard 1200x630 pixel previews.

### Schema.org Linked Data (JSON-LD)

Structured data is rendered into the document head through a dedicated `JsonLd` component, mapping interconnected entities:

- **Person:** Author entity containing professional title, contact channel, verified external profiles (`sameAs`), educational affiliations (`alumniOf`), and skill associations (`knowsAbout`).
- **WebSite & ProfilePage:** Root site descriptors identifying primary entity targets.
- **CollectionPage:** Directory listings for projects (`/projetos`) and technical articles (`/blog`).
- **WebApplication & CreativeWork:** Dynamic project schemas differentiating live web applications from software works, referencing repository URLs and programming languages.
- **BlogPosting:** Article records detailing publication dates, modification dates, word counts, and author relationships.
- **BreadcrumbList:** Hierarchical navigation paths for deep routes.

### Discovery Endpoints

- **XML Sitemap (`app/sitemap.ts`):** Dynamically generated sitemap fetching project and article slugs at request time, assigning priorities and change frequencies across all public URLs.
- **Crawler Directives (`app/robots.ts`):** Directives referencing the canonical sitemap.
- **AI Agent Context (`public/llms.txt`):** Structured markdown documentation following the emerging `llms.txt` standard. It provides LLM crawlers, AI search assistants, and autonomous agents with concise, structured context regarding the engineer, system architecture, tech stack, and project highlights.
- **Google Search Console:** HTML domain verification token deployed at `public/googlee7499718e2865699.html`.

---

## Performance & Accessibility Engineering

### Image Delivery & LCP Optimization

- **Next.js Image Pipeline:** Remote image optimization configured in `next.config.ts` for external CDNs (Imgur, GitHub, Itch.zone, SkillIcons).
- **Hero LCP Prioritization:** The primary hero pixel-art portrait uses explicit responsive breakpoints (`sizes`), `priority`, and `fetchPriority="high"` to minimize Largest Contentful Paint.
- **Web Font Optimization:** Utilizes `next/font/google` with Geist and Geist Mono font families, loaded with CSS variable injection and `display: "swap"` to eliminate layout shifts (CLS).

### Interactive Canvas Hit-Testing

The hero section features an interactive portrait that alters its visual state upon cursor hover. To prevent hover triggers over transparent rectangular bounding areas of the PNG asset:

- An offscreen HTML5 `<canvas>` copies the natural image dimensions on mouse movement.
- Cursor coordinates are mapped to pixel coordinates, checking the alpha channel (`pixel[3] > 0`).
- The hover state only activates when the pointer intersects non-transparent artwork pixels, executed with minimal overhead.

### Component Suspense & Search Architecture

- The project directory (`ProjectsPageContent`) synchronizes search query strings and active technology filters with the URL (`?q=...&tech=...`) via `window.history.replaceState`.
- URL search parameter consumption is isolated inside a React `Suspense` boundary with a static UI fallback, preventing Next.js client-side de-optimizations and hydration mismatches.
- Search input analytics are throttled via a 500ms debounce timer.

### Smooth Navigation & Progress

- `SectionProgress` monitors page scroll position using `window.requestAnimationFrame` and passive scroll listeners, rendering a vertical progress indicator that tracks the active home section without layout thrashing.

---

## Security Implementations

### HTTP Security Headers

`next.config.ts` enforces modern HTTP security headers across all incoming requests:

- **Content Security Policy (CSP):** Strict policy restricting origins for scripts, styles, fonts, frames, images, and network connections. Configured to permit only necessary endpoints:
  - Scripts: Self, Vercel Analytics, Google Tag Manager, Microsoft Clarity.
  - Connections: Firebase API endpoints, Firestore, Google Analytics, Microsoft Clarity, and Vercel Insights.
  - Images: Self, data/blob URIs, whitelisted external media hosts, GTM, and Clarity.
- **Strict-Transport-Security (HSTS):** `max-age=63072000; includeSubDomains; preload` ensuring HTTPS enforcement.
- **X-Frame-Options & frame-ancestors:** Configured to `DENY` / `'none'` to prevent clickjacking.
- **X-Content-Type-Options:** `nosniff` preventing MIME-type sniffing.
- **Referrer-Policy:** `strict-origin-when-cross-origin`.
- **Permissions-Policy:** Explicitly disables camera, microphone, and geolocation APIs.
- **Cross-Origin-Opener-Policy:** `same-origin`.

### Route Protection & Authentication Boundaries

- Administrative pages are shielded by `AdminGuard`, a client-side component listening to Firebase Authentication state and redirecting unauthenticated visitors to `/admin/login`.
- *Security Architecture Note:* Client-side guards protect interface rendering. Comprehensive data access authorization relies on Google Cloud Firestore Security Rules configured in the Firebase Console to restrict create, update, and delete privileges to authenticated administrative sessions.

### Public API Defensive Measures (`/api/contact`)

The contact route handler incorporates several defensive layers against abuse and spam:

- **Sliding Window Rate Limiting:** Enforces a limit of 5 submissions per 10-minute window per client IP address.
- **Client IP Resolution:** Extracts client addresses by inspecting `x-forwarded-for` and `x-real-ip` headers.
- **Honeypot Bot Trap:** Contains an invisible `_gotcha` field. Automated bots filling this hidden input receive a synthetic `200 OK` response while the submission is discarded prior to database writes.
- **Payload Validation:** Strict field length constraints (name: 2-100 chars, contact: 3-150 chars, subject: 2-150 chars, message: 5-5000 chars) preventing malformed or oversized requests.

---

## Deployment & Production Environment

- **Hosting Platform:** [Vercel](https://vercel.com)
- **Production URL:** `https://davidericson.vercel.app`
- **Database & Auth:** Google Cloud Platform / Firebase
- **External Media Hosts:** Imgur, GitHub User Content, Itch.zone, SkillIcons

### Author & Professional Links

- **Engineer:** David Ericson
- **GitHub:** [github.com/DavidEricson00](https://github.com/DavidEricson00)
- **LinkedIn:** [linkedin.com/in/davidericson00](https://www.linkedin.com/in/davidericson00/)
- **X / Twitter:** [x.com/DavidEricson00](https://x.com/DavidEricson00)
