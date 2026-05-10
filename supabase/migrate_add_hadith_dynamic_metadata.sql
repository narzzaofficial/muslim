alter table public.hadith_entries
  add column if not exists sanad_nodes jsonb not null default '[]'::jsonb;

alter table public.hadith_entries
  add column if not exists author_qa jsonb not null default '[]'::jsonb;

alter table public.hadith_entries
  add column if not exists tags jsonb not null default '[]'::jsonb;

alter table public.hadith_entries
  add column if not exists related_hadith jsonb not null default '[]'::jsonb;
