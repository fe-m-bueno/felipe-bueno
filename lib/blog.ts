import type { BlogPostSummary } from "@/lib/blogContent";
import { BCP47_BY_LOCALE, DEFAULT_LOCALE, type LocaleKey } from "@/lib/locale";

export type BlogSortKey = "recent" | "oldest" | "shortest" | "title";

export const BLOG_SORT_KEYS: BlogSortKey[] = ["recent", "oldest", "shortest", "title"];

export const DEFAULT_BLOG_SORT: BlogSortKey = "recent";

function searchableText(post: BlogPostSummary): string {
  return [post.title, post.excerpt, post.category?.title ?? "", ...post.tags]
    .join(" ")
    .toLowerCase();
}

export function filterAndSortPosts<T extends BlogPostSummary>(
  posts: T[],
  query: string,
  sort: BlogSortKey,
  locale: LocaleKey = DEFAULT_LOCALE,
): T[] {
  const term = query.trim().toLowerCase();
  const filtered = term ? posts.filter((post) => searchableText(post).includes(term)) : posts;
  const sorted = [...filtered];

  switch (sort) {
    case "oldest":
      sorted.sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt));
      break;
    case "shortest":
      sorted.sort((a, b) => a.readingTime - b.readingTime);
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title, BCP47_BY_LOCALE[locale]));
      break;
    default:
      sorted.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  }

  return sorted;
}

const SAME_CATEGORY_WEIGHT = 3;

/**
 * Score ponderado: categoria em comum vale 3, cada tag compartilhada vale 1 —
 * então categoria ganha de até duas tags, e não é uma precedência absoluta.
 * Empate desempata pelo mais recente. Posts sem nenhuma relação continuam
 * elegíveis, então o bloco nunca aparece com menos de `limit` cards enquanto
 * houver outros posts publicados.
 */
export function getRecommendedPosts<T extends BlogPostSummary>(
  posts: T[],
  current: Pick<BlogPostSummary, "id" | "category" | "tags">,
  limit = 3,
): T[] {
  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const sameCategory =
        post.category && current.category && post.category.id === current.category.id
          ? SAME_CATEGORY_WEIGHT
          : 0;
      const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
      return { post, score: sameCategory + sharedTags };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt);
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}

export function formatBlogDate(iso: string, locale: LocaleKey): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(BCP47_BY_LOCALE[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
