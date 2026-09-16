import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BLOCKS } from '@contentful/rich-text-types';

const EN = 'en-US';
const PT = 'pt-BR';

/** Um campo localizado, como a Delivery API devolve com `locale=*`. */
function loc(values: Record<string, unknown>) {
  return values;
}

function assetLink(id: string) {
  return { sys: { type: 'Link', linkType: 'Asset', id } };
}

function entryLink(id: string) {
  return { sys: { type: 'Link', linkType: 'Entry', id } };
}

function text(value: string) {
  return { nodeType: 'text', value, marks: [], data: {} };
}

function body(content: unknown[]) {
  return { nodeType: BLOCKS.DOCUMENT, data: {}, content };
}

const coverAsset = {
  sys: { id: 'asset-cover', type: 'Asset' },
  fields: {
    title: loc({ [EN]: 'Cover' }),
    description: loc({ [EN]: 'A cover' }),
    file: loc({ [EN]: { url: '//images.ctfassets.net/x/cover.webp' } }),
  },
};

const category = {
  sys: { id: 'cat-backend', type: 'Entry' },
  fields: {
    title: loc({ [EN]: 'Backend', [PT]: 'Backend' }),
    slug: loc({ [EN]: 'backend', [PT]: 'backend' }),
  },
};

function post(overrides: Record<string, unknown> = {}) {
  return {
    sys: { id: 'post-1', type: 'Entry', createdAt: '2026-01-01T00:00:00.000Z' },
    fields: {
      title: loc({ [EN]: 'Indexes', [PT]: 'Índices' }),
      slug: loc({ [EN]: 'indexes', [PT]: 'indices' }),
      excerpt: loc({ [EN]: 'On indexes', [PT]: 'Sobre índices' }),
      body: loc({
        [EN]: body([
          { nodeType: BLOCKS.EMBEDDED_ASSET, data: { target: assetLink('asset-cover') }, content: [] },
        ]),
        [PT]: body([
          { nodeType: BLOCKS.PARAGRAPH, data: {}, content: [text('Sobre índices')] },
        ]),
      }),
      // Campos não localizados vêm só sob o locale padrão do espaço.
      status: loc({ [EN]: 'published' }),
      coverImage: loc({ [EN]: assetLink('asset-cover') }),
      category: loc({ [EN]: entryLink('cat-backend') }),
      publishedAt: loc({ [EN]: '2026-07-19T00:00:00.000Z' }),
      tags: loc({ [EN]: ['SQL'], [PT]: ['SQL'] }),
      ...overrides,
    },
  };
}

function collection(items: unknown[]) {
  return {
    items,
    includes: { Entry: [category], Asset: [coverAsset] },
  };
}

function mockFetch(payload: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  });
}

async function loadModule() {
  vi.resetModules();
  return import('@/lib/blogContent');
}

describe('blog content from Contentful', () => {
  beforeEach(() => {
    process.env.CONTENTFUL_SPACE_ID = 'space';
    process.env.CONTENTFUL_DELIVERY_TOKEN = 'token';
    process.env.CONTENTFUL_ENVIRONMENT_ID = 'master';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves cover image, category and non-localized fields', async () => {
    vi.stubGlobal('fetch', mockFetch(collection([post()])));
    const { getBlogPosts } = await loadModule();

    const [entry] = await getBlogPosts('en');
    expect(entry.coverImage).toBe('https://images.ctfassets.net/x/cover.webp');
    expect(entry.category).toEqual({ id: 'cat-backend', title: 'Backend', slug: 'backend' });
    expect(entry.publishedAt).toBe('2026-07-19T00:00:00.000Z');
    expect(entry.tags).toEqual(['SQL']);
  });

  it('resolves assets embedded in the body, not just top-level fields', async () => {
    vi.stubGlobal('fetch', mockFetch(collection([post()])));
    const { getBlogPost } = await loadModule();

    const result = await getBlogPost('en', 'indexes');
    const embedded = result!.post.body!.content[0] as unknown as {
      data: { target: { fields?: { file?: { url?: string } } } };
    };

    // Sem resolver, o target continuaria um Link e a imagem sumiria do post.
    expect(embedded.data.target.fields?.file?.url).toBe('//images.ctfassets.net/x/cover.webp');
  });

  it('hides a post that is not translated into the requested locale', async () => {
    const untranslated = post({
      title: loc({ [EN]: 'Only English' }),
      slug: loc({ [EN]: 'only-english' }),
      excerpt: loc({ [EN]: 'Only English' }),
      body: loc({ [EN]: body([]) }),
    });
    vi.stubGlobal('fetch', mockFetch(collection([untranslated])));
    const { getBlogPosts } = await loadModule();

    expect(await getBlogPosts('en')).toHaveLength(1);
    expect(await getBlogPosts('pt')).toHaveLength(0);
  });

  it('resolves a post by its slug in any locale, so shared links keep working', async () => {
    vi.stubGlobal('fetch', mockFetch(collection([post()])));
    const { getBlogPost } = await loadModule();

    // Link em português aberto por um leitor em inglês.
    const result = await getBlogPost('en', 'indices');
    expect(result?.post.slug).toBe('indexes');
  });

  it('leaves out entries that are not published', async () => {
    const draft = post({ status: loc({ [EN]: 'draft' }) });
    vi.stubGlobal('fetch', mockFetch(collection([draft])));
    const { getBlogPosts } = await loadModule();

    expect(await getBlogPosts('en')).toEqual([]);
  });

  it('returns null for a slug that does not exist', async () => {
    vi.stubGlobal('fetch', mockFetch(collection([post()])));
    const { getBlogPost } = await loadModule();

    expect(await getBlogPost('en', 'nope')).toBeNull();
  });

  it('throws on an upstream failure instead of reporting an empty blog', async () => {
    vi.stubGlobal('fetch', mockFetch({}, false, 503));
    const { getBlogPosts, getBlogPost } = await loadModule();

    await expect(getBlogPosts('en')).rejects.toThrow(/503/);
    await expect(getBlogPost('en', 'indexes')).rejects.toThrow(/503/);
  });
});
