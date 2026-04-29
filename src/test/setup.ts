/**
 * Vitest global setup.
 * Runs before every test file.
 */

// Silence console.error noise from intentional error-boundary / catch paths
// during tests. Remove this if you want full console output.
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  // Suppress React's act() warnings and known Supabase stub warnings
  if (
    msg.includes('Warning:') ||
    msg.includes('act(') ||
    msg.includes('placeholder.supabase.co')
  ) return;
  originalConsoleError(...args);
};
