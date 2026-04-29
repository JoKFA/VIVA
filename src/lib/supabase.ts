/**
 * Supabase client singleton.
 *
 * Env vars required (Vite prefix so they're bundled into the client):
 *   VITE_SUPABASE_URL       https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY  eyJ...
 *
 * Dev guard: throws immediately if vars are missing so the problem is
 * obvious. In production the app degrades gracefully — all hooks fall
 * back to mockData, so the public site still renders.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient;

if (!url || !key) {
  if (import.meta.env.DEV) {
    throw new Error(
      '[VIVA] Missing Supabase env vars.\n' +
      'Create a .env.local file with:\n' +
      '  VITE_SUPABASE_URL=https://<project>.supabase.co\n' +
      '  VITE_SUPABASE_ANON_KEY=eyJ...\n' +
      'Get these from: Supabase Dashboard → Project Settings → API'
    );
  }
  // Production: create a stub client that will fail all queries gracefully.
  // Hooks catch errors and fall back to mockData, so the public site renders.
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
} else {
  supabase = createClient(url, key);
}

export { supabase };
