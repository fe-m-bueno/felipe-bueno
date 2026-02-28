import { describe, it, expect, vi, beforeEach } from 'vitest';

// Shared mock for resend.emails.send — must be hoisted before module imports
const mockEmailSend = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  // Must use a regular function (not arrow) so it can be used with `new`
  Resend: vi.fn(function () {
    return { emails: { send: mockEmailSend } };
  }),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      data,
      status: init?.status ?? 200,
    })),
  },
}));

import { POST } from '@/app/api/contact/route';
import { NextResponse } from 'next/server';

// Helper: create a minimal Request-like object
function createRequest(
  body: unknown,
  ip = '127.0.0.1',
  ipSuffix = ''
): Request {
  return {
    headers: {
      get: (key: string) =>
        key === 'x-forwarded-for' ? `${ip}${ipSuffix}` : null,
    },
    json: async () => body,
  } as unknown as Request;
}

const validBody = {
  name: 'Felipe Bueno',
  email: 'user@example.com',
  message: 'This is a test message that is long enough.',
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailSend.mockResolvedValue({ data: { id: 'email-id' }, error: null });
  });

  describe('successful submission', () => {
    it('returns 200 with success flag on valid input', async () => {
      const req = createRequest(validBody, '10.1.0.1');
      const res = await POST(req);
      expect((res as any).status).toBe(200);
      expect((res as any).data).toEqual({ success: true });
    });

    it('calls resend.emails.send with the submitted name and email', async () => {
      const req = createRequest(validBody, '10.1.0.2');
      await POST(req);
      expect(mockEmailSend).toHaveBeenCalledOnce();
      const callArg = mockEmailSend.mock.calls[0][0];
      expect(callArg.subject).toContain('Felipe Bueno');
      expect(callArg.replyTo).toBe('user@example.com');
    });
  });

  describe('validation errors (400)', () => {
    it('returns 400 when name is too short', async () => {
      const req = createRequest({ ...validBody, name: 'A' }, '10.2.0.1');
      const res = await POST(req);
      expect((res as any).status).toBe(400);
    });

    it('returns 400 when email is malformed', async () => {
      const req = createRequest(
        { ...validBody, email: 'not-an-email' },
        '10.2.0.2'
      );
      const res = await POST(req);
      expect((res as any).status).toBe(400);
    });

    it('returns 400 when message is too short', async () => {
      const req = createRequest(
        { ...validBody, message: 'Short' },
        '10.2.0.3'
      );
      const res = await POST(req);
      expect((res as any).status).toBe(400);
    });

    it('returns 400 with validation details', async () => {
      const req = createRequest(
        { ...validBody, name: '' },
        '10.2.0.4'
      );
      const res = await POST(req);
      expect((res as any).status).toBe(400);
      expect((res as any).data).toHaveProperty('details');
    });

    it('returns 400 when required fields are missing entirely', async () => {
      const req = createRequest({}, '10.2.0.5');
      const res = await POST(req);
      expect((res as any).status).toBe(400);
    });
  });

  describe('honeypot field', () => {
    it('returns 400 (schema rejection) when honeypot has a value', async () => {
      // The honeypot field has z.string().max(0), so any non-empty value
      // fails schema validation and returns 400 — not a silent 200
      const req = createRequest(
        { ...validBody, honeypot: 'bot-filled-this' },
        '10.3.0.1'
      );
      const res = await POST(req);
      expect((res as any).status).toBe(400);
      expect(mockEmailSend).not.toHaveBeenCalled();
    });

    it('proceeds normally when honeypot is empty string', async () => {
      const req = createRequest(
        { ...validBody, honeypot: '' },
        '10.3.0.2'
      );
      const res = await POST(req);
      expect((res as any).status).toBe(200);
    });

    it('proceeds normally when honeypot is omitted', async () => {
      const req = createRequest(validBody, '10.3.0.3');
      const res = await POST(req);
      expect((res as any).status).toBe(200);
    });
  });

  describe('rate limiting', () => {
    it('returns 429 after 5 successful requests from the same IP', async () => {
      const rateLimitIp = '10.4.0.1';

      // First 5 requests should succeed
      for (let i = 0; i < 5; i++) {
        const req = createRequest(validBody, rateLimitIp);
        const res = await POST(req);
        expect((res as any).status).toBe(200);
      }

      // 6th request should be rate limited
      const req = createRequest(validBody, rateLimitIp);
      const res = await POST(req);
      expect((res as any).status).toBe(429);
    });

    it('allows requests from a different IP after rate limit is hit', async () => {
      const rateLimitedIp = '10.4.0.2';
      const allowedIp = '10.4.0.3';

      // Exhaust rate limit for first IP
      for (let i = 0; i < 5; i++) {
        await POST(createRequest(validBody, rateLimitedIp));
      }

      // Different IP should still be allowed
      const res = await POST(createRequest(validBody, allowedIp));
      expect((res as any).status).toBe(200);
    });

    it('uses "unknown" as IP when x-forwarded-for header is absent', async () => {
      const req = {
        headers: { get: () => null },
        json: async () => validBody,
      } as unknown as Request;

      const res = await POST(req);
      // First request from "unknown" should succeed
      expect((res as any).status).toBe(200);
    });
  });

  describe('Resend errors (500)', () => {
    it('returns 500 when Resend returns an error object', async () => {
      mockEmailSend.mockResolvedValue({
        data: null,
        error: { message: 'API error' },
      });

      const req = createRequest(validBody, '10.5.0.1');
      const res = await POST(req);
      expect((res as any).status).toBe(500);
    });

    it('returns 500 when Resend throws', async () => {
      mockEmailSend.mockRejectedValue(new Error('Network error'));

      const req = createRequest(validBody, '10.5.0.2');
      const res = await POST(req);
      expect((res as any).status).toBe(500);
    });
  });

  describe('malformed request body', () => {
    it('returns 500 when request.json() throws', async () => {
      const req = {
        headers: { get: () => '10.6.0.1' },
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Request;

      const res = await POST(req);
      expect((res as any).status).toBe(500);
    });
  });
});
