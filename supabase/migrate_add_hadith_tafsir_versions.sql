alter table public.hadith_entries
  add column if not exists tafsir_versions jsonb not null default '[]'::jsonb;
