-- VIVA CMS - Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New Query)
-- Re-runnable: uses IF NOT EXISTS and CREATE OR REPLACE throughout

-- -----------------------------------------------------------------------------
-- 0. Admin role helper
-- -----------------------------------------------------------------------------
-- RLS policies use this instead of (auth.role() = 'authenticated') so that
-- future volunteer accounts (authenticated but NOT admins) cannot write content.
-- Set app_metadata.user_role='admin' for admin users. Example:
-- UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"user_role":"admin"}' WHERE email = 'admin@vivahq.ca';
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'user_role', '') = 'admin'
$$;

-- -----------------------------------------------------------------------------
-- 1. site_settings  (single-row table)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name        text,
  tagline                  text,
  donation_url             text,
  volunteer_form_url       text,
  social_links             jsonb,   -- { facebook, instagram, twitter, linkedin, youtube }
  address                  jsonb,   -- { street, city, province, postalCode, country }
  phone                    text,
  email                    text,
  media_email              text,
  territory_acknowledgement text,
  published                boolean DEFAULT true,
  updated_at               timestamptz DEFAULT now()
);

-- Enforce exactly one row at DB level
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_singleton
  ON site_settings ((true));

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read" ON site_settings;
CREATE POLICY "public_read" ON site_settings
  FOR SELECT TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_all" ON site_settings;
CREATE POLICY "admin_all" ON site_settings
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 2. stats
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label      text,
  value      integer,
  suffix     text,
  prefix     text,
  sort_order integer DEFAULT 0,
  published  boolean DEFAULT true
);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON stats;
CREATE POLICY "public_read" ON stats FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON stats;
CREATE POLICY "admin_all" ON stats FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 3. programs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text,
  description text,
  icon       text,
  link       text,
  sort_order integer DEFAULT 0,
  published  boolean DEFAULT true
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON programs;
CREATE POLICY "public_read" ON programs FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON programs;
CREATE POLICY "admin_all" ON programs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 4. events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  description       text,
  date              date,
  end_date          date,
  time              text,
  location          text,
  address           text,
  type              text,          -- 'workshop'|'community-service'|'career'|'social'|'fundraiser'
  tags              text[],
  capacity          integer,
  registered        integer DEFAULT 0,
  status            text DEFAULT 'open',  -- 'open'|'waitlist'|'closed'
  image_url         text,
  lead_contact      jsonb,         -- { name, email, phone? }
  partners          jsonb,         -- Partner[]
  agenda            text[],
  what_you_will_do  text[],
  is_past           boolean DEFAULT false,
  is_past_override  boolean,       -- null = auto-derive from date, true/false = admin override
  recap             jsonb,         -- EventRecap { summary, volunteersCount, hoursServed, beneficiaries, gallery, quotes, attachments }
  published         boolean DEFAULT true,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Computed is_past: admin override wins, otherwise date < today
COMMENT ON COLUMN events.is_past_override IS 'null = auto (date < today), true/false = admin manual override';

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON events;
CREATE POLICY "public_read" ON events FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON events;
CREATE POLICY "admin_all" ON events FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- 5. event_volunteer_contacts
-- NOTE: public_read WHERE published=true so volunteers can see coordinator contact on EventDetail
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_volunteer_contacts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug          text REFERENCES events(slug) ON DELETE CASCADE,
  admin_name          text,
  admin_role          text,
  admin_wechat_id     text,
  admin_wechat_qr_url text,
  admin_contact_note  text,
  published           boolean DEFAULT false  -- admin explicitly enables per event
);

ALTER TABLE event_volunteer_contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON event_volunteer_contacts;
CREATE POLICY "public_read" ON event_volunteer_contacts FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON event_volunteer_contacts;
CREATE POLICY "admin_all" ON event_volunteer_contacts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 6. team_members
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text,
  role          text,
  bio           text,
  image_url     text,
  linked_in_url text,
  is_executive  boolean DEFAULT false,
  sort_order    integer DEFAULT 0,
  published     boolean DEFAULT true
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON team_members;
CREATE POLICY "public_read" ON team_members FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON team_members;
CREATE POLICY "admin_all" ON team_members FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 7. awards
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awards (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text,
  years            text[],
  description      text,
  eligibility      text,
  timeline         text,
  application_url  text,
  pdf_url          text,
  past_recipients  jsonb,   -- [{ name, year, achievement? }]
  published        boolean DEFAULT true
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON awards;
CREATE POLICY "public_read" ON awards FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON awards;
CREATE POLICY "admin_all" ON awards FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 8. annual_reports
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS annual_reports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year              integer,
  title             text,
  highlights        text[],
  cover_image_url   text,
  pdf_url           text,
  total_volunteers  integer,
  total_hours       integer,
  total_events      integer,
  published         boolean DEFAULT true
);

ALTER TABLE annual_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON annual_reports;
CREATE POLICY "public_read" ON annual_reports FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON annual_reports;
CREATE POLICY "admin_all" ON annual_reports FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 9. volunteer_roles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteer_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text,
  program     text,
  description text,
  commitment  text,
  skills      text[],
  tags        text[],
  published   boolean DEFAULT true
);

ALTER TABLE volunteer_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON volunteer_roles;
CREATE POLICY "public_read" ON volunteer_roles FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON volunteer_roles;
CREATE POLICY "admin_all" ON volunteer_roles FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 10. partners
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text,
  logo_url    text,
  website_url text,
  sort_order  integer DEFAULT 0,
  published   boolean DEFAULT true
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON partners;
CREATE POLICY "public_read" ON partners FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON partners;
CREATE POLICY "admin_all" ON partners FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 11. testimonials
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote     text,
  author    text,
  role      text,
  image_url text,
  published boolean DEFAULT true
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON testimonials;
CREATE POLICY "public_read" ON testimonials FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON testimonials;
CREATE POLICY "admin_all" ON testimonials FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 12. faqs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question   text,
  answer     text,
  category   text,
  sort_order integer DEFAULT 0,
  published  boolean DEFAULT true
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON faqs;
CREATE POLICY "public_read" ON faqs FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON faqs;
CREATE POLICY "admin_all" ON faqs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 13. contact_info
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_info (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text,   -- 'office'|'email'|'phone'|'press'
  title      text,
  value      text,
  icon       text,
  sort_order integer DEFAULT 0,
  published  boolean DEFAULT true
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON contact_info;
CREATE POLICY "public_read" ON contact_info FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON contact_info;
CREATE POLICY "admin_all" ON contact_info FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- 14. honours_carousel_entries
-- Fields match the frontend honours data shape exactly
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS honours_carousel_entries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  title            text,
  organization     text,
  tier             text,           -- e.g. 'Federal Recognition - 2025'
  initials         text,           -- 2-letter placeholder shown when no image
  accent           text,           -- hex color for card accent
  quote            text,           -- recognition quote text
  image_url        text,           -- portrait photo (optional)
  letter_image_url text,           -- scanned recognition letter (optional)
  year             integer,
  description      text,
  sort_order       integer DEFAULT 0,
  published        boolean DEFAULT true
);

ALTER TABLE honours_carousel_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON honours_carousel_entries;
CREATE POLICY "public_read" ON honours_carousel_entries FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "admin_all" ON honours_carousel_entries;
CREATE POLICY "admin_all" ON honours_carousel_entries FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- -----------------------------------------------------------------------------
-- Supabase Storage bucket (run separately or via Supabase dashboard)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('viva-media', 'viva-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "viva_media_public_read" ON storage.objects;
CREATE POLICY "viva_media_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'viva-media');

DROP POLICY IF EXISTS "viva_media_admin_insert" ON storage.objects;
CREATE POLICY "viva_media_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'viva-media' AND is_admin());

DROP POLICY IF EXISTS "viva_media_admin_update" ON storage.objects;
CREATE POLICY "viva_media_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'viva-media' AND is_admin())
  WITH CHECK (bucket_id = 'viva-media' AND is_admin());

DROP POLICY IF EXISTS "viva_media_admin_delete" ON storage.objects;
CREATE POLICY "viva_media_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'viva-media' AND is_admin());
