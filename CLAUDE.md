# CLAUDE.md

## Project Overview

Personal portfolio website for Felipe Bueno, a fullstack developer. Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS**. Deployed on **Vercel**.

Live site: https://felipe-bueno.com

## Quick Reference

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js ESLint
```

## Project Structure

```
app/                    # Next.js App Router pages and API routes
├── api/
│   ├── contact/route.ts    # POST - Contact form (Resend email, rate-limited)
│   └── lastfm/route.ts     # GET  - Last.fm now-playing (60s cache)
├── projects/page.tsx       # /projects - Full project listing
├── words/
│   ├── page.tsx            # /words - Blog listing (client search + sort)
│   └── [slug]/page.tsx     # /words/[slug] - Blog post
├── layout.tsx              # Root layout (metadata, providers, theme init)
├── page.tsx                # / - Home page
└── globals.css             # Global styles, Tailwind, liquid glass effects

components/             # React components (mostly client components)
├── blog/
│   ├── BlogArticle.tsx     # Post layout: TOC, reading progress, recommendations
│   ├── MetaBadge.tsx       # Site badge sized for a metadata line
│   ├── RichText.tsx        # Contentful Rich Text renderer
│   └── WordsList.tsx       # /words listing with search and sort
├── utils/
│   └── mouse-position.tsx  # useMousePosition hook
├── Hero.tsx                # Hero section with 3D image rotation
├── About.tsx               # About section with Last.fm integration
├── AboutSection.tsx        # About + Resume grid wrapper
├── Resume.tsx              # Experience & education display
├── ContactForm.tsx         # Contact form with Zod validation
├── ProjectCard.tsx         # Project card component
├── ProjectsSection.tsx     # Projects grid (shows 4 featured)
├── SectionContainer.tsx    # Main sections orchestrator
├── TheNavbar.tsx           # Navigation bar
├── TheFooter.tsx           # Footer
├── ThemeToggle.tsx         # Dark/light mode toggle
├── LanguageSelector.tsx    # EN/PT language switcher
├── LiquidGlass.tsx         # Glass morphism effect (badge, card, default variants)
├── MouseGradient.tsx       # Mouse-following gradient background
├── ScrollReveal.tsx        # Intersection Observer reveal animation
├── ScrollNavigator.tsx     # Scroll progress indicator
├── RecentTrack.tsx         # Last.fm currently playing display
├── Availability.tsx        # Work availability status
├── OpenToWorkBadge.tsx     # Pulsing "Open to Work" badge
├── Badge.tsx               # Skill/tech badge with icon
├── StructuredData.tsx      # JSON-LD SEO schemas
├── SocialIcons.tsx         # Inline GitHub/LinkedIn SVG icons
└── i18nProvider.tsx        # i18next provider wrapper

data/                   # Static content data (bilingual EN/PT)
├── about.ts                # Bio, availability, skills TLDR
├── projects.ts             # 6 featured projects with descriptions
└── resume.ts               # Work experience & education

hooks/
└── useTheme.ts             # Theme state management with localStorage

lib/
├── blog.ts                 # Pure search, sort and recommendation logic
├── blogContent.ts          # Contentful blog fetching (locale-aware)
├── contentfulContent.ts    # Contentful site content fetching
├── disposableEmail.ts      # Server-only disposable email check + server contact schema
├── locale.ts               # Locale cookie parsing and negotiation
├── richText.ts             # Rich Text headings, plain text, reading time
├── serverLocale.ts         # Locale resolution on the server
├── siteContent.ts          # Contentful with bundled fallback
└── validation.ts           # Client-safe Zod contact form schema

contentful/             # Content model migrations and seed script
└── migrations/

locales/                # i18n translation files
├── en/translation.json     # English UI strings
└── pt/translation.json     # Portuguese UI strings

utils/
├── emailValidation.ts      # Email regex validator
└── i18n.ts                 # i18next configuration

public/                 # Static assets
├── pdfs/                   # Resume PDFs (EN/PT)
├── bg-main.webp            # Light mode background
├── bg-main-dark.webp       # Dark mode background
├── hero.jpg                # Hero section image
└── *.webp                  # Project thumbnail images
```

## Architecture & Key Patterns

### Rendering Strategy
- Most components are **client components** (`"use client"`) due to animations, i18n, and interactivity
- Layout, footer, and structured data are **server components**
- API routes handle server-side logic (email, Last.fm proxy)

### Internationalization (i18n)
- **Framework**: i18next + react-i18next
- **Languages**: English (default), Portuguese (pt)
- **UI strings**: `locales/{en,pt}/translation.json` - use `t('key')` from `useTranslation()`
- **Content data**: `data/*.ts` files export objects keyed by locale (`en`/`pt`)
- **Language detection**: Browser-based, persisted in `localStorage('i18nextLng')`
- When adding new UI text, add translation keys to **both** `locales/en/translation.json` and `locales/pt/translation.json`

### Theme System (Dark/Light Mode)
- **No flash**: Inline script in `<head>` reads `localStorage('theme')` before React hydration
- **Dual selectors**: Tailwind configured with `darkMode: ["class", '[data-mode="dark"]']`
- **Hook**: `useTheme()` returns `{ theme, toggleTheme, mounted }`
- **Background**: Light/dark backgrounds use `body::before`/`body::after` pseudo-elements with opacity swap
- Use `dark:` Tailwind prefix for dark mode styles

### Liquid Glass Effect
- Three CSS variants defined in `globals.css`: `.liquid-glass`, `.liquid-glass-badge`, `.liquid-glass-card`
- Mouse-tracking highlight via CSS custom properties (`--mouse-x`, `--mouse-y`)
- Animated conic-gradient border glow on hover
- Reusable wrapper component: `components/LiquidGlass.tsx`

### Animation Patterns
- **CSS animations only** (emoji wave, `.hero-fade-in`, `.scroll-reveal`) — no animation library, to keep JS off the critical path
- **Intersection Observer** via `ScrollReveal.tsx` for scroll-triggered reveals
- **Always respect** `prefers-reduced-motion` - disable animations when user prefers reduced motion

### Performance Conventions
- GPU acceleration via `translate3d(0,0,0)` and `backface-visibility: hidden`
- Throttled mouse tracking (16ms intervals via `requestAnimationFrame`)
- Passive event listeners for scroll/mouse events
- Package imports optimized in `next.config.mjs` (`optimizePackageImports`)
- `console.log` stripped in production (except `error` and `warn`)
- Image optimization: AVIF/WebP formats, Next.js `<Image>` component

## Environment Variables

Create `.env.local` at project root:

```bash
RESEND_API_KEY=...             # Required - Resend email service API key
CONTENTFUL_SPACE_ID=...        # Required - Contentful space
CONTENTFUL_DELIVERY_TOKEN=...  # Required - Contentful Content Delivery API token
CONTENTFUL_ENVIRONMENT_ID=...  # Optional - defaults to "master"
CONTENTFUL_MANAGEMENT_TOKEN=.. # Only for running migrations
LAST_FM_API_KEY=...            # Optional - Last.fm API key for now-playing
LAST_FM_USER=...               # Optional - Last.fm username
```

## External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| **Contentful** | Site content, resume, projects and blog posts | `CONTENTFUL_*` env vars |
| **Resend** | Contact form email delivery | `RESEND_API_KEY` env var |
| **Last.fm** | Currently playing track display | `LAST_FM_API_KEY` + `LAST_FM_USER` env vars |
| **Vercel Analytics** | User analytics | Auto-configured on Vercel |
| **Vercel Speed Insights** | Core Web Vitals | Auto-configured on Vercel |

## Code Conventions

### Naming
- Components: **PascalCase** filenames (e.g., `ProjectCard.tsx`, `TheNavbar.tsx`)
- Prefix layout components with `The` (e.g., `TheNavbar.tsx`, `TheFooter.tsx`)
- Hooks: **camelCase** with `use` prefix (e.g., `useTheme.ts`)
- Utils: **camelCase** filenames (e.g., `emailValidation.ts`)
- Data files: **camelCase** filenames (e.g., `projects.ts`)

### Styling
- **Tailwind CSS** for all styling - avoid inline styles
- **fluid-tailwind** plugin for responsive fluid typography/spacing
- Custom font families: `font-sans` (IBM Plex Sans), `font-mono` (Geist Mono), `font-space-grotesk` (Space Grotesk)
- Accent color: **rose-500** (`#f43f5e`) used consistently across the UI
- Use `clsx` + `tailwind-merge` for conditional class composition

### Imports
- Use `@/*` path alias for project root imports (e.g., `@/components/Hero`)
- Group imports: React/Next.js first, then external libs, then local modules

### Commit Messages
- **Conventional Commits** format: `type: description`
- Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`
- Messages in Portuguese or English (historically mixed, either is acceptable)

### Data & Content
- All user-facing content that varies by language lives in `data/*.ts` (structured data) or `locales/*/translation.json` (UI strings)
- Content data objects are keyed by locale: access via `data[locale]` where `locale` is `'en'` or `'pt'`

## Important Notes

- Tests run on **Vitest** (`npm test`); they cover pure logic, hooks and API routes
- **Contentful is the live content source** for projects, about, resume, UI copy and
  the blog. `lib/siteContent.ts` falls back to the bundled `data/*.ts` copy if the
  API fails; the blog has no bundled fallback and renders an empty state instead
- Never import `lib/disposableEmail.ts` from a client component: the domain list is ~2.3 MB
- Node.js 18+ is required
- The project uses **npm** as its package manager (not yarn/pnpm)
