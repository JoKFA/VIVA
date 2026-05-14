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
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const IP_RATE_LIMIT = 20;
const EMAIL_RATE_LIMIT = 6;
const SOURCE_LABELS: Record<ContactSource, string> = {
  contact: 'Contact Form',
  donation: 'Donation Inquiry',
  volunteer: 'Volunteer Application',
  'event-volunteer': 'Event Volunteer Contact',
  newsletter: 'Newsletter Signup',
};
const SOURCE_DETAILS: Record<ContactSource, { headline: string; purpose: string; action: string; accent: string }> = {
  contact: {
    headline: 'New general contact message',
    purpose: 'A visitor used the public Contact page to reach the VIVA admin team.',
    action: 'Review the message and reply directly to the sender if follow-up is needed.',
    accent: '#c1272d',
  },
  donation: {
    headline: 'New donation inquiry',
    purpose: 'A visitor asked about donations, sponsorships, or in-kind support.',
    action: 'Send this to the fundraising or partnerships lead for follow-up.',
    accent: '#15803d',
  },
  volunteer: {
    headline: 'New volunteer application',
    purpose: 'A prospective volunteer submitted the application form.',
    action: 'Review availability, interests, and motivation before contacting the applicant.',
    accent: '#1a5c9e',
  },
  'event-volunteer': {
    headline: 'New event volunteer coordinator message',
    purpose: 'A visitor could not use the WeChat QR flow and left a message for an event coordinator.',
    action: 'Use the event details below to route this to the right coordinator.',
    accent: '#b45309',
  },
  newsletter: {
    headline: 'New newsletter signup',
    purpose: 'A visitor asked to receive VIVA updates.',
    action: 'Add this email address to the newsletter or mailing list workflow.',
    accent: '#6d28d9',
  },
};
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function getHeader(request: IncomingMessage, name: string) {
  const value = request.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function getClientIp(request: IncomingMessage) {
  const forwardedFor = getHeader(request, 'x-forwarded-for');
  return forwardedFor.split(',')[0]?.trim() || request.socket.remoteAddress || 'unknown';
}

function checkRateLimit(key: string, maxRequests: number) {
  const now = Date.now();
  const existing = rateLimitBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= maxRequests) return false;

  existing.count += 1;
  return true;
}

function pruneRateLimits() {
  if (rateLimitBuckets.size < 1_000) return;

  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value: unknown, maxLength = 2_000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function isAllowedOrigin(request: IncomingMessage) {
  const origin = getHeader(request, 'origin') || getHeader(request, 'referer');
  if (!origin) return true;

  try {
    const { hostname } = new URL(origin);
    const normalized = hostname.toLowerCase();

    return (
      normalized === 'vivahq.org' ||
      normalized === 'www.vivahq.org' ||
      normalized === 'yaotingw.com' ||
      normalized === 'www.yaotingw.com' ||
      normalized === 'localhost' ||
      normalized === '127.0.0.1' ||
      (normalized.endsWith('.yaoting-wangs-projects.vercel.app') && normalized.startsWith('viva-'))
    );
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function titleCase(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function envValue(name: string) {
  let value = process.env[name]?.trim();
  if (!value) return '';

  const assignmentPrefix = `${name}=`;
  if (value.startsWith(assignmentPrefix)) {
    value = value.slice(assignmentPrefix.length).trim();
  }

  value = value.replace(/\\"/g, '"').replace(/\\'/g, "'");

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

function countUrls(value: string) {
  return value.match(/\bhttps?:\/\/[^\s<>"']+|\bwww\.[^\s<>"']+/gi)?.length || 0;
}

function buildSecurityNotes(message: string, metadata: { key: string; value: string }[]) {
  const allText = [message, ...metadata.map((item) => item.value)].join('\n');
  const notes = [
    'User-provided text is escaped in this email and is not converted into clickable links.',
    'Confirm requests involving money, credentials, invoices, or urgent action through a trusted channel.',
  ];
  const urlCount = countUrls(allText);

  if (urlCount > 0) {
    notes.unshift(`This submission contains ${urlCount} URL-like value${urlCount === 1 ? '' : 's'}. Treat links as untrusted.`);
  }

  if (/\b(password|invoice|payment|urgent|wire transfer|gift card|crypto|bank account|login)\b/i.test(allText)) {
    notes.unshift('This submission contains phishing-sensitive wording. Verify before clicking, paying, or sharing access.');
  }

  return notes;
}

function buildEmail(payload: ReturnType<typeof normalizePayload>) {
  const label = SOURCE_LABELS[payload.source];
  const details = SOURCE_DETAILS[payload.source];
  const subjectDetail = payload.subject || label;
  const emailSubject = `[VIVA] ${label}: ${subjectDetail}`;
  const metadata = formatMetadata(payload.metadata);
  const securityNotes = buildSecurityNotes(payload.message, metadata);
  const lines = [
    details.headline,
    '',
    `Purpose: ${details.purpose}`,
    `Recommended action: ${details.action}`,
    '',
    `Form source: ${label}`,
    payload.name ? `Name: ${payload.name}` : '',
    `Email: ${payload.email}`,
    payload.subject ? `Subject: ${payload.subject}` : '',
    '',
    payload.message || 'Newsletter signup request.',
    '',
    metadata.length ? 'Additional details:' : '',
    ...metadata.map((item) => `- ${titleCase(item.key)}: ${item.value}`),
    '',
    'Security notes:',
    ...securityNotes.map((note) => `- ${note}`),
  ].filter(Boolean);

  const htmlRows = [
    ['Form Source', label],
    payload.name ? ['Name', payload.name] : null,
    ['Email', payload.email],
    payload.subject ? ['Subject', payload.subject] : null,
  ].filter((row): row is string[] => Boolean(row));

  const html = `
    <div style="margin:0;padding:0;background:#f6f1ed;font-family:Arial,Helvetica,sans-serif;color:#241c17;">
      <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
        <div style="overflow:hidden;border:1px solid #eadfd9;border-radius:14px;background:#ffffff;">
          <div style="border-top:6px solid ${details.accent};padding:24px 28px 18px;">
            <div style="margin:0 0 10px;color:${details.accent};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
              ${escapeHtml(label)}
            </div>
            <h1 style="margin:0 0 10px;font-size:24px;line-height:1.2;color:#241c17;">
              ${escapeHtml(details.headline)}
            </h1>
            <p style="margin:0;color:#6d625a;font-size:14px;line-height:1.6;">
              ${escapeHtml(details.purpose)}
            </p>
          </div>

          <div style="padding:0 28px 24px;">
            <div style="margin:0 0 20px;padding:14px 16px;border-radius:10px;background:#fff7ed;border:1px solid #f0dfcf;">
              <div style="margin:0 0 4px;color:#8a4b12;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Recommended action</div>
              <div style="font-size:14px;line-height:1.55;color:#3b3029;">${escapeHtml(details.action)}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;margin:0 0 22px;">
              ${htmlRows
                .map(
                  ([key, value]) => `
                    <tr>
                      <td style="width:140px;padding:10px 12px 10px 0;border-bottom:1px solid #f0e7e1;color:#6d625a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">${escapeHtml(key)}</td>
                      <td style="padding:10px 0;border-bottom:1px solid #f0e7e1;color:#241c17;font-size:14px;">${escapeHtml(value)}</td>
                    </tr>
                  `,
                )
                .join('')}
            </table>

            <div style="margin:0 0 22px;">
              <div style="margin:0 0 8px;color:#6d625a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Message</div>
              <div style="white-space:pre-wrap;padding:16px;border-radius:10px;background:#faf7f4;border:1px solid #eee4dc;color:#241c17;font-size:15px;line-height:1.6;">${escapeHtml(
                payload.message || 'Newsletter signup request.',
              )}</div>
            </div>

            ${
              metadata.length
                ? `
                  <div style="margin:0 0 22px;">
                    <div style="margin:0 0 8px;color:#6d625a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Additional details</div>
                    <table style="width:100%;border-collapse:collapse;">
                      ${metadata
                        .map(
                          (item) => `
                            <tr>
                              <td style="width:170px;padding:8px 12px 8px 0;border-bottom:1px solid #f0e7e1;color:#6d625a;font-size:13px;font-weight:700;">${escapeHtml(titleCase(item.key))}</td>
                              <td style="padding:8px 0;border-bottom:1px solid #f0e7e1;color:#241c17;font-size:13px;">${escapeHtml(item.value)}</td>
                            </tr>
                          `,
                        )
                        .join('')}
                    </table>
                  </div>
                `
                : ''
            }

            <div style="padding:14px 16px;border-radius:10px;background:#f7fafc;border:1px solid #dbe7ef;">
              <div style="margin:0 0 8px;color:#35566b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Security notes</div>
              <ul style="margin:0;padding-left:18px;color:#40515c;font-size:13px;line-height:1.55;">
                ${securityNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
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
    pruneRateLimits();

    if (!isAllowedOrigin(request)) {
      sendJson(response, 403, { error: 'Request origin is not allowed.' });
      return;
    }

    const clientIp = getClientIp(request);
    if (!checkRateLimit(`ip:${clientIp}`, IP_RATE_LIMIT)) {
      sendJson(response, 429, { error: 'Too many requests. Please try again later.' });
      return;
    }

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
    if (!checkRateLimit(`email:${payload.email}`, EMAIL_RATE_LIMIT)) {
      sendJson(response, 429, { error: 'Too many requests. Please try again later.' });
      return;
    }

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
