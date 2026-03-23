import "server-only";

import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Ayah, HadithCollection, HadithItem, HadithTafsirVersion, KitabBook, KitabChapter, PrayerItem, Surah } from "@/lib/content/types";
import type { Database } from "@/lib/supabase/types";

type HadithCollectionRow = Database["public"]["Tables"]["hadith_collections"]["Row"];
type HadithEntryRow = Database["public"]["Tables"]["hadith_entries"]["Row"];
type KitabBookRow = Database["public"]["Tables"]["kitab_books"]["Row"];
type KitabChapterRow = Database["public"]["Tables"]["kitab_chapters"]["Row"];
type SurahRow = Database["public"]["Tables"]["surahs"]["Row"];
type SurahAyahRow = Database["public"]["Tables"]["surah_ayahs"]["Row"];

type AladhanResponse = {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
    meta: {
      timezone: string;
    };
  };
};

export type PrayerScheduleResult = {
  schedule: PrayerItem[];
  timezone: string;
};

const prayerOrder = [
  { key: "Fajr", name: "Subuh" },
  { key: "Dhuhr", name: "Dzuhur" },
  { key: "Asr", name: "Ashar" },
  { key: "Maghrib", name: "Maghrib" },
  { key: "Isha", name: "Isya" },
] as const;

const fallbackTimings: Record<(typeof prayerOrder)[number]["key"], string> = {
  Fajr: "04:50",
  Dhuhr: "12:10",
  Asr: "15:20",
  Maghrib: "18:10",
  Isha: "19:20",
};

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

function parseHadithTafsirVersions(value: Database["public"]["Tables"]["hadith_entries"]["Row"]["tafsir_versions"]): HadithTafsirVersion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }
      const source = typeof item["source"] === "string" ? item["source"] : "";
      const sourceKey = typeof item["sourceKey"] === "string" ? item["sourceKey"] : "";
      const content = typeof item["content"] === "string" ? item["content"] : "";
      if (!source || !sourceKey || !content) {
        return null;
      }
      return { source, sourceKey, content };
    })
    .filter((item): item is HadithTafsirVersion => item !== null);
}

function getPrayerConfig() {
  return {
    city: process.env.ALADHAN_CITY?.trim() || "Makassar",
    country: process.env.ALADHAN_COUNTRY?.trim() || "Indonesia",
    method: process.env.ALADHAN_METHOD?.trim() || "11",
    school: process.env.ALADHAN_SCHOOL?.trim() || "0",
    tune: process.env.ALADHAN_TUNE?.trim() || "0,0,0,0,0,0,0,0,0",
    timezone: process.env.ALADHAN_TIMEZONE?.trim() || "Asia/Makassar",
  };
}

function extractTime(value: string | undefined) {
  if (!value) {
    return "00:00";
  }
  const cleaned = value.trim();
  const match = cleaned.match(/^\d{1,2}:\d{2}/);
  return match ? match[0].padStart(5, "0") : "00:00";
}

function minutesFromTime(value: string) {
  const [h, m] = value.split(":").map((part) => Number(part));
  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    return 0;
  }
  return h * 60 + m;
}

function getCurrentMinutesInTimezone(timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function buildPrayerScheduleFromTimings(timings: Record<string, string>, timezone: string): PrayerItem[] {
  const currentMinutes = getCurrentMinutesInTimezone(timezone);
  const schedule = prayerOrder.map((item) => {
    const time = extractTime(timings[item.key]);
    return {
      name: item.name,
      time,
      minutes: minutesFromTime(time),
    };
  });

  let nextIndex = schedule.findIndex((item) => currentMinutes < item.minutes);
  if (nextIndex === -1) {
    nextIndex = 0;
  }

  return schedule.map((item, index) => ({
    name: item.name,
    time: item.time,
    status: index === nextIndex ? "next" : "done",
  }));
}

async function fetchAladhanTimings(url: string): Promise<PrayerScheduleResult> {
  const config = getPrayerConfig();

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Aladhan responded with ${response.status}`);
    }

    const payload = (await response.json()) as AladhanResponse;
    if (payload.code !== 200 || !payload.data?.timings) {
      throw new Error(`Invalid Aladhan payload: ${payload.status}`);
    }

    const timezone = payload.data.meta?.timezone || config.timezone;
    return {
      schedule: buildPrayerScheduleFromTimings(payload.data.timings, timezone),
      timezone,
    };
  } catch {
    return {
      schedule: buildPrayerScheduleFromTimings(fallbackTimings, config.timezone),
      timezone: config.timezone,
    };
  }
}

export async function getPrayerScheduleByCoordinates(latitude: number, longitude: number): Promise<PrayerScheduleResult> {
  const config = getPrayerConfig();
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    method: config.method,
    school: config.school,
    tune: config.tune,
  });
  const url = `https://api.aladhan.com/v1/timings?${params.toString()}`;
  return fetchAladhanTimings(url);
}

export async function getPrayerSchedule(): Promise<PrayerItem[]> {
  const config = getPrayerConfig();
  const params = new URLSearchParams({
    city: config.city,
    country: config.country,
    method: config.method,
    school: config.school,
    tune: config.tune,
  });
  const url = `https://api.aladhan.com/v1/timingsByCity?${params.toString()}`;
  const result = await fetchAladhanTimings(url);
  return result.schedule;
}

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

    let { data, error } = await supabase
      .from("hadith_entries")
      .select("number,title,narrator,grade,arabic_text,translation,summary,tafsir_versions")
      .eq("collection_slug", collectionSlug)
      .order("number", { ascending: true });

    if (error?.message?.includes("tafsir_versions")) {
      const fallbackResult = await supabase
        .from("hadith_entries")
        .select("number,title,narrator,grade,arabic_text,translation,summary")
        .eq("collection_slug", collectionSlug)
        .order("number", { ascending: true });
      data = fallbackResult.data as (HadithEntryRow & { tafsir_versions?: Database["public"]["Tables"]["hadith_entries"]["Row"]["tafsir_versions"] })[] | null;
      error = fallbackResult.error;
    }

    const rows = ensureData(data as HadithEntryRow[] | null, error, `Failed to load hadith entries (${collectionSlug})`);

    return rows.map((row) => ({
      number: row.number,
      title: row.title,
      narrator: row.narrator,
      grade: row.grade,
      arabicText: row.arabic_text,
      translation: row.translation,
      summary: row.summary,
      tafsirVersions: parseHadithTafsirVersions("tafsir_versions" in row ? row.tafsir_versions : []),
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

