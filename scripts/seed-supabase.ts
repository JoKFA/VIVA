/**
 * Seed script: populate Supabase from mockData.ts
 * Run: npx tsx scripts/seed-supabase.ts
 * Safe to run multiple times (upsert on id).
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
 */
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import {
  siteSettings,
  stats,
  programs,
  events,
  eventVolunteerContacts,
  teamMembers,
  awards,
  annualReports,
  volunteerRoles,
  partners,
  testimonials,
  faqs,
  contactInfo,
  honours,
} from '../src/data/mockData';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key);

async function run() {
  console.log('Seeding Supabase from mockData...\n');

  // 1. site_settings (single row, upsert by fixed id)
  const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';
  await upsert('site_settings', [{
    id: SETTINGS_ID,
    organization_name: siteSettings.organizationName,
    tagline: siteSettings.tagline,
    donation_url: siteSettings.donationUrl,
    volunteer_form_url: siteSettings.volunteerFormUrl,
    social_links: siteSettings.socialLinks,
    address: siteSettings.address,
    phone: siteSettings.phone,
    email: siteSettings.email,
    media_email: siteSettings.mediaEmail,
    territory_acknowledgement: siteSettings.territoryAcknowledgement,
    published: true,
  }]);

  // 2. stats
  await upsert('stats', stats.map((s, i) => ({
    id: stableUuid(s.id),
    label: s.label,
    value: s.value,
    suffix: s.suffix ?? null,
    prefix: s.prefix ?? null,
    sort_order: i,
    published: true,
  })));

  // 3. programs
  await upsert('programs', programs.map((p, i) => ({
    id: stableUuid(p.id),
    title: p.title,
    description: p.description,
    icon: p.icon,
    link: p.link,
    sort_order: i,
    published: true,
  })));

  // 4. events
  await upsert('events', events.map(e => ({
    id: stableUuid(e.id),
    slug: e.slug,
    title: e.title,
    description: e.description,
    date: e.date,
    end_date: e.endDate ?? null,
    time: e.time,
    location: e.location,
    address: e.address ?? null,
    type: e.type,
    tags: e.tags,
    capacity: e.capacity,
    registered: e.registered,
    status: e.status,
    image_url: e.imageUrl ?? null,
    lead_contact: e.leadContact ?? null,
    partners: e.partners ?? null,
    agenda: e.agenda ?? null,
    what_you_will_do: e.whatYouWillDo ?? null,
    is_past: e.isPast,
    recap: e.recap ?? null,
    published: true,
  })));

  // 5. event_volunteer_contacts
  const contacts = Object.values(eventVolunteerContacts);
  await upsert('event_volunteer_contacts', contacts.map((c, i) => ({
    id: stableUuid(String(i + 1), 'evc'),
    event_slug: c.eventSlug,
    admin_name: c.adminName,
    admin_role: c.adminRole,
    admin_wechat_id: c.adminWechatId ?? null,
    admin_wechat_qr_url: c.adminWechatQrUrl ?? null,
    admin_contact_note: c.adminContactNote ?? null,
    published: false,  // admin must explicitly publish each contact
  })));

  // 6. team_members
  await upsert('team_members', teamMembers.map(m => ({
    id: stableUuid(m.id, 'tm'),
    name: m.name,
    role: m.role,
    bio: m.bio,
    image_url: m.imageUrl,
    linked_in_url: m.linkedInUrl ?? null,
    is_executive: m.isExecutive,
    sort_order: m.order,
    published: true,
  })));

  // 7. awards
  await upsert('awards', awards.map(a => ({
    id: stableUuid(a.id, 'aw'),
    name: a.name,
    years: a.years,
    description: a.description,
    eligibility: a.eligibility,
    timeline: a.timeline,
    application_url: a.applicationUrl ?? null,
    pdf_url: a.pdfUrl ?? null,
    past_recipients: a.pastRecipients,
    published: true,
  })));

  // 8. annual_reports
  await upsert('annual_reports', annualReports.map(r => ({
    id: stableUuid(r.id, 'ar'),
    year: r.year,
    title: r.title,
    highlights: r.highlights,
    cover_image_url: r.coverImageUrl,
    pdf_url: r.pdfUrl,
    total_volunteers: r.totalVolunteers ?? null,
    total_hours: r.totalHours ?? null,
    total_events: r.totalEvents ?? null,
    published: true,
  })));

  // 9. volunteer_roles
  await upsert('volunteer_roles', volunteerRoles.map(v => ({
    id: stableUuid(v.id, 'vr'),
    title: v.title,
    program: v.program,
    description: v.description,
    commitment: v.commitment,
    skills: v.skills,
    tags: v.tags,
    published: true,
  })));

  // 10. partners
  await upsert('partners', partners.map((p, i) => ({
    id: stableUuid(p.id, 'pt'),
    name: p.name,
    logo_url: p.logoUrl,
    website_url: p.websiteUrl ?? null,
    sort_order: i,
    published: true,
  })));

  // 11. testimonials
  await upsert('testimonials', testimonials.map(t => ({
    id: stableUuid(t.id, 'ts'),
    quote: t.quote,
    author: t.author,
    role: t.role,
    image_url: t.imageUrl ?? null,
    published: true,
  })));

  // 12. faqs
  await upsert('faqs', faqs.map((f, i) => ({
    id: stableUuid(f.id, 'fq'),
    question: f.question,
    answer: f.answer,
    category: f.category ?? null,
    sort_order: i,
    published: true,
  })));

  // 13. contact_info
  await upsert('contact_info', contactInfo.map((c, i) => ({
    id: stableUuid(c.id, 'ci'),
    type: c.type,
    title: c.title,
    value: c.value,
    icon: c.icon ?? null,
    sort_order: i,
    published: true,
  })));

  // 14. honours_carousel_entries
  await upsert('honours_carousel_entries', honours.map((h, i) => ({
    id: stableUuid(h.id, 'hc'),
    name: h.name,
    title: h.title,
    organization: h.organization,
    tier: h.tier,
    initials: h.initials,
    accent: h.accent,
    quote: h.quote,
    image_url: null,
    letter_image_url: h.letterImageUrl || null,
    year: null,
    description: null,
    sort_order: i,
    published: true,
  })));

  console.log('\nSeed complete.');
}

async function upsert(table: string, rows: Record<string, unknown>[]) {
  const { error } = await sb.from(table).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(`  [ERROR] ${table}:`, error.message);
  } else {
    console.log(`  [OK] ${table}: ${rows.length} row(s)`);
  }
}

function stableUuid(id: string, namespace = 'default'): string {
  const hex = createHash('sha1')
    .update(`${namespace}:${id}`)
    .digest('hex')
    .slice(0, 32);

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

run().catch(err => { console.error(err); process.exit(1); });
