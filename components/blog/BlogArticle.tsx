"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Badge from "@/components/Badge";
import LiquidGlass from "@/components/LiquidGlass";
import ScrollReveal from "@/components/ScrollReveal";
import MetaBadge from "@/components/blog/MetaBadge";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import { formatBlogDate } from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/blogContent";
import { haptic } from "@/lib/haptic";
import type { LocaleKey } from "@/lib/locale";
import type { RichHeading } from "@/lib/richText";

/**
 * Deriva a seção ativa da posição dos headings, não de quem está intersectando:
 * ao subir para uma seção longa, ou num salto de âncora, um observer deixaria a
 * seção anterior marcada até o heading de cima reaparecer.
 */
function useActiveHeading(headings: RichHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;

    function update() {
      frame = 0;
      // Linha de leitura no primeiro quarto da tela.
      const readingLine = window.innerHeight * 0.25;
      let current = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = heading.id;
        }
      }

      // Mesmo valor não re-renderiza: o React descarta o update.
      setActiveId(current);
    }

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  return activeId;
}

export default function BlogArticle({
  post,
  headings,
  recommendations,
  locale,
  children,
}: {
  post: BlogPostSummary;
  /** Extraídos no servidor, junto com o corpo, para ficarem estáveis entre renders. */
  headings: RichHeading[];
  recommendations: BlogPostSummary[];
  locale: LocaleKey;
  /** O corpo do post, já renderizado no servidor. */
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const activeId = useActiveHeading(headings);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <main className="pb-24 pt-24">
      <ReadingProgressBar targetRef={bodyRef} />

      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <Link
          href="/words"
          onClick={() => haptic()}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-500 hover:underline"
        >
          ← {t("words.title")}
        </Link>

        <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <article ref={bodyRef} className="reading-surface min-w-0 p-5 sm:p-8 lg:p-10">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                {post.category && <MetaBadge>{post.category.title}</MetaBadge>}
                <span className="font-mono text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <time dateTime={post.publishedAt}>
                    {formatBlogDate(post.publishedAt, locale)}
                  </time>{" "}
                  · {t("words.minutes", { count: post.readingTime })}
                </span>
              </div>
              <h1 className="mt-4 font-space-grotesk ~text-3xl/5xl font-bold leading-[1.1]">
                {post.title}
              </h1>
              <p className="mt-4 ~text-base/lg leading-relaxed text-gray-700 dark:text-gray-300">
                {post.excerpt}
              </p>
            </header>

            {post.coverImage && (
              <div className="mt-7 h-56 w-full overflow-hidden rounded-xl sm:h-80">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  width={1200}
                  height={675}
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mt-2">{children}</div>

            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-black/10 pt-6 dark:border-white/10">
                {post.tags.map((tag) => (
                  <Badge key={tag} name={`#${tag}`} />
                ))}
              </div>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="reading-surface sticky top-24 p-4">
              {headings.length > 0 && (
                <nav aria-label={t("words.inThisPost")} className="max-h-[60vh] overflow-y-auto">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    {t("words.inThisPost")}
                  </p>
                  <ul className="space-y-1 border-l border-black/10 dark:border-white/10">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          aria-current={activeId === heading.id ? "location" : undefined}
                          className={`-ml-px block border-l-2 py-1 text-sm transition ${
                            heading.level === 3 ? "pl-6" : "pl-4"
                          } ${
                            activeId === heading.id
                              ? "border-rose-500 text-rose-600 dark:text-rose-300"
                              : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                          }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div
                className={`flex items-center gap-2.5 ${
                  headings.length > 0
                    ? "mt-6 border-t border-black/10 pt-4 dark:border-white/10"
                    : ""
                }`}
              >
                <Image
                  src="/felipe-bueno.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="font-mono text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Felipe Bueno
                </p>
              </div>
            </div>
          </aside>
        </div>

        {recommendations.length > 0 && (
          <ScrollReveal delay={100}>
            <section className="mt-16">
              <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                {t("words.continueReading")}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {recommendations.map((item) => (
                  <Link
                    key={item.id}
                    href={`/words/${item.slug}`}
                    onClick={() => haptic()}
                    className="group"
                  >
                    <LiquidGlass
                      variant="card"
                      glowBorderRadius={12}
                      className="flex h-full flex-col rounded-xl p-2 transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1"
                    >
                      {item.coverImage && (
                        <div className="h-36 w-full shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.coverImage}
                            alt=""
                            width={600}
                            height={340}
                            sizes="(max-width: 640px) 100vw, 340px"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-3">
                        <h3 className="font-space-grotesk text-base font-bold leading-snug transition-colors group-hover:text-rose-500">
                          {item.title}
                        </h3>
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                          {item.category && <MetaBadge>{item.category.title}</MetaBadge>}
                          <span className="font-mono text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {t("words.minutes", { count: item.readingTime })}
                          </span>
                        </div>
                      </div>
                    </LiquidGlass>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
