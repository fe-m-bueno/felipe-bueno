import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogArticle from "@/components/blog/BlogArticle";
import RichText from "@/components/blog/RichText";
import { getRecommendedPosts } from "@/lib/blog";
import { getBlogPost, toBlogPostSummary } from "@/lib/blogContent";
import { getServerLocale } from "@/lib/serverLocale";
import { extractHeadings } from "@/lib/richText";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const data = await getBlogPost(locale, decodeURIComponent(slug));

  if (!data) {
    return { title: "Felipe Bueno" };
  }

  const { post } = data;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title: `${title} | Felipe Bueno`,
    description,
    // O slug é localizado, então o canônico aponta para o slug do idioma atual.
    alternates: { canonical: `/words/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/words/${post.slug}`,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.coverImageAlt || title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function WordsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const requestedSlug = decodeURIComponent(slug);
  const locale = await getServerLocale();
  const data = await getBlogPost(locale, requestedSlug);

  if (!data) {
    notFound();
  }

  // Um link em português continua resolvendo em inglês e vice-versa; a URL é
  // então corrigida para o slug do idioma que está sendo lido.
  if (data.post.slug && data.post.slug !== requestedSlug) {
    redirect(`/words/${data.post.slug}`);
  }

  // O corpo é renderizado aqui, no servidor: o Document do Contentful é o maior
  // objeto da página e não precisa atravessar para o cliente, nem o renderer
  // de Rich Text precisa entrar no bundle.
  return (
    <BlogArticle
      post={toBlogPostSummary(data.post)}
      headings={extractHeadings(data.post.body)}
      recommendations={getRecommendedPosts(data.siblings, data.post)}
      locale={locale}
    >
      <RichText document={data.post.body} />
    </BlogArticle>
  );
}
