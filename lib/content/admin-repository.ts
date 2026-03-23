import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type HadithCollectionRow = Database["public"]["Tables"]["hadith_collections"]["Row"];
type KitabBookRow = Database["public"]["Tables"]["kitab_books"]["Row"];
type SurahRow = Database["public"]["Tables"]["surahs"]["Row"];
type HadithEntryRow = Database["public"]["Tables"]["hadith_entries"]["Row"];
type KitabChapterRow = Database["public"]["Tables"]["kitab_chapters"]["Row"];
type SurahAyahRow = Database["public"]["Tables"]["surah_ayahs"]["Row"];

export type HadithCollectionListItem = Pick<HadithCollectionRow, "slug" | "name" | "count_label" | "description">;
export type HadithEntryListItem = Pick<HadithEntryRow, "collection_slug" | "number" | "title" | "narrator" | "grade">;
export type KitabBookListItem = Pick<KitabBookRow, "slug" | "title" | "category" | "level" | "lessons_count">;
export type KitabChapterListItem = Pick<KitabChapterRow, "book_slug" | "slug" | "title" | "position" | "duration_label">;
export type SurahListItem = Pick<SurahRow, "slug" | "name" | "origin" | "position" | "verses_count">;
export type SurahAyahListItem = Pick<SurahAyahRow, "surah_slug" | "verse_number" | "translation">;

function ensure<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) throw new Error(`${context}: ${error.message}`);
  if (!data) throw new Error(`${context}: empty result`);
  return data;
}

function cleanQuery(value?: string): string {
  return (value ?? "").trim();
}

function safeIlike(value: string): string {
  return value.replace(/[,()]/g, " ").trim();
}

export async function getAdminHadithCollections(): Promise<HadithCollectionRow[]> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("hadith_collections").select("*").order("name", { ascending: true });
  return ensure(data, error, "Failed to load admin hadith collections");
}

export async function getAdminHadithCollectionBySlug(slug: string): Promise<HadithCollectionRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("hadith_collections").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load hadith collection (${slug}): ${error.message}`);
  return data;
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

export async function getAdminHadithCollectionsList(options?: {
  q?: string;
  limit?: number;
}): Promise<HadithCollectionListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin.from("hadith_collections").select("slug,name,count_label,description").order("name", { ascending: true }).limit(limit);

  if (q) {
    const key = safeIlike(q);
    query = query.or(`slug.ilike.%${key}%,name.ilike.%${key}%`);
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load hadith collection list") as HadithCollectionListItem[];
}

export async function getAdminHadithEntriesList(options?: {
  collectionSlug?: string;
  q?: string;
  limit?: number;
}): Promise<HadithEntryListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin
    .from("hadith_entries")
    .select("collection_slug,number,title,narrator,grade")
    .order("collection_slug", { ascending: true })
    .order("number", { ascending: true })
    .limit(limit);

  if (options?.collectionSlug) {
    query = query.eq("collection_slug", options.collectionSlug);
  }

  if (q) {
    const asNumber = Number(q);
    if (Number.isFinite(asNumber) && Number.isInteger(asNumber)) {
      query = query.eq("number", asNumber);
    } else {
      const key = safeIlike(q);
      query = query.or(`title.ilike.%${key}%,narrator.ilike.%${key}%`);
    }
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load hadith entry list") as HadithEntryListItem[];
}

export async function getAdminHadithEntryByKey(collectionSlug: string, number: number): Promise<HadithEntryRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("hadith_entries")
    .select("*")
    .eq("collection_slug", collectionSlug)
    .eq("number", number)
    .maybeSingle();

  if (error) throw new Error(`Failed to load hadith entry (${collectionSlug}/${number}): ${error.message}`);
  return data;
}

export async function getAdminKitabBooksList(options?: {
  category?: string;
  q?: string;
  limit?: number;
}): Promise<KitabBookListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin
    .from("kitab_books")
    .select("slug,title,category,level,lessons_count")
    .order("title", { ascending: true })
    .limit(limit);

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (q) {
    const key = safeIlike(q);
    query = query.or(`slug.ilike.%${key}%,title.ilike.%${key}%`);
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load kitab book list") as KitabBookListItem[];
}

export async function getAdminKitabBookBySlug(slug: string): Promise<KitabBookRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("kitab_books").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load kitab book (${slug}): ${error.message}`);
  return data;
}

export async function getAdminKitabChaptersList(options?: {
  bookSlug?: string;
  q?: string;
  limit?: number;
}): Promise<KitabChapterListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin
    .from("kitab_chapters")
    .select("book_slug,slug,title,position,duration_label")
    .order("book_slug", { ascending: true })
    .order("position", { ascending: true })
    .limit(limit);

  if (options?.bookSlug) {
    query = query.eq("book_slug", options.bookSlug);
  }

  if (q) {
    const key = safeIlike(q);
    query = query.or(`slug.ilike.%${key}%,title.ilike.%${key}%`);
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load kitab chapter list") as KitabChapterListItem[];
}

export async function getAdminKitabChapterByKey(bookSlug: string, slug: string): Promise<KitabChapterRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("kitab_chapters")
    .select("*")
    .eq("book_slug", bookSlug)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load kitab chapter (${bookSlug}/${slug}): ${error.message}`);
  return data;
}

export async function getAdminSurahsList(options?: {
  origin?: string;
  q?: string;
  limit?: number;
}): Promise<SurahListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin
    .from("surahs")
    .select("slug,name,origin,position,verses_count")
    .order("position", { ascending: true })
    .limit(limit);

  if (options?.origin) {
    query = query.eq("origin", options.origin);
  }

  if (q) {
    const key = safeIlike(q);
    query = query.or(`slug.ilike.%${key}%,name.ilike.%${key}%`);
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load surah list") as SurahListItem[];
}

export async function getAdminSurahBySlug(slug: string): Promise<SurahRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("surahs").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load surah (${slug}): ${error.message}`);
  return data;
}

export async function getAdminSurahAyahsList(options?: {
  surahSlug?: string;
  q?: string;
  limit?: number;
}): Promise<SurahAyahListItem[]> {
  const admin = createAdminSupabaseClient();
  const q = cleanQuery(options?.q);
  const limit = options?.limit ?? 50;

  let query = admin
    .from("surah_ayahs")
    .select("surah_slug,verse_number,translation")
    .order("surah_slug", { ascending: true })
    .order("verse_number", { ascending: true })
    .limit(limit);

  if (options?.surahSlug) {
    query = query.eq("surah_slug", options.surahSlug);
  }

  if (q) {
    const asNumber = Number(q);
    if (Number.isFinite(asNumber) && Number.isInteger(asNumber)) {
      query = query.eq("verse_number", asNumber);
    } else {
      const key = safeIlike(q);
      query = query.ilike("translation", `%${key}%`);
    }
  }

  const { data, error } = await query;
  return ensure(data, error, "Failed to load surah ayah list") as SurahAyahListItem[];
}

export async function getAdminSurahAyahByKey(surahSlug: string, verseNumber: number): Promise<SurahAyahRow | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("surah_ayahs")
    .select("*")
    .eq("surah_slug", surahSlug)
    .eq("verse_number", verseNumber)
    .maybeSingle();
  if (error) throw new Error(`Failed to load surah ayah (${surahSlug}:${verseNumber}): ${error.message}`);
  return data;
}
