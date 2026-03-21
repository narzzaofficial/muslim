import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type HadithCollectionRow = Database["public"]["Tables"]["hadith_collections"]["Row"];
type KitabBookRow = Database["public"]["Tables"]["kitab_books"]["Row"];
type SurahRow = Database["public"]["Tables"]["surahs"]["Row"];
type HadithEntryRow = Database["public"]["Tables"]["hadith_entries"]["Row"];
type KitabChapterRow = Database["public"]["Tables"]["kitab_chapters"]["Row"];
type SurahAyahRow = Database["public"]["Tables"]["surah_ayahs"]["Row"];

function ensure<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`${context}: ${error.message}`);
  if (!data) throw new Error(`${context}: empty result`);
  return data;
}

export async function getAdminHadithCollections(): Promise<HadithCollectionRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("hadith_collections").select("*").order("name", { ascending: true });
  return ensure(data, error, "Failed to load admin hadith collections");
}

export async function getAdminKitabBooks(): Promise<KitabBookRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("kitab_books").select("*").order("title", { ascending: true });
  return ensure(data, error, "Failed to load admin kitab books");
}

export async function getAdminSurahs(): Promise<SurahRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("surahs").select("*").order("position", { ascending: true });
  return ensure(data, error, "Failed to load admin surahs");
}

export async function getAdminRecentHadithEntries(limit = 20): Promise<HadithEntryRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("hadith_entries")
    .select("*")
    .order("collection_slug", { ascending: true })
    .order("number", { ascending: true })
    .limit(limit);
  return ensure(data, error, "Failed to load admin hadith entries");
}

export async function getAdminRecentKitabChapters(limit = 20): Promise<KitabChapterRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("kitab_chapters")
    .select("*")
    .order("book_slug", { ascending: true })
    .order("position", { ascending: true })
    .limit(limit);
  return ensure(data, error, "Failed to load admin kitab chapters");
}

export async function getAdminRecentSurahAyahs(limit = 20): Promise<SurahAyahRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("surah_ayahs")
    .select("*")
    .order("surah_slug", { ascending: true })
    .order("verse_number", { ascending: true })
    .limit(limit);
  return ensure(data, error, "Failed to load admin surah ayahs");
}
