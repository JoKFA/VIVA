/**
 * Supabase client singleton.
 *
 * Env vars required (Vite prefix so they're bundled into the client):
 *   VITE_SUPABASE_URL       https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY  eyJ...
 *
 * The Vercel Supabase integration can prefix public variables with
 * SUPABASE_VITE_. Those aliases are supported via vite.config.ts envPrefix.
 *
 * Dev guard: throws immediately if vars are missing so the problem is
 * obvious. In production the app degrades gracefully — all hooks fall
 * back to mockData, so the public site still renders.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env as Record<string, string | undefined>;

const url =
  env.VITE_SUPABASE_URL ||
  env.SUPABASE_VITE_SUPABASESUPABASE_URL;

const key =
  env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_VITE_SUPABASESUPABASE_ANON_KEY ||
  env.SUPABASE_VITE_SUPABASESUPABASE_PUBLISHABLE_KEY;

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
