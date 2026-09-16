import { BLOCKS, type Document, type Node } from "@contentful/rich-text-types";

export type RichHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const WORDS_PER_MINUTE = 200;

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isNodeWithContent(node: unknown): node is Node & { content: Node[] } {
  return Boolean(node) && Array.isArray((node as { content?: unknown }).content);
}

export function nodeToText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const value = (node as { value?: unknown }).value;
  if (typeof value === "string") return value;

  if (isNodeWithContent(node)) {
    return node.content.map(nodeToText).join("");
  }

  return "";
}

/**
 * `nodeToText` concatena sem separador, que é o certo para nós inline dentro de
 * um parágrafo mas cola palavras entre blocos — uma lista de 200 itens viraria
 * uma palavra só na contagem. Aqui blocos são separados por espaço.
 */
function blockText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const value = (node as { value?: unknown }).value;
  if (typeof value === "string") return value;

  if (!isNodeWithContent(node)) return "";

  const hasNestedBlocks = node.content.some((child) => child.nodeType !== "text");
  return node.content.map(blockText).join(hasNestedBlocks ? " " : "");
}

export function richTextToPlainText(document: Document | null | undefined): string {
  if (!document) return "";
  return document.content.map(blockText).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * O texto que vira âncora. Tanto o sumário quanto o corpo passam por aqui: um
 * heading vazio não consome um slot do alocador em lado nenhum, e é isso que
 * mantém `#setup-2` no sumário apontando para o `id="setup-2"` do corpo.
 */
export function headingText(node: unknown): string {
  return nodeToText(node).trim();
}

/**
 * Anchors have to agree between the table of contents and the rendered body,
 * so both sides allocate ids through this — including the suffix that keeps
 * two headings with the same text from colliding.
 */
export function createHeadingIdAllocator() {
  const used = new Set<string>();

  return function allocate(text: string): string {
    const base = slugifyHeading(text) || "secao";

    // O sufixo avança até achar um id livre: um heading "Setup 2" já pode ter
    // ocupado o "setup-2" que o segundo "Setup" pediria.
    let candidate = base;
    let suffix = 1;
    while (used.has(candidate)) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }

    used.add(candidate);
    return candidate;
  };
}

/**
 * Headings that get an anchor and show up in the table of contents.
 * H4 is deliberately left out — it exists in the model for structure inside a
 * section, not for navigation.
 */
export function extractHeadings(document: Document | null | undefined): RichHeading[] {
  if (!document) return [];

  const headings: RichHeading[] = [];
  const allocate = createHeadingIdAllocator();

  for (const node of document.content) {
    const level =
      node.nodeType === BLOCKS.HEADING_2 ? 2 : node.nodeType === BLOCKS.HEADING_3 ? 3 : null;
    if (!level) continue;

    const text = headingText(node);
    if (!text) continue;

    headings.push({ id: allocate(text), text, level });
  }

  return headings;
}

export function estimateReadingTime(document: Document | null | undefined): number {
  const words = richTextToPlainText(document).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
