# Contentful setup

This project uses Contentful as the planned Headless CMS for portfolio content, translations, resume data, projects, and blog posts.

## Local CLI

The Contentful CLI is installed locally as a dev dependency.

```bash
npm run contentful:login
```

`contentful login` is enough for local interactive work because the CLI stores a Contentful Management token for your user. For CI or non-interactive runs, create a Content Management API token in Contentful and expose it as `CONTENTFUL_MANAGEMENT_TOKEN`.

Then configure the target space and environment:

```bash
export CONTENTFUL_SPACE_ID="your_space_id"
export CONTENTFUL_ENVIRONMENT_ID="master"
export CONTENTFUL_MANAGEMENT_TOKEN="your_management_token" # only needed outside contentful login sessions
```

Run the initial content model migration:

```bash
npm run contentful:migrate
```

The CLI can use your login session. In CI, set `CONTENTFUL_MANAGEMENT_TOKEN` in the environment and pass it through your deployment provider.

For the Next.js app to read published content later, create a Content Delivery API key and set `CONTENTFUL_DELIVERY_TOKEN`. For draft previews, also set `CONTENTFUL_PREVIEW_TOKEN`. Keep all real tokens in `.env.local` or your deployment provider; do not commit them.

## Locales

Create locales in Contentful before importing entries:

- `en-US` as the default locale for English
- `pt-BR` for Portuguese

The migration marks user-facing fields as localized. Non-localized fields are identifiers, ordering, URLs, status flags, and shared relationships.

## Content model

- `siteProfile`: singleton for hero, about, availability, profile images, and localized resume PDFs.
- `project`: localized portfolio projects with image, URLs, metrics, status, and technology references.
- `technology`: reusable tech badge metadata with Iconify IDs.
- `resumeExperience`: localized resume experience items.
- `education`: localized education and additional education items.
- `uiCopy`: localized key/value copy currently stored in `locales/*.json`.
- `blogCategory`: localized blog taxonomy.
- `blogPost`: localized blog article with rich text, cover image, image gallery, categories, technology references, SEO, and publishing metadata.

## Next step

After the model exists in Contentful, write an import script that maps:

- `data/projects.ts` -> `project` and `technology`
- `data/about.ts` -> `siteProfile`
- `data/resume.ts` -> `resumeExperience`, `education`, and localized `resumePdf` assets
- `locales/en/translation.json` and `locales/pt/translation.json` -> `uiCopy`
- future markdown/blog content -> `blogPost` with Contentful Assets for images
