import type { IncomingMessage, ServerResponse } from 'node:http';

type ContactSource = 'contact' | 'donation' | 'volunteer' | 'event-volunteer' | 'newsletter';

interface ContactPayload {
  source?: ContactSource;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  website?: string;
}

const MAX_BODY_BYTES = 25_000;
const SOURCE_LABELS: Record<ContactSource, string> = {
  contact: 'Contact Form',
  donation: 'Donation Inquiry',
  volunteer: 'Volunteer Application',
  'event-volunteer': 'Event Volunteer Contact',
  newsletter: 'Newsletter Signup',
};

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value: unknown, maxLength = 2_000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function envValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) return '';

  const quote = value[0];
  if ((quote === '"' || quote === "'") && value[value.length - 1] === quote) {
    return value.slice(1, -1).trim();
  }

  return value;
}

function readBody(request: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = '';

    request.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
      if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function normalizePayload(payload: ContactPayload) {
  const source = payload.source;
  const name = clean(payload.name, 200);
  const email = clean(payload.email, 320).toLowerCase();
  const subject = clean(payload.subject, 160);
  const message = clean(payload.message, 5_000);
  const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {};

  if (!source || !(source in SOURCE_LABELS)) {
    throw new Error('Choose a valid form source.');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Enter a valid email address.');
  }

  if (source !== 'newsletter' && !message) {
    throw new Error('Enter a message.');
  }

  return { source, name, email, subject, message, metadata };
}

function formatMetadata(metadata: Record<string, unknown>) {
  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
      return { key, value: formattedValue };
    });
}

function buildEmail(payload: ReturnType<typeof normalizePayload>) {
  const label = SOURCE_LABELS[payload.source];
  const subjectDetail = payload.subject || label;
  const emailSubject = `[VIVA] ${label}: ${subjectDetail}`;
  const metadata = formatMetadata(payload.metadata);
  const lines = [
    `Source: ${label}`,
    payload.name ? `Name: ${payload.name}` : '',
    `Email: ${payload.email}`,
    payload.subject ? `Subject: ${payload.subject}` : '',
    '',
    payload.message || 'Newsletter signup request.',
    '',
    ...metadata.map((item) => `${item.key}: ${item.value}`),
  ].filter(Boolean);

  const htmlRows = [
    ['Source', label],
    payload.name ? ['Name', payload.name] : null,
    ['Email', payload.email],
    payload.subject ? ['Subject', payload.subject] : null,
    ...metadata.map((item) => [item.key, item.value]),
  ].filter((row): row is string[] => Boolean(row));

  const html = `
    <div style="font-family: Arial, sans-serif; color: #231f20; line-height: 1.5;">
      <h2 style="margin: 0 0 16px;">${escapeHtml(label)}</h2>
      <table style="border-collapse: collapse; margin-bottom: 18px;">
        ${htmlRows
          .map(
            ([key, value]) => `
              <tr>
                <td style="padding: 4px 12px 4px 0; color: #6b625b; font-weight: 700;">${escapeHtml(key)}</td>
                <td style="padding: 4px 0;">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join('')}
      </table>
      <div style="white-space: pre-wrap; border-top: 1px solid #eee2db; padding-top: 16px;">${escapeHtml(
        payload.message || 'Newsletter signup request.',
      )}</div>
    </div>
  `;

  return { subject: emailSubject, text: lines.join('\n'), html };
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const incoming = JSON.parse(rawBody || '{}') as ContactPayload;

    if (clean(incoming.website)) {
      sendJson(response, 200, { ok: true });
      return;
    }

    const apiKey = envValue('RESEND_API_KEY');
    const from = envValue('CONTACT_FROM_EMAIL');
    const to = envValue('CONTACT_TO_EMAIL');

    if (!apiKey || !from || !to) {
      sendJson(response, 500, { error: 'Email service is not configured.' });
      return;
    }

    const payload = normalizePayload(incoming);
    const email = buildEmail(payload);
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        reply_to: payload.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      console.error('Resend email failed:', resendResponse.status, details);
      sendJson(response, 502, { error: 'Email could not be sent right now.' });
      return;
    }

    sendJson(response, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    sendJson(response, 400, { error: message });
  }
}
