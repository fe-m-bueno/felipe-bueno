import { describe, it, expect } from 'vitest';
import { filterAndSortPosts, formatBlogDate, getRecommendedPosts } from '@/lib/blog';
import type { BlogPostSummary } from '@/lib/blogContent';

function post(overrides: Partial<BlogPostSummary> & { id: string }): BlogPostSummary {
  return {
    title: `Post ${overrides.id}`,
    slug: `post-${overrides.id}`,
    excerpt: '',
    coverImage: '',
    coverImageAlt: '',
    category: null,
    tags: [],
    publishedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    readingTime: 5,
    ...overrides,
  };
}

const backend = { id: 'cat-backend', title: 'Backend', slug: 'backend' };
const frontend = { id: 'cat-frontend', title: 'Frontend', slug: 'frontend' };

describe('filterAndSortPosts', () => {
  const posts = [
    post({
      id: 'a',
      title: 'Validating data at the edge',
      publishedAt: '2026-08-01T00:00:00.000Z',
      readingTime: 8,
      tags: ['Airflow'],
      category: backend,
    }),
    post({
      id: 'b',
      title: 'Server Components',
      publishedAt: '2026-02-01T00:00:00.000Z',
      readingTime: 3,
      tags: ['React'],
      category: frontend,
    }),
    post({
      id: 'c',
      title: 'A postgres index story',
      publishedAt: '2026-05-01T00:00:00.000Z',
      readingTime: 11,
      excerpt: 'EXPLAIN ANALYZE',
    }),
  ];

  it('sorts by newest first by default', () => {
    expect(filterAndSortPosts(posts, '', 'recent').map((p) => p.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by oldest, reading time and title', () => {
    expect(filterAndSortPosts(posts, '', 'oldest').map((p) => p.id)).toEqual(['b', 'c', 'a']);
    expect(filterAndSortPosts(posts, '', 'shortest').map((p) => p.id)).toEqual(['b', 'a', 'c']);
    expect(filterAndSortPosts(posts, '', 'title').map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('collates A–Z in the reader locale', () => {
    const accented = [
      post({ id: 'z', title: 'Zebra' }),
      post({ id: 'a', title: 'Ágil' }),
      post({ id: 'b', title: 'Banco' }),
    ];
    expect(filterAndSortPosts(accented, '', 'title', 'pt').map((p) => p.id)).toEqual([
      'a',
      'b',
      'z',
    ]);
  });

  it('matches title, excerpt, category and tags, case-insensitively', () => {
    expect(filterAndSortPosts(posts, 'airflow', 'recent').map((p) => p.id)).toEqual(['a']);
    expect(filterAndSortPosts(posts, 'FRONTEND', 'recent').map((p) => p.id)).toEqual(['b']);
    expect(filterAndSortPosts(posts, 'explain', 'recent').map((p) => p.id)).toEqual(['c']);
  });

  it('ignores surrounding whitespace and returns everything for an empty query', () => {
    expect(filterAndSortPosts(posts, '   ', 'recent')).toHaveLength(3);
  });

  it('does not mutate the array it receives', () => {
    const original = [...posts];
    filterAndSortPosts(posts, '', 'title');
    expect(posts).toEqual(original);
  });
});

describe('getRecommendedPosts', () => {
  const current = post({ id: 'current', category: backend, tags: ['Python', 'SQL'] });

  it('never recommends the post being read', () => {
    const results = getRecommendedPosts([current, post({ id: 'other' })], current);
    expect(results.map((p) => p.id)).not.toContain('current');
  });

  it('ranks same category above shared tags', () => {
    const sameCategory = post({ id: 'same-category', category: backend });
    const twoSharedTags = post({ id: 'two-tags', tags: ['Python', 'SQL'] });

    const results = getRecommendedPosts([twoSharedTags, sameCategory], current, 2);
    expect(results.map((p) => p.id)).toEqual(['same-category', 'two-tags']);
  });

  it('breaks ties with the most recent post', () => {
    const older = post({ id: 'older', publishedAt: '2026-01-01T00:00:00.000Z' });
    const newer = post({ id: 'newer', publishedAt: '2026-06-01T00:00:00.000Z' });

    expect(getRecommendedPosts([older, newer], current, 2).map((p) => p.id)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('fills up with unrelated posts so the block is never short', () => {
    const unrelated = ['x', 'y', 'z'].map((id) => post({ id }));
    expect(getRecommendedPosts(unrelated, current)).toHaveLength(3);
  });

  it('returns fewer than the limit only when there are not enough posts', () => {
    expect(getRecommendedPosts([post({ id: 'only' })], current)).toHaveLength(1);
    expect(getRecommendedPosts([], current)).toEqual([]);
  });
});

describe('formatBlogDate', () => {
  it('formats in the reader locale', () => {
    expect(formatBlogDate('2026-07-19T00:00:00.000Z', 'pt')).toContain('2026');
    expect(formatBlogDate('2026-07-19T00:00:00.000Z', 'en')).toContain('2026');
  });

  it('reads the date in UTC, so the day does not shift by timezone', () => {
    expect(formatBlogDate('2026-07-19T00:00:00.000Z', 'en')).toContain('19');
  });

  it('returns an empty string for an unusable date', () => {
    expect(formatBlogDate('', 'en')).toBe('');
    expect(formatBlogDate('not-a-date', 'pt')).toBe('');
  });
});
