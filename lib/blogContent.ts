import { cache } from "react";
import type { Document } from "@contentful/rich-text-types";
import { getDeliveryConfig, normalizeAssetUrl } from "@/lib/contentfulContent";
import { BCP47_BY_LOCALE, type LocaleKey } from "@/lib/locale";
import { estimateReadingTime } from "@/lib/richText";

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
};

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: BlogCategory | null;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
};

export type BlogPost = BlogPostSummary & {
  body: Document | null;
  seoTitle: string;
  seoDescription: string;
};

const REVALIDATE_SECONDS = 60;
const MAX_POSTS = 200;

/** Locale padrão do espaço: onde campos não localizados são guardados. */
const SPACE_DEFAULT_LOCALE = BCP47_BY_LOCALE.en;

const contentfulLocaleByAppLocale = BCP47_BY_LOCALE;

type ContentfulLink = { sys: { type: "Link"; linkType: "Entry" | "Asset"; id: string } };

type ContentfulResource = {
  sys: { id: string; type: string; createdAt?: string; updatedAt?: string };
  /** Com `locale=*` cada campo vem como { [locale]: valor }. */
  fields: Record<string, Record<string, unknown> | undefined>;
};

type ContentfulCollection = {
  items: ContentfulResource[];
  includes?: { Entry?: ContentfulResource[]; Asset?: ContentfulResource[] };
};

type Includes = {
  entries: Map<string, ContentfulResource>;
  assets: Map<string, ContentfulResource>;
};

/** Valor no locale pedido, sem cair para o padrão do espaço. */
function strictField(resource: ContentfulResource | undefined, key: string, locale: string) {
  return resource?.fields?.[key]?.[locale];
}

/**
 * Valor no locale pedido, caindo para o padrão do espaço. Necessário porque
 * campos não localizados (status, publishedAt, links) são devolvidos apenas
 * sob o locale padrão quando se consulta com `locale=*`.
 */
function field(resource: ContentfulResource | undefined, key: string, locale: string) {
  const values = resource?.fields?.[key];
  if (!values) return undefined;
  return values[locale] ?? values[SPACE_DEFAULT_LOCALE];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function isLink(value: unknown): value is ContentfulLink {
  const link = value as ContentfulLink | undefined;
  return link?.sys?.type === "Link" && typeof link.sys.id === "string";
}

function resolveEntry(value: unknown, includes: Includes) {
  return isLink(value) && value.sys.linkType === "Entry"
    ? includes.entries.get(value.sys.id)
    : undefined;
}

function resolveAsset(value: unknown, includes: Includes) {
  return isLink(value) && value.sys.linkType === "Asset"
    ? includes.assets.get(value.sys.id)
    : undefined;
}

function assetUrl(asset: ContentfulResource | undefined, locale: string): string {
  const file = field(asset, "file", locale) as { url?: unknown } | undefined;
  return normalizeAssetUrl(file?.url);
}

/** Campos de um recurso com o locale já escolhido, como o renderer espera. */
function flattenFields(resource: ContentfulResource, locale: string) {
  return Object.fromEntries(
    Object.keys(resource.fields).map((key) => [key, field(resource, key, locale)]),
  );
}

/**
 * A Delivery API devolve assets e entries embutidos no corpo como links soltos,
 * com o conteúdo em `includes`. Sem resolver, uma imagem no meio do post some
 * silenciosamente — o renderer procura `target.fields.file` e acha um Link.
 */
function resolveRichTextLinks<T>(node: T, includes: Includes, locale: string): T {
  if (Array.isArray(node)) {
    return node.map((item) => resolveRichTextLinks(item, includes, locale)) as T;
  }

  if (!node || typeof node !== "object") return node;

  const entries = Object.entries(node as Record<string, unknown>).map(([key, value]) => {
    if (key === "target" && isLink(value)) {
      const resource =
        value.sys.linkType === "Asset"
          ? includes.assets.get(value.sys.id)
          : includes.entries.get(value.sys.id);

      return [key, resource ? { sys: resource.sys, fields: flattenFields(resource, locale) } : value];
    }

    return [key, resolveRichTextLinks(value, includes, locale)];
  });

  return Object.fromEntries(entries) as T;
}

function buildIncludes(collection: ContentfulCollection): Includes {
  return {
    entries: new Map((collection.includes?.Entry ?? []).map((entry) => [entry.sys.id, entry])),
    assets: new Map((collection.includes?.Asset ?? []).map((asset) => [asset.sys.id, asset])),
  };
}

function mapCategory(
  entry: ContentfulResource | undefined,
  locale: string,
): BlogCategory | null {
  if (!entry) return null;

  const title = asString(field(entry, "title", locale));
  if (!title) return null;

  return {
    id: entry.sys.id,
    title,
    slug: asString(field(entry, "slug", locale)),
  };
}

/**
 * Um post só existe num idioma se os campos que carregam a leitura estiverem
 * traduzidos. Sem isso, o Contentful devolveria o texto em inglês sob o locale
 * pt-BR e o leitor cairia num post que não pediu.
 */
const REQUIRED_TRANSLATED_FIELDS = ["title", "slug", "excerpt", "body"] as const;

function hasTranslation(entry: ContentfulResource, locale: string): boolean {
  if (locale === SPACE_DEFAULT_LOCALE) return true;

  return REQUIRED_TRANSLATED_FIELDS.every((key) => Boolean(strictField(entry, key, locale)));
}

function mapPost(entry: ContentfulResource, includes: Includes, locale: string): BlogPost {
  const rawBody = field(entry, "body", locale) as Document | undefined;
  const body = rawBody ? resolveRichTextLinks(rawBody, includes, locale) : null;
  const declaredReadingTime = field(entry, "readingTimeMinutes", locale);
  const publishedAt = asString(field(entry, "publishedAt", locale)) || entry.sys.createdAt || "";

  return {
    id: entry.sys.id,
    title: asString(field(entry, "title", locale)),
    slug: asString(field(entry, "slug", locale)),
    excerpt: asString(field(entry, "excerpt", locale)),
    body,
    coverImage: assetUrl(resolveAsset(field(entry, "coverImage", locale), includes), locale),
    coverImageAlt: asString(field(entry, "coverImageAlt", locale)),
    category: mapCategory(resolveEntry(field(entry, "category", locale), includes), locale),
    tags: asStringArray(field(entry, "tags", locale)),
    publishedAt,
    updatedAt: asString(field(entry, "updatedAt", locale)) || entry.sys.updatedAt || publishedAt,
    readingTime:
      typeof declaredReadingTime === "number" && declaredReadingTime > 0
        ? declaredReadingTime
        : estimateReadingTime(body),
    seoTitle: asString(field(entry, "seoTitle", locale)),
    seoDescription: asString(field(entry, "seoDescription", locale)),
  };
}

export function toBlogPostSummary(post: BlogPost): BlogPostSummary {
  const { body: _body, seoTitle: _seoTitle, seoDescription: _seoDescription, ...summary } = post;
  return summary;
}

/** Entradas traduzidas viram resumos publicáveis, do mais recente ao mais antigo. */
function summarize(
  entries: ContentfulResource[],
  includes: Includes,
  locale: string,
): BlogPostSummary[] {
  return entries
    .filter((entry) => hasTranslation(entry, locale))
    .map((entry) => toBlogPostSummary(mapPost(entry, includes, locale)))
    .filter((post) => post.slug && post.title)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/**
 * Busca com `locale=*` de propósito: é a única forma de distinguir "traduzido"
 * de "caiu no idioma padrão". Também evita um segundo round-trip ao resolver o
 * slug localizado quando o leitor troca de idioma no meio de um post.
 */
const fetchPublishedPosts = cache(async function fetchPublishedPosts(): Promise<{
  entries: ContentfulResource[];
  includes: Includes;
}> {
  const { space, accessToken, environment } = getDeliveryConfig();
  const params = new URLSearchParams({
    access_token: accessToken,
    content_type: "blogPost",
    include: "2",
    locale: "*",
    limit: String(MAX_POSTS),
  });

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries?${params}`,
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["blog"] } },
  );

  if (!response.ok) {
    throw new Error(`Contentful Delivery API request failed: ${response.status}`);
  }

  const collection = (await response.json()) as ContentfulCollection;

  return {
    entries: collection.items.filter(
      (entry) => asString(field(entry, "status", SPACE_DEFAULT_LOCALE)) === "published",
    ),
    includes: buildIncludes(collection),
  };
});

export const getBlogPosts = cache(async function getBlogPosts(
  locale: LocaleKey,
): Promise<BlogPostSummary[]> {
  const contentfulLocale = contentfulLocaleByAppLocale[locale];
  const { entries, includes } = await fetchPublishedPosts();

  return summarize(entries, includes, contentfulLocale);
})

export type BlogPostWithRelated = {
  post: BlogPost;
  /** Demais posts publicados no idioma, já ordenados do mais recente ao mais antigo. */
  siblings: BlogPostSummary[];
};

export const getBlogPost = cache(async function getBlogPost(
  locale: LocaleKey,
  slug: string,
): Promise<BlogPostWithRelated | null> {
  const contentfulLocale = contentfulLocaleByAppLocale[locale];
  const { entries, includes } = await fetchPublishedPosts();

  // O slug é localizado, então um link compartilhado em PT precisa continuar
  // resolvendo quando o leitor está em EN — a página redireciona depois.
  const match = entries.find((entry) =>
    Object.values(entry.fields.slug ?? {}).some((value) => value === slug),
  );

  // `null` significa "não existe um post assim neste idioma", e só isso: uma
  // falha de rede sobe como exceção, para não virar um 404 enganoso.
  if (!match || !hasTranslation(match, contentfulLocale)) {
    return null;
  }

  return {
    post: mapPost(match, includes, contentfulLocale),
    siblings: summarize(entries, includes, contentfulLocale).filter(
      (post) => post.id !== match.sys.id,
    ),
  };
})
