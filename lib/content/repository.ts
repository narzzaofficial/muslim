import "server-only";

import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Ayah, HadithCollection, HadithItem, KitabBook, KitabChapter, PrayerItem, Surah } from "@/lib/content/types";
import type { Database } from "@/lib/supabase/types";

type PrayerRow = Database["public"]["Tables"]["prayer_schedule"]["Row"];
type HadithCollectionRow = Database["public"]["Tables"]["hadith_collections"]["Row"];
type HadithEntryRow = Database["public"]["Tables"]["hadith_entries"]["Row"];
type KitabBookRow = Database["public"]["Tables"]["kitab_books"]["Row"];
type KitabChapterRow = Database["public"]["Tables"]["kitab_chapters"]["Row"];
type SurahRow = Database["public"]["Tables"]["surahs"]["Row"];
type SurahAyahRow = Database["public"]["Tables"]["surah_ayahs"]["Row"];

function ensureData<T>(data: T | null, error: { message: string } | null, context: string): T {
  if (error) {
    if (error.message.includes("Could not find the table")) {
      throw new Error(`${context}: ${error.message}. Jalankan supabase/schema.sql lalu supabase/seed.sql di SQL Editor.`);
    }
    throw new Error(`${context}: ${error.message}`);
  }
  if (!data) {
    throw new Error(`${context}: empty result`);
  }
  return data;
}

export const getPrayerSchedule = unstable_cache(
  async (): Promise<PrayerItem[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("prayer_schedule").select("name,time_label,status,position").order("position", { ascending: true });
    const rows = ensureData(data as PrayerRow[] | null, error, "Failed to load prayer schedule");

    return rows.map((row) => ({
      name: row.name,
      time: row.time_label,
      status: row.status ?? undefined,
    }));
  },
  ["prayer-schedule"],
  { tags: ["prayer-schedule"], revalidate: 60 * 60 },
);

export const getHadithCollections = unstable_cache(
  async (): Promise<HadithCollection[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("hadith_collections").select("slug,name,count_label,description").order("name", { ascending: true });
    const rows = ensureData(data as HadithCollectionRow[] | null, error, "Failed to load hadith collections");

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      count: row.count_label,
      description: row.description,
    }));
  },
  ["hadith-collections"],
  { tags: ["hadith-collections"], revalidate: 60 * 60 * 24 * 7 },
);

export const getHadithCollectionBySlug = unstable_cache(
  async (slug: string): Promise<HadithCollection> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("hadith_collections").select("slug,name,count_label,description").eq("slug", slug).maybeSingle();
    const row = ensureData(data as HadithCollectionRow | null, error, `Hadith collection not found (${slug})`);

    return {
      slug: row.slug,
      name: row.name,
      count: row.count_label,
      description: row.description,
    };
  },
  ["hadith-collection-by-slug"],
  { tags: ["hadith-collections"], revalidate: 60 * 60 * 24 * 7 },
);

export const getHadithItemsByCollection = unstable_cache(
  async (collectionSlug: string): Promise<HadithItem[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("hadith_entries")
      .select("number,title,narrator,grade,arabic_text,translation,summary")
      .eq("collection_slug", collectionSlug)
      .order("number", { ascending: true });

    const rows = ensureData(data as HadithEntryRow[] | null, error, `Failed to load hadith entries (${collectionSlug})`);

    return rows.map((row) => ({
      number: row.number,
      title: row.title,
      narrator: row.narrator,
      grade: row.grade,
      arabicText: row.arabic_text,
      translation: row.translation,
      summary: row.summary,
    }));
  },
  ["hadith-items-by-collection"],
  { tags: ["hadith-entries"], revalidate: 60 * 60 * 24 * 30 },
);

export const getKitabBooks = unstable_cache(
  async (): Promise<KitabBook[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("kitab_books")
      .select("slug,title,category,level,lessons_count,cover_image,description")
      .order("title", { ascending: true });

    const rows = ensureData(data as KitabBookRow[] | null, error, "Failed to load kitab books");

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      level: row.level,
      lessons: row.lessons_count,
      coverImage: row.cover_image,
      description: row.description,
    }));
  },
  ["kitab-books"],
  { tags: ["kitab-books"], revalidate: 60 * 60 * 24 * 30 },
);

export const getKitabBookBySlug = unstable_cache(
  async (slug: string): Promise<KitabBook> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("kitab_books")
      .select("slug,title,category,level,lessons_count,cover_image,description")
      .eq("slug", slug)
      .maybeSingle();

    const row = ensureData(data as KitabBookRow | null, error, `Kitab book not found (${slug})`);

    return {
      slug: row.slug,
      title: row.title,
      category: row.category,
      level: row.level,
      lessons: row.lessons_count,
      coverImage: row.cover_image,
      description: row.description,
    };
  },
  ["kitab-book-by-slug"],
  { tags: ["kitab-books"], revalidate: 60 * 60 * 24 * 30 },
);

export const getKitabChaptersByBook = unstable_cache(
  async (bookSlug: string): Promise<KitabChapter[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("kitab_chapters")
      .select("slug,title,duration_label,position,arabic_text,translation,explanation")
      .eq("book_slug", bookSlug)
      .order("position", { ascending: true });

    const rows = ensureData(data as KitabChapterRow[] | null, error, `Failed to load kitab chapters (${bookSlug})`);

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      duration: row.duration_label,
      arabicText: row.arabic_text,
      translation: row.translation,
      explanation: row.explanation,
    }));
  },
  ["kitab-chapters-by-book"],
  { tags: ["kitab-chapters"], revalidate: 60 * 60 * 24 * 30 },
);

export const getKitabChapterBySlug = unstable_cache(
  async (bookSlug: string, chapterSlug: string): Promise<KitabChapter> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("kitab_chapters")
      .select("slug,title,duration_label,arabic_text,translation,explanation")
      .eq("book_slug", bookSlug)
      .eq("slug", chapterSlug)
      .maybeSingle();

    const row = ensureData(data as KitabChapterRow | null, error, `Kitab chapter not found (${bookSlug}/${chapterSlug})`);

    return {
      slug: row.slug,
      title: row.title,
      duration: row.duration_label,
      arabicText: row.arabic_text,
      translation: row.translation,
      explanation: row.explanation,
    };
  },
  ["kitab-chapter-by-slug"],
  { tags: ["kitab-chapters"], revalidate: 60 * 60 * 24 * 30 },
);

export const getSurahList = unstable_cache(
  async (): Promise<Surah[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("surahs").select("slug,name,arabic,verses_count,origin,position").order("position", { ascending: true });
    const rows = ensureData(data as SurahRow[] | null, error, "Failed to load surah list");

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      arabic: row.arabic,
      verses: row.verses_count,
      origin: row.origin,
    }));
  },
  ["surah-list"],
  { tags: ["surah-list"], revalidate: 60 * 60 * 24 * 30 },
);

export const getSurahBySlug = unstable_cache(
  async (slug: string): Promise<Surah> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("surahs").select("slug,name,arabic,verses_count,origin").eq("slug", slug).maybeSingle();
    const row = ensureData(data as SurahRow | null, error, `Surah not found (${slug})`);

    return {
      slug: row.slug,
      name: row.name,
      arabic: row.arabic,
      verses: row.verses_count,
      origin: row.origin,
    };
  },
  ["surah-by-slug"],
  { tags: ["surah-list"], revalidate: 60 * 60 * 24 * 30 },
);

export const getAyahsBySurah = unstable_cache(
  async (surahSlug: string): Promise<Ayah[]> => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("surah_ayahs")
      .select("verse_number,arabic_text,translation,tafsir")
      .eq("surah_slug", surahSlug)
      .order("verse_number", { ascending: true });

    const rows = ensureData(data as SurahAyahRow[] | null, error, `Failed to load ayahs (${surahSlug})`);

    return rows.map((row) => ({
      number: row.verse_number,
      arabic: row.arabic_text,
      translation: row.translation,
      tafsir: row.tafsir,
    }));
  },
  ["ayahs-by-surah"],
  { tags: ["surah-ayahs"], revalidate: 60 * 60 * 24 * 30 },
);

