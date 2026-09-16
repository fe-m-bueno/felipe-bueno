import Image from "next/image";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Block,
  type Document,
  type Inline,
} from "@contentful/rich-text-types";
import type { ReactNode } from "react";
import { normalizeAssetUrl } from "@/lib/contentfulContent";
import { createHeadingIdAllocator, headingText } from "@/lib/richText";

type EntryTarget = {
  sys?: { id?: string };
  fields?: { slug?: string; title?: string };
};

type AssetTarget = {
  sys?: { id?: string };
  fields?: {
    title?: string;
    description?: string;
    file?: { url?: string; contentType?: string; details?: { image?: { width: number; height: number } } };
  };
};

const LINK_CLASS =
  "text-rose-600 underline underline-offset-2 transition-colors hover:text-rose-500 dark:text-rose-300";

export default function RichText({ document }: { document: Document | null }) {
  if (!document) return null;

  const allocate = createHeadingIdAllocator();

  // `extractHeadings` pula headings vazios sem gastar um slot; o corpo precisa
  // pular igual, senão os sufixos de desempate saem defasados do sumário.
  function anchorFor(node: unknown): string | undefined {
    const text = headingText(node);
    return text ? allocate(text) : undefined;
  }

  return (
    <>
      {documentToReactComponents(document, {
        renderMark: {
          [MARKS.BOLD]: (text: ReactNode) => <strong className="font-semibold">{text}</strong>,
          [MARKS.ITALIC]: (text: ReactNode) => <em>{text}</em>,
          [MARKS.CODE]: (text: ReactNode) => (
            <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10">
              {text}
            </code>
          ),
        },
        renderNode: {
          [BLOCKS.HEADING_2]: (node, children) => (
            <h2
              id={anchorFor(node)}
              className="mt-12 scroll-mt-28 font-space-grotesk ~text-2xl/3xl font-bold leading-snug"
            >
              {children}
            </h2>
          ),
          [BLOCKS.HEADING_3]: (node, children) => (
            <h3
              id={anchorFor(node)}
              className="mt-8 scroll-mt-28 font-space-grotesk text-xl font-bold leading-snug"
            >
              {children}
            </h3>
          ),
          [BLOCKS.HEADING_4]: (_node, children) => (
            <h4 className="mt-6 font-space-grotesk text-lg font-bold leading-snug">{children}</h4>
          ),
          [BLOCKS.PARAGRAPH]: (_node, children) => (
            <p className="mt-5 leading-[1.75] text-gray-700 dark:text-gray-300">{children}</p>
          ),
          [BLOCKS.UL_LIST]: (_node, children) => (
            <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-rose-500">{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (_node, children) => (
            <ol className="mt-5 list-decimal space-y-2 pl-5 marker:font-mono marker:text-rose-500">
              {children}
            </ol>
          ),
          [BLOCKS.LIST_ITEM]: (_node, children) => (
            <li className="leading-[1.75] text-gray-700 [&>p]:mt-0 dark:text-gray-300">
              {children}
            </li>
          ),
          [BLOCKS.QUOTE]: (_node, children) => (
            <blockquote className="my-8 border-l-2 border-rose-500 pl-5 font-space-grotesk text-lg italic leading-relaxed text-gray-800 [&>p]:mt-0 dark:text-gray-200">
              {children}
            </blockquote>
          ),
          [BLOCKS.HR]: () => <hr className="my-10 border-black/10 dark:border-white/10" />,
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const target = (node as Block).data.target as AssetTarget | undefined;
            const file = target?.fields?.file;
            const url = normalizeAssetUrl(file?.url);
            if (!url) return null;

            const image = file?.details?.image;

            return (
              <figure className="my-8">
                <Image
                  src={url}
                  alt={target?.fields?.description || target?.fields?.title || ""}
                  width={image?.width ?? 1200}
                  height={image?.height ?? 675}
                  className="w-full rounded-xl"
                />
                {target?.fields?.description && (
                  <figcaption className="mt-2 text-center font-mono text-[11px] text-gray-500 dark:text-gray-400">
                    {target.fields.description}
                  </figcaption>
                )}
              </figure>
            );
          },
          [INLINES.HYPERLINK]: (node, children) => {
            const uri = String((node as Inline).data.uri ?? "");
            const external = /^https?:\/\//.test(uri);

            return (
              <Link
                href={uri}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={LINK_CLASS}
              >
                {children}
              </Link>
            );
          },
          [INLINES.ENTRY_HYPERLINK]: (node, children) => {
            const target = (node as Inline).data.target as EntryTarget | undefined;
            const slug = target?.fields?.slug;
            if (!slug) return <>{children}</>;

            return (
              <Link href={`/words/${slug}`} className={LINK_CLASS}>
                {children}
              </Link>
            );
          },
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const target = (node as Block).data.target as EntryTarget | undefined;
            const slug = target?.fields?.slug;
            const title = target?.fields?.title;
            if (!slug || !title) return null;

            return (
              <p className="my-7">
                <Link href={`/words/${slug}`} className={LINK_CLASS}>
                  {title}
                </Link>
              </p>
            );
          },
          [INLINES.EMBEDDED_ENTRY]: (node) => {
            const target = (node as Inline).data.target as EntryTarget | undefined;
            const slug = target?.fields?.slug;
            const title = target?.fields?.title;
            if (!slug || !title) return null;

            return (
              <Link href={`/words/${slug}`} className={LINK_CLASS}>
                {title}
              </Link>
            );
          },
          [INLINES.ASSET_HYPERLINK]: (node, children) => {
            const target = (node as Inline).data.target as AssetTarget | undefined;
            const url = normalizeAssetUrl(target?.fields?.file?.url);
            if (!url) return <>{children}</>;

            return (
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                {children}
              </Link>
            );
          },
        },
      })}
    </>
  );
}
