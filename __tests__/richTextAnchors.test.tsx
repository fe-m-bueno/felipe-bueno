import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import RichText from '@/components/blog/RichText';
import { extractHeadings } from '@/lib/richText';

function heading(value: string) {
  return {
    nodeType: BLOCKS.HEADING_2,
    data: {},
    content: [{ nodeType: 'text', value, marks: [], data: {} }],
  };
}

function doc(content: unknown[]): Document {
  return { nodeType: BLOCKS.DOCUMENT, data: {}, content } as unknown as Document;
}

/**
 * O sumário e o corpo alocam ids por caminhos diferentes (extractHeadings x o
 * renderer). Se um dos dois contar um heading que o outro ignora, os sufixos de
 * desempate saem defasados e os links do sumário passam a rolar para a seção
 * errada — sem erro nenhum. Estes testes prendem os dois lados juntos.
 */
describe('table of contents anchors match the rendered body', () => {
  function renderedHeadingIds(document: Document) {
    const { container } = render(<RichText document={document} />);
    return [...container.querySelectorAll('h2, h3')].map((el) => el.id);
  }

  it('agrees on a plain document', () => {
    const document = doc([heading('O problema'), heading('O que medir')]);
    expect(renderedHeadingIds(document)).toEqual(extractHeadings(document).map((h) => h.id));
  });

  it('agrees when a heading repeats and needs a suffix', () => {
    const document = doc([heading('Setup'), heading('Setup'), heading('Setup')]);
    expect(renderedHeadingIds(document)).toEqual(['setup', 'setup-2', 'setup-3']);
    expect(renderedHeadingIds(document)).toEqual(extractHeadings(document).map((h) => h.id));
  });

  it('agrees when an empty heading sits between two repeated ones', () => {
    const document = doc([heading('Setup'), heading('   '), heading('Setup')]);

    // O heading vazio não entra no sumário, então também não pode consumir um
    // slot do alocador no corpo.
    expect(extractHeadings(document).map((h) => h.id)).toEqual(['setup', 'setup-2']);
    expect(renderedHeadingIds(document).filter(Boolean)).toEqual(['setup', 'setup-2']);
  });
});
