import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    res.writeHead(500).end('Missing Supabase env vars');
    return;
  }

  try {
    const r = await fetch(`${url}/rest/v1/site_settings?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    res.writeHead(r.ok ? 200 : 502).end(r.ok ? 'ok' : `upstream ${r.status}`);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}
