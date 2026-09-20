import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth, requireCandidate, requireAdmin } from '../../src/lib/auth/guards';
import * as nextAuthNext from 'next-auth/next';
import { NextResponse } from 'next/server';

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

describe('Authorization Guards', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('requireAuth', () => {
    it('should return 401 if unauthenticated', async () => {
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(null);
      const res = await requireAuth();
      expect(res).toBeInstanceOf(NextResponse);
      expect((res as NextResponse).status).toBe(401);
    });

    it('should return session if authenticated', async () => {
      const mockSession = { user: { id: '1', role: 'CANDIDATE', isActive: true } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireAuth();
      expect(res).toEqual(mockSession);
    });
  });

  describe('requireCandidate', () => {
    it('should return 401 if unauthenticated', async () => {
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(null);
      const res = await requireCandidate();
      expect((res as NextResponse).status).toBe(401);
    });

    it('should return 403 if user is ADMIN', async () => {
      const mockSession = { user: { id: '1', role: 'ADMIN', isActive: true } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireCandidate();
      expect((res as NextResponse).status).toBe(403);
    });

    it('should return 403 if user is CANDIDATE but disabled', async () => {
      const mockSession = { user: { id: '1', role: 'CANDIDATE', isActive: false } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireCandidate();
      expect((res as NextResponse).status).toBe(403);
    });

    it('should return session if active CANDIDATE', async () => {
      const mockSession = { user: { id: '1', role: 'CANDIDATE', isActive: true } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireCandidate();
      expect(res).toEqual(mockSession);
    });
  });

  describe('requireAdmin', () => {
    it('should return 401 if unauthenticated', async () => {
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(null);
      const res = await requireAdmin();
      expect((res as NextResponse).status).toBe(401);
    });

    it('should return 403 if user is CANDIDATE', async () => {
      const mockSession = { user: { id: '1', role: 'CANDIDATE', isActive: true } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireAdmin();
      expect((res as NextResponse).status).toBe(403);
    });

    it('should return 403 if user is ADMIN but disabled', async () => {
      const mockSession = { user: { id: '1', role: 'ADMIN', isActive: false } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireAdmin();
      expect((res as NextResponse).status).toBe(403);
    });

    it('should return session if active ADMIN', async () => {
      const mockSession = { user: { id: '1', role: 'ADMIN', isActive: true } };
      vi.mocked(nextAuthNext.getServerSession).mockResolvedValue(mockSession as any);
      const res = await requireAdmin();
      expect(res).toEqual(mockSession);
    });
  });
});
