import { describe, it, expect } from 'vitest';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import {
  createHeadingIdAllocator,
  estimateReadingTime,
  extractHeadings,
  richTextToPlainText,
  slugifyHeading,
} from '@/lib/richText';

function text(value: string) {
  return { nodeType: 'text', value, marks: [], data: {} };
}

function block(nodeType: string, value: string) {
  return { nodeType, content: [text(value)], data: {} };
}

function doc(content: unknown[]): Document {
  return { nodeType: BLOCKS.DOCUMENT, data: {}, content } as unknown as Document;
}

describe('slugifyHeading', () => {
  it('strips accents, case and punctuation', () => {
    expect(slugifyHeading('O que medir depois?')).toBe('o-que-medir-depois');
    expect(slugifyHeading('Validação na fronteira')).toBe('validacao-na-fronteira');
  });

  it('does not leave dangling separators', () => {
    expect(slugifyHeading('  Falhe cedo, falhe alto  ')).toBe('falhe-cedo-falhe-alto');
  });
});

describe('createHeadingIdAllocator', () => {
  it('suffixes repeated headings so anchors stay unique', () => {
    const allocate = createHeadingIdAllocator();
    expect(allocate('Setup')).toBe('setup');
    expect(allocate('Setup')).toBe('setup-2');
    expect(allocate('Setup')).toBe('setup-3');
  });

  it('gives a heading with no sluggable characters a usable id', () => {
    expect(createHeadingIdAllocator()('???')).toBe('secao');
  });

  it('skips past an id a natural slug already took', () => {
    const allocate = createHeadingIdAllocator();
    // "Setup 2" slugifies to setup-2, which is what the second "Setup" wants.
    expect(allocate('Setup')).toBe('setup');
    expect(allocate('Setup 2')).toBe('setup-2');
    expect(allocate('Setup')).toBe('setup-3');
  });

  it('never hands out the same id twice', () => {
    const allocate = createHeadingIdAllocator();
    const ids = ['Setup', 'Setup 2', 'Setup', 'Setup 3', 'Setup', 'Setup'].map(allocate);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('extractHeadings', () => {
  const document = doc([
    block(BLOCKS.PARAGRAPH, 'Intro'),
    block(BLOCKS.HEADING_2, 'O problema'),
    block(BLOCKS.HEADING_3, 'Falhe cedo'),
    block(BLOCKS.HEADING_4, 'Detalhe'),
    block(BLOCKS.HEADING_2, 'O problema'),
  ]);

  it('collects only h2 and h3, in document order', () => {
    expect(extractHeadings(document)).toEqual([
      { id: 'o-problema', text: 'O problema', level: 2 },
      { id: 'falhe-cedo', text: 'Falhe cedo', level: 3 },
      { id: 'o-problema-2', text: 'O problema', level: 2 },
    ]);
  });

  it('allocates the same ids the renderer would', () => {
    const allocate = createHeadingIdAllocator();
    expect(extractHeadings(document).map((h) => h.id)).toEqual(
      ['O problema', 'Falhe cedo', 'O problema'].map(allocate),
    );
  });

  it('skips empty headings and handles a missing document', () => {
    expect(extractHeadings(doc([block(BLOCKS.HEADING_2, '   ')]))).toEqual([]);
    expect(extractHeadings(null)).toEqual([]);
  });
});

describe('richTextToPlainText', () => {
  it('separates blocks, so list items do not run into one word', () => {
    const nested = doc([
      {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: [
          { nodeType: BLOCKS.LIST_ITEM, data: {}, content: [block(BLOCKS.PARAGRAPH, 'um')] },
          { nodeType: BLOCKS.LIST_ITEM, data: {}, content: [block(BLOCKS.PARAGRAPH, 'dois')] },
        ],
      },
    ]);
    expect(richTextToPlainText(nested)).toBe('um dois');
  });

  it('keeps inline runs inside a paragraph glued together', () => {
    const split = doc([
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'infra', marks: [], data: {} },
          { nodeType: 'text', value: 'estrutura', marks: [], data: {} },
        ],
      },
    ]);
    expect(richTextToPlainText(split)).toBe('infraestrutura');
  });

  it('returns an empty string for a missing document', () => {
    expect(richTextToPlainText(null)).toBe('');
  });
});

describe('estimateReadingTime', () => {
  it('rounds up to whole minutes at 200 words per minute', () => {
    expect(estimateReadingTime(doc([block(BLOCKS.PARAGRAPH, 'palavra '.repeat(400).trim())]))).toBe(2);
    expect(estimateReadingTime(doc([block(BLOCKS.PARAGRAPH, 'palavra '.repeat(201).trim())]))).toBe(2);
  });

  it('counts list items as separate words', () => {
    const list = doc([
      {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: Array.from({ length: 201 }, () => ({
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: [block(BLOCKS.PARAGRAPH, 'palavra')],
        })),
      },
    ]);
    expect(estimateReadingTime(list)).toBe(2);
  });

  it('never reports less than a minute, even for an empty post', () => {
    expect(estimateReadingTime(doc([]))).toBe(1);
    expect(estimateReadingTime(null)).toBe(1);
  });
});
