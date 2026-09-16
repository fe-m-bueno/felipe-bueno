import type { Metadata } from "next";
import WordsList from "@/components/blog/WordsList";
import { getBlogPosts } from "@/lib/blogContent";
import { getServerLocale } from "@/lib/serverLocale";
import enTranslation from "@/locales/en/translation.json";
import ptTranslation from "@/locales/pt/translation.json";

/**
 * O título e a chamada da página saem das mesmas chaves que a própria página
 * renderiza, para não divergirem. Diferente do corpo, os metadados não veem os
 * overrides de `uiCopy` do Contentful: eles são resolvidos no i18next, que é
 * client-side.
 */
const TRANSLATION = { en: enTranslation, pt: ptTranslation } as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const { title, subtitle } = TRANSLATION[locale].words;
  const pageTitle = `${title} | Felipe Bueno`;

  return {
    title: pageTitle,
    description: subtitle,
    alternates: { canonical: "/words" },
    openGraph: {
      title: pageTitle,
      description: subtitle,
      type: "website",
      url: "/words",
    },
    // Sem isto a rota herda o card do portfólio definido no layout raiz.
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: subtitle,
    },
  };
}

export default async function WordsPage() {
  const locale = await getServerLocale();
  const posts = await getBlogPosts(locale);

  return <WordsList posts={posts} locale={locale} />;
}
