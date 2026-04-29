/**
 * Tests for src/lib/supabase.ts
 *
 * The module has two behaviours:
 *   DEV + missing vars  → throw immediately (developer feedback)
 *   PROD + missing vars → return stub client (public site degrades gracefully)
 *   vars present        → return real client
 *
 * Each test resets the module registry so the top-level side effect re-runs
 * with freshly stubbed env vars.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const PROJECT_ID = 'nlrbxbcqqqopsmnpaqlf';
const REAL_URL = `https://${PROJECT_ID}.supabase.co`;
const REAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

describe('supabase client — env guard', () => {
  beforeEach(() => {
    // Start each test with a clean module registry so the module
    // top-level code re-runs with the current stubbed env.
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws in DEV when both env vars are missing', async () => {
    // Vitest runs with import.meta.env.DEV = true by default
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    await expect(import('./supabase')).rejects.toThrow(
      '[VIVA] Missing Supabase env vars'
    );
  });

  it('throws in DEV when only URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', REAL_KEY);

    await expect(import('./supabase')).rejects.toThrow(
      '[VIVA] Missing Supabase env vars'
    );
  });

  it('throws in DEV when only KEY is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', REAL_URL);
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    await expect(import('./supabase')).rejects.toThrow(
      '[VIVA] Missing Supabase env vars'
    );
  });

  it('exports a functional client when both vars are present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', REAL_URL);
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', REAL_KEY);

    const { supabase } = await import('./supabase');

    expect(supabase).toBeDefined();
    expect(typeof supabase.auth.getSession).toBe('function');
    expect(typeof supabase.from).toBe('function');
  });

  it('error message includes .env.local instructions', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    let message = '';
    try {
      await import('./supabase');
    } catch (e) {
      message = String(e);
    }

    expect(message).toContain('.env.local');
    expect(message).toContain('VITE_SUPABASE_URL');
    expect(message).toContain('VITE_SUPABASE_ANON_KEY');
  });
});
