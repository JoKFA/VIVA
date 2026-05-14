# TODO

## Public Policy Pages

- [ ] Add `/privacy` once approved Privacy Policy copy is available.
  - Re-add the footer link after the page exists.
  - Avoid placeholder legal text.

- [ ] Add `/accessibility` once approved Accessibility Statement copy is available.
  - Re-add the footer link after the page exists.
  - Include contact path for accessibility issues.

- [ ] Add `/code-of-conduct` once approved Code of Conduct copy is available.
  - Re-add the footer link after the page exists.
  - Align with volunteer expectations already referenced on the Volunteer page.

## Developer Setup

- [ ] Add `.env.example` and README setup notes for Supabase local development.
  - Required client vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or the Vercel Supabase integration aliases supported by `vite.config.ts`.
  - Explain that local dev will show a Vite error overlay when Supabase env vars are missing.

## API Tests

- [ ] Add Vitest unit tests for `api/contact.ts`.
  - Mock `IncomingMessage`/`ServerResponse` and the `fetch` call to Resend.
  - Cover: origin block (403), honeypot pass-through (200 silent), rate limit (429),
    body too large (413), missing env vars (500), invalid email (400), success (200).
  - This file has zero automated coverage; tests will catch regressions on every future edit.

## Admin QA

- [ ] Run write-path QA against a Supabase branch or explicit throwaway records.
  - Cover create/edit/delete event.
  - Cover publish/unpublish toggles.
  - Cover global event volunteer contact save.
  - Cover media upload and removal.
  - Cover site settings save.

- [ ] Add accessible names to admin icon-only edit/delete buttons.
  - Use `aria-label` values such as `Edit event`, `Delete event`, `Edit team member`, and `Delete team member`.
  - Verify with a browser accessibility snapshot.
