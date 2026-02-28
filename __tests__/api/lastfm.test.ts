import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      data,
      status: init?.status ?? 200,
    })),
  },
}));

import { GET } from '@/app/api/lastfm/route';

function buildLastFmResponse(track: Record<string, unknown> | null) {
  return {
    recenttracks: {
      track: track ? [track] : [],
    },
  };
}

function mockFetch(response: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Bad Request',
      json: async () => response,
    })
  );
}

const validTrack = {
  name: 'Test Song',
  artist: { '#text': 'Test Artist' },
  album: { '#text': 'Test Album' },
  image: [
    { '#text': 'small.jpg', size: 'small' },
    { '#text': 'medium.jpg', size: 'medium' },
    { '#text': 'large.jpg', size: 'large' },
  ],
};

describe('GET /api/lastfm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('missing environment variables', () => {
    it('returns 500 when LAST_FM_API_KEY is missing', async () => {
      vi.stubEnv('LAST_FM_API_KEY', '');
      vi.stubEnv('LAST_FM_USER', 'testuser');

      const res = await GET();
      expect((res as any).status).toBe(500);
      expect((res as any).data).toHaveProperty('error');
    });

    it('returns 500 when LAST_FM_USER is missing', async () => {
      vi.stubEnv('LAST_FM_API_KEY', 'test-api-key');
      vi.stubEnv('LAST_FM_USER', '');

      const res = await GET();
      expect((res as any).status).toBe(500);
      expect((res as any).data).toHaveProperty('error');
    });

    it('returns 500 when both env vars are missing', async () => {
      vi.stubEnv('LAST_FM_API_KEY', '');
      vi.stubEnv('LAST_FM_USER', '');

      const res = await GET();
      expect((res as any).status).toBe(500);
    });
  });

  describe('successful response', () => {
    beforeEach(() => {
      vi.stubEnv('LAST_FM_API_KEY', 'test-api-key');
      vi.stubEnv('LAST_FM_USER', 'testuser');
    });

    it('returns track data on a valid Last.fm response', async () => {
      mockFetch(buildLastFmResponse(validTrack));

      const res = await GET();
      expect((res as any).status).toBe(200);
      expect((res as any).data).toEqual({
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        image: 'large.jpg',
      });
    });

    it('uses "Unknown Album" when album text is empty', async () => {
      const trackNoAlbum = {
        ...validTrack,
        album: { '#text': '' },
      };
      mockFetch(buildLastFmResponse(trackNoAlbum));

      const res = await GET();
      expect((res as any).data.album).toBe('Unknown Album');
    });

    it('returns null image when image array is empty', async () => {
      const trackNoImage = {
        ...validTrack,
        image: [],
      };
      mockFetch(buildLastFmResponse(trackNoImage));

      const res = await GET();
      expect((res as any).data.image).toBeNull();
    });

    it('returns null image when image entry text is empty', async () => {
      const trackEmptyImage = {
        ...validTrack,
        image: [
          { '#text': '', size: 'small' },
          { '#text': '', size: 'medium' },
          { '#text': '', size: 'large' },
        ],
      };
      mockFetch(buildLastFmResponse(trackEmptyImage));

      const res = await GET();
      expect((res as any).data.image).toBeNull();
    });

    it('includes the API key and username in the fetch URL', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => buildLastFmResponse(validTrack),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await GET();

      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).toContain('test-api-key');
      expect(calledUrl).toContain('testuser');
      expect(calledUrl).toContain('user.getrecenttracks');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      vi.stubEnv('LAST_FM_API_KEY', 'test-api-key');
      vi.stubEnv('LAST_FM_USER', 'testuser');
    });

    it('returns 404 when track array is empty', async () => {
      mockFetch(buildLastFmResponse(null));

      const res = await GET();
      expect((res as any).status).toBe(404);
      expect((res as any).data).toHaveProperty('error', 'No track data found');
    });

    it('returns 404 when recenttracks has no track property', async () => {
      mockFetch({ recenttracks: {} });

      const res = await GET();
      expect((res as any).status).toBe(404);
    });

    it('returns the upstream status code when Last.fm fetch fails', async () => {
      mockFetch({}, false, 403);

      const res = await GET();
      expect((res as any).status).toBe(403);
    });

    it('returns 500 when fetch throws a network error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('Network error'))
      );

      const res = await GET();
      expect((res as any).status).toBe(500);
      expect((res as any).data).toHaveProperty('error', 'Internal server error');
    });

    it('returns 500 when response.json() throws', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => {
            throw new Error('Parse error');
          },
        })
      );

      const res = await GET();
      expect((res as any).status).toBe(500);
    });
  });
});
