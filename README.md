# Muslim Web (Next.js 16 + Supabase)

A static-first Islamic reading app (Hadist, Kitab, Qur'an) with:
- Supabase as the content database
- Admin-only authentication (for content operations)
- SSG + ISR for public pages
- Self-host friendly architecture (VM + Nginx + Cloudflare optional)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## Environment Variables

Copy `.env.example` to `.env.local` and fill it:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_REVALIDATE_TOKEN`

Optional (Prayer Times via Aladhan API):

- `ALADHAN_CITY` (default: `Makassar`)
- `ALADHAN_COUNTRY` (default: `Indonesia`)
- `ALADHAN_METHOD` (default: `11`)
- `ALADHAN_SCHOOL` (default: `0`)
- `ALADHAN_TUNE` (default: `0,0,0,0,0,0,0,0,0`)
- `ALADHAN_TIMEZONE` (default: `Asia/Makassar`)

## Supabase Setup

1. Open Supabase SQL editor.
2. Run [`supabase/schema.sql`](supabase/schema.sql).
3. Run [`supabase/seed.sql`](supabase/seed.sql).
4. Create one admin user in Supabase Auth (Email/Password).
5. If your database already exists, run [`supabase/migrate_add_hadith_tafsir_versions.sql`](supabase/migrate_add_hadith_tafsir_versions.sql).

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin login:

- `http://localhost:3000/admin/login`

## Rendering Strategy

- SSG (mostly static): `/`, `/hadist`, `/kitab`, `/quran`
- ISR (rare updates):
  - `/hadist/[collection]` (7 days)
  - `/hadist/[collection]/[number]` (30 days)
  - `/kitab/[slug]` (30 days)
  - `/kitab/[slug]/[chapter]` (30 days)
  - `/quran/[surah]` (30 days)
- SSR dynamic (admin only): `/admin/*`

## Revalidation

- Admin panel can revalidate all public pages.
- API endpoint available at `POST /api/admin/revalidate` with bearer token `ADMIN_REVALIDATE_TOKEN`.

## Notes

- Prayer times are fetched live from Aladhan API (`/v1/timingsByCity`) using the optional env vars above.
- Other public pages read content from Supabase tables.

