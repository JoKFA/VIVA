# VIVA — Volunteer Impact & Vitality Alliance

Official website for VIVA, a Vancouver-based nonprofit organization connecting volunteers with community service opportunities. The site serves as the organization's public face and includes a password-protected admin panel for the internal team to manage all content without writing code.

**Live site:** [vivahq.org](https://vivahq.org)

---

## What This Project Is

A full website built for VIVA — public-facing pages for visitors plus a content management system (CMS) for the VIVA team. Everything visible on the website (events, team members, awards, volunteer roles, site stats, and more) is managed through the admin panel and stored in a database. No code changes are needed for day-to-day content updates.

---

## Public Website

The site visitors see, organized by page:

| Page | Path | What it shows |
|---|---|---|
| Home | `/` | Hero, programs overview, upcoming events, volunteer CTA |
| About | `/about` | Mission, organization history, honours wall |
| Board | `/about/board` | Executive team with photos and bios |
| Awards | `/about/awards` | Annual scholarship and award recipients |
| Annual Reports | `/about/reports` | Downloadable PDF reports by year |
| Events | `/events` | Upcoming and past events with filters |
| Calendar | `/events/calendar` | Monthly calendar view of events |
| Event Detail | `/events/:slug` | Full event page with registration info |
| Volunteer | `/volunteer` | Volunteer roles and application form |
| Contact | `/contact` | Contact form, address, phone, email |
| Donate | `/donate` | Donation page with external payment link |
| FAQs | `/faqs` | Frequently asked questions |

---

## Admin Panel

The admin panel lives at `/admin` and is only accessible with a VIVA team login. It lets the team manage all website content through a simple interface — no technical knowledge required for everyday tasks.

**What admins can manage:**

- **Events** — Create, edit, publish/unpublish events. Add recap stats after an event wraps up.
- **Team Members** — Add or update board member photos, bios, and LinkedIn links.
- **Awards** — Record annual award and scholarship recipients.
- **Annual Reports** — Upload PDF reports for each year.
- **Volunteer Roles** — Edit the roles shown on the Volunteer page.
- **Partners** — Manage partner/sponsor logos and links.
- **Testimonials** — Add quotes displayed on the site.
- **FAQs** — Edit the frequently asked questions page.
- **Contact Info** — Update the organization's phone, email, and address.
- **Stats** — Set the impact numbers shown on the homepage.
- **Homepage Hero** — Edit the homepage headline, subtext, and stats.
- **Programs** — Edit the program sections on the homepage.
- **Honours** — Manage the honours/recognition wall.
- **Site Settings** — Organization name, donation link, social media URLs, and page visibility toggles.

All admin actions require a verified VIVA team account. Unauthenticated visitors are redirected to the login page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router 7 |
| Database & Auth | Supabase (PostgreSQL + Row-Level Security) |
| File storage | Supabase Storage |
| Email (contact forms) | Resend API |
| Hosting | Vercel |
| Analytics | Vercel Analytics |

---

## Project Structure

```
VIVACodebase/
├── api/
│   └── contact.ts          # Serverless function — handles all contact form emails
├── src/
│   ├── admin/
│   │   ├── components/     # Admin UI (layout, auth guard, media uploader)
│   │   └── pages/          # One file per admin section (Events, Team, Settings, …)
│   ├── components/
│   │   ├── blocks/         # Reusable page sections (hero, stat cards, etc.)
│   │   ├── events/         # Event-specific components
│   │   ├── layout/         # Header, footer, page layout wrapper
│   │   └── ui/             # Low-level UI pieces (buttons, cards, badges, etc.)
│   ├── contexts/           # React context (site settings loaded from DB)
│   ├── data/               # Fallback mock data (used when DB is unavailable)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Supabase client setup
│   ├── pages/              # Public-facing route pages
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Utility functions (dates, formatting, etc.)
├── supabase/
│   └── schema.sql          # Full database schema — run this to set up a new project
├── DESIGN.md               # Design system reference (colors, typography, layouts)
├── TODO.md                 # Known tasks and deferred work
└── vercel.json             # Vercel deployment config
```

---

## Developer Setup

These steps are for the VIVA IT team or anyone setting up a local development environment.

### 1. Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A Supabase project ([supabase.com](https://supabase.com)) — free tier is enough for development

### 2. Clone and install

```bash
git clone <repository-url>
cd VIVACodebase
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Get these values from your Supabase project: **Project Settings → API → Project URL and anon key**.

> If these variables are missing, the dev server will show an error overlay. The variables must be set before the site will load locally.

### 4. Set up the database

Run `supabase/schema.sql` against your Supabase project. You can do this from the Supabase dashboard under **SQL Editor**, or using the Supabase CLI:

```bash
supabase db push
```

### 5. Create an admin user

In the Supabase dashboard:
1. Go to **Authentication → Users → Invite user** and create a team email account.
2. In the **SQL Editor**, run:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"user_role": "admin"}'::jsonb
where email = 'your-team-email@example.com';
```

This grants admin access to that account. Without this step, the account can log in but will be rejected by the admin panel.

### 6. Configure email (contact forms)

The contact form emails are sent via [Resend](https://resend.com). You need:

- A Resend API key
- A verified sending domain (or use the Resend sandbox for testing)

For Vercel deployment, set these in the Vercel project environment variables:

```
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=noreply@yourdomain.com
CONTACT_TO_EMAIL=admin@vivahq.org
```

For local testing of the contact API, set these in `.env.local` as well.

### 7. Start the development server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

---

## Deployment

The site deploys automatically to Vercel on every push to the `main` branch.

Environment variables are set in the Vercel project dashboard — the same Supabase and Resend keys as listed above. The Vercel Supabase integration can inject them automatically if enabled under the project's integrations settings.

To deploy manually:

```bash
npm run build    # Build for production
npm run preview  # Preview the production build locally
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Design Reference

See [`DESIGN.md`](DESIGN.md) for the full design system: colors, typography, component patterns, and page layout specifications. All visual decisions are documented there — follow it when building or modifying any UI.

---

## License

Proprietary. This codebase is owned by the VIVA organization.
