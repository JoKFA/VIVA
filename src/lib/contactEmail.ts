export type ContactEmailSource = 'contact' | 'donation' | 'volunteer' | 'event-volunteer' | 'newsletter';

export interface ContactEmailPayload {
  source: ContactEmailSource;
  name?: string;
  email: string;
  subject?: string;
  message?: string;
  metadata?: Record<string, string | string[] | number | boolean | null | undefined>;
  website?: string;
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error || 'Email could not be sent right now.');
  }

  return data;
}
