-- Core tables for read-only public content with admin-authenticated updates.

create table if not exists public.prayer_schedule (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  time_label text not null,
  status text check (status in ('next', 'done')),
  position integer not null unique
);

create table if not exists public.hadith_collections (
  slug text primary key,
  name text not null,
  count_label text not null,
  description text not null
);

create table if not exists public.hadith_entries (
  id uuid primary key default gen_random_uuid(),
  collection_slug text not null references public.hadith_collections(slug) on delete cascade,
  number integer not null,
  title text not null,
  narrator text not null,
  grade text not null,
  arabic_text text,
  translation text,
  summary text,
  unique (collection_slug, number)
);

create index if not exists idx_hadith_entries_collection_number
  on public.hadith_entries (collection_slug, number);

create table if not exists public.kitab_books (
  slug text primary key,
  title text not null,
  category text not null,
  level text not null,
  lessons_count integer not null default 0,
  cover_image text not null,
  description text not null
);

create table if not exists public.kitab_chapters (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null references public.kitab_books(slug) on delete cascade,
  slug text not null,
  title text not null,
  duration_label text not null,
  position integer not null,
  arabic_text text,
  translation text,
  explanation text,
  unique (book_slug, slug),
  unique (book_slug, position)
);

create index if not exists idx_kitab_chapters_book_position
  on public.kitab_chapters (book_slug, position);

create table if not exists public.surahs (
  slug text primary key,
  name text not null,
  arabic text not null,
  verses_count integer not null,
  origin text not null,
  position integer not null unique
);

create table if not exists public.surah_ayahs (
  id uuid primary key default gen_random_uuid(),
  surah_slug text not null references public.surahs(slug) on delete cascade,
  verse_number integer not null,
  arabic_text text not null,
  translation text not null,
  tafsir text,
  unique (surah_slug, verse_number)
);

create index if not exists idx_surah_ayahs_slug_verse
  on public.surah_ayahs (surah_slug, verse_number);

alter table public.prayer_schedule enable row level security;
alter table public.hadith_collections enable row level security;
alter table public.hadith_entries enable row level security;
alter table public.kitab_books enable row level security;
alter table public.kitab_chapters enable row level security;
alter table public.surahs enable row level security;
alter table public.surah_ayahs enable row level security;

drop policy if exists "public read prayer_schedule" on public.prayer_schedule;
create policy "public read prayer_schedule"
on public.prayer_schedule for select
to anon, authenticated
using (true);

drop policy if exists "public read hadith_collections" on public.hadith_collections;
create policy "public read hadith_collections"
on public.hadith_collections for select
to anon, authenticated
using (true);

drop policy if exists "public read hadith_entries" on public.hadith_entries;
create policy "public read hadith_entries"
on public.hadith_entries for select
to anon, authenticated
using (true);

drop policy if exists "public read kitab_books" on public.kitab_books;
create policy "public read kitab_books"
on public.kitab_books for select
to anon, authenticated
using (true);

drop policy if exists "public read kitab_chapters" on public.kitab_chapters;
create policy "public read kitab_chapters"
on public.kitab_chapters for select
to anon, authenticated
using (true);

drop policy if exists "public read surahs" on public.surahs;
create policy "public read surahs"
on public.surahs for select
to anon, authenticated
using (true);

drop policy if exists "public read surah_ayahs" on public.surah_ayahs;
create policy "public read surah_ayahs"
on public.surah_ayahs for select
to anon, authenticated
using (true);
