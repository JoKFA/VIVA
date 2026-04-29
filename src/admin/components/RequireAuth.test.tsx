/**
 * Tests for RequireAuth component.
 *
 * Three states to cover:
 *   1. Session check in-flight (undefined) → loading indicator
 *   2. No session (null)                   → redirect to /admin/login
 *   3. Active session                      → renders children
 *
 * The supabase module is fully mocked so no network calls are made.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';

// ── Mock supabase ─────────────────────────────────────────────────────────────
// vi.mock factories are hoisted to the top of the file by vitest, so plain
// `const mockGetSession = vi.fn()` declarations aren't yet initialised when the
// factory runs. vi.hoisted() evaluates its callback at hoist time, making the
// returned fns available inside the factory without a TDZ error.
const { mockGetSession, mockOnAuthStateChange, mockUnsubscribe } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockUnsubscribe: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Render RequireAuth inside a MemoryRouter with a /admin/login sentinel route */
function renderWithRouter(initialPath = '/admin/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <div data-testid="protected-content">Protected Content</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // Default: onAuthStateChange returns a subscription object
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  });
});

afterEach(() => {
  cleanup();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RequireAuth', () => {
  it('shows loading indicator while session check is in-flight', () => {
    // getSession returns a promise that never resolves (simulates slow network)
    mockGetSession.mockReturnValue(new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText('Checking session…')).toBeTruthy();
    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(screen.queryByTestId('login-page')).toBeNull();
  });

  it('redirects to /admin/login when there is no active session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeTruthy();
    });

    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('renders children when session is active', async () => {
    const fakeSession = {
      user: { id: 'user-1', email: 'admin@vivahq.ca' },
      access_token: 'fake-jwt-token',
    };
    mockGetSession.mockResolvedValue({ data: { session: fakeSession } });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeTruthy();
    });

    expect(screen.queryByTestId('login-page')).toBeNull();
  });

  it('updates when onAuthStateChange fires a sign-out event', async () => {
    // Start authenticated
    const fakeSession = { user: { id: 'u1' }, access_token: 'tok' };
    mockGetSession.mockResolvedValue({ data: { session: fakeSession } });

    // Capture the callback so we can fire it manually
    let authCallback: ((event: string, session: unknown) => void) | null = null;
    mockOnAuthStateChange.mockImplementation((cb: (event: string, session: unknown) => void) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    renderWithRouter();

    // Initially shows content
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeTruthy();
    });

    // Fire a SIGNED_OUT event
    authCallback!('SIGNED_OUT', null);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeTruthy();
    });
  });

  it('unsubscribes from auth changes on unmount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const { unmount } = renderWithRouter();

    // Wait for getSession to resolve before unmounting
    await waitFor(() => screen.getByTestId('login-page'));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('preserves the intended path in redirect state', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    let capturedState: unknown = undefined;

    render(
      <MemoryRouter initialEntries={['/admin/stats']}>
        <Routes>
          <Route
            path="/admin/login"
            element={
              <div data-testid="login-page">
                {/* Read location state from context via a child */}
                <StateReader onState={s => { capturedState = s; }} />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <RequireAuth>
                <div>Protected</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId('login-page'));

    // RequireAuth passes { from: location } as redirect state
    expect(capturedState).toBeTruthy();
    expect((capturedState as { from?: { pathname?: string } })?.from?.pathname).toBe('/admin/stats');
  });
});

// ── Utility component ─────────────────────────────────────────────────────────

import { useLocation } from 'react-router-dom';

function StateReader({ onState }: { onState: (state: unknown) => void }) {
  const location = useLocation();
  onState(location.state);
  return null;
}
