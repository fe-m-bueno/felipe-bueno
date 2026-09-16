"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import MetaBadge from "@/components/blog/MetaBadge";
import { haptic } from "@/lib/haptic";
import {
  BLOG_SORT_KEYS,
  DEFAULT_BLOG_SORT,
  filterAndSortPosts,
  formatBlogDate,
  type BlogSortKey,
} from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/blogContent";
import type { LocaleKey } from "@/lib/locale";

const SORT_LABEL_KEYS: Record<BlogSortKey, string> = {
  recent: "words.sortRecent",
  oldest: "words.sortOldest",
  shortest: "words.sortShortest",
  title: "words.sortTitle",
};

export default function WordsList({
  posts,
  locale,
}: {
  posts: BlogPostSummary[];
  locale: LocaleKey;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<BlogSortKey>(DEFAULT_BLOG_SORT);

  const visiblePosts = useMemo(
    () => filterAndSortPosts(posts, query, sort, locale),
    [posts, query, sort, locale],
  );

  // Agrupar por ano só faz sentido em ordenação cronológica.
  const groups = useMemo(() => {
    if (sort !== "recent" && sort !== "oldest") {
      return [{ label: t(SORT_LABEL_KEYS[sort]), posts: visiblePosts }];
    }

    const byYear = new Map<string, BlogPostSummary[]>();
    for (const post of visiblePosts) {
      const year = String(new Date(post.publishedAt).getUTCFullYear());
      const bucket = byYear.get(year);
      if (bucket) bucket.push(post);
      else byYear.set(year, [post]);
    }
    return [...byYear.entries()].map(([label, items]) => ({ label, posts: items }));
  }, [sort, t, visiblePosts]);

  const totalMinutes = visiblePosts.reduce((total, post) => total + post.readingTime, 0);
  const hasPosts = posts.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:px-8">
      <header className="mb-8 max-w-xl">
        <h1 className="font-space-grotesk ~text-4xl/6xl font-bold leading-[1.05]">
          {t("words.title")}
        </h1>
        <p className="mt-3 text-gray-700 dark:text-gray-300">{t("words.subtitle")}</p>
      </header>

      <div
        className={`grid grid-cols-1 gap-8 lg:gap-10 ${
          // Sem posts não há busca, e reservar a coluna do trilho deixaria
          // 17rem mortos ao lado do placeholder.
          hasPosts ? "lg:grid-cols-[minmax(0,1fr)_17rem]" : ""
        }`}
      >
        <aside
          hidden={!hasPosts}
          className="lg:order-2 lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="reading-surface p-5">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                {t("words.search")}
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("words.searchPlaceholder")}
                className="w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-base outline-none transition focus:border-rose-500 dark:border-white/15 dark:bg-white/5 sm:text-sm"
              />
            </label>

            <nav className="mt-5" aria-label={t("words.sort")}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                {t("words.sort")}
              </p>
              <ul className="space-y-0.5">
                {BLOG_SORT_KEYS.map((key) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => {
                        haptic();
                        setSort(key);
                      }}
                      aria-pressed={sort === key}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
                        sort === key
                          ? "bg-rose-500/10 font-medium text-rose-600 dark:text-rose-300"
                          : "text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${
                          sort === key ? "bg-rose-500" : "bg-transparent"
                        }`}
                      />
                      {t(SORT_LABEL_KEYS[key])}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <dl className="mt-5 border-t border-black/10 pt-4 font-mono text-[11px] uppercase tracking-wide text-gray-500 dark:border-white/10 dark:text-gray-400">
              <div className="flex justify-between py-0.5">
                <dt>{t("words.posts")}</dt>
                <dd className="text-rose-500">{visiblePosts.length}</dd>
              </div>
              <div className="flex justify-between py-0.5">
                <dt>{t("words.totalReading")}</dt>
                <dd className="text-rose-500">{t("words.minutes", { count: totalMinutes })}</dd>
              </div>
            </dl>

            <p aria-live="polite" className="sr-only">
              {t("words.resultsStatus", { count: visiblePosts.length })}
            </p>
          </div>
        </aside>
        <div className="min-w-0 lg:order-1">
          {visiblePosts.length === 0 ? (
            <div className="reading-surface px-6 py-16 text-center text-gray-600 dark:text-gray-400">
              {!hasPosts ? (
                <p>{t("words.emptyAll")}</p>
              ) : (
                <>
                  <p>{t("words.empty", { query })}</p>
                  <button
                    type="button"
                    onClick={() => {
                      haptic();
                      setQuery("");
                    }}
                    className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
                  >
                    {t("words.clearSearch")}
                  </button>
                </>
              )}
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.label} className="mb-8">
                <h2 className="mb-2 pl-1 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                  {group.label}
                </h2>

                <div className="reading-surface px-4 sm:px-6">
                  <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                    {group.posts.map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/words/${post.slug}`}
                          onClick={() => haptic()}
                          className="group flex items-center gap-5 py-6"
                        >
                          {post.coverImage && (
                            <div className="hidden h-24 w-36 shrink-0 self-center overflow-hidden rounded-lg sm:block">
                              <Image
                                src={post.coverImage}
                                alt=""
                                width={400}
                                height={300}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.05]"
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="font-space-grotesk ~text-lg/xl font-bold leading-snug transition-colors group-hover:text-rose-500">
                              {post.title}
                            </h3>
                            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {post.excerpt}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                              <time
                                dateTime={post.publishedAt}
                                className="font-mono text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400"
                              >
                                {formatBlogDate(post.publishedAt, locale)}
                              </time>
                              {post.category && <MetaBadge>{post.category.title}</MetaBadge>}
                              <span className="font-mono text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {t("words.minutes", { count: post.readingTime })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
