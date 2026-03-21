"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const cacheTags = [
  "prayer-schedule",
  "hadith-collections",
  "hadith-entries",
  "kitab-books",
  "kitab-chapters",
  "surah-list",
  "surah-ayahs",
] as const;

const revalidatePaths = [
  "/",
  "/hadist",
  "/kitab",
  "/quran",
  "/hadist/[collection]",
  "/hadist/[collection]/[number]",
  "/kitab/[slug]",
  "/kitab/[slug]/[chapter]",
  "/quran/[surah]",
] as const;

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Login gagal. Periksa email/password admin.")}`);
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdminSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=Session%20habis.%20Silakan%20login%20lagi.");
  }
}

export async function updatePrayerScheduleAction(formData: FormData) {
  await requireAdminSession();

  const rows = [1, 2, 3, 4, 5].map((position) => {
    const name = String(formData.get(`name_${position}`) ?? "").trim();
    const time = String(formData.get(`time_${position}`) ?? "").trim();
    const statusRaw = String(formData.get(`status_${position}`) ?? "").trim();

    if (!name || !time) {
      throw new Error("Nama shalat dan jam wajib diisi.");
    }

    return {
      name,
      time_label: time,
      status: statusRaw === "" ? null : statusRaw,
      position,
    };
  });

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("prayer_schedule").upsert(rows, { onConflict: "name" });
  if (error) {
    throw new Error(`Gagal menyimpan jadwal shalat: ${error.message}`);
  }

  revalidateTag("prayer-schedule", "max");
  revalidatePath("/");
  redirect("/admin/prayer?saved=1");
}

function requiredString(formData: FormData, key: string): string {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) {
    throw new Error(`Field ${key} wajib diisi.`);
  }
  return value;
}

function requiredNumber(formData: FormData, key: string): number {
  const value = Number(String(formData.get(key) ?? "").trim());
  if (!Number.isFinite(value)) {
    throw new Error(`Field ${key} harus angka valid.`);
  }
  return value;
}

export async function upsertHadithCollectionAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    slug: requiredString(formData, "slug"),
    name: requiredString(formData, "name"),
    count_label: requiredString(formData, "count_label"),
    description: requiredString(formData, "description"),
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("hadith_collections").upsert(payload, { onConflict: "slug" });
  if (error) {
    throw new Error(`Gagal menyimpan koleksi hadith: ${error.message}`);
  }

  revalidateTag("hadith-collections", "max");
  revalidatePath("/hadist");
  revalidatePath(`/hadist/${payload.slug}`);
  redirect("/admin/hadith-collections?saved=1");
}

export async function upsertHadithEntryAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    collection_slug: requiredString(formData, "collection_slug"),
    number: requiredNumber(formData, "number"),
    title: requiredString(formData, "title"),
    narrator: requiredString(formData, "narrator"),
    grade: requiredString(formData, "grade"),
    arabic_text: String(formData.get("arabic_text") ?? "").trim() || null,
    translation: String(formData.get("translation") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("hadith_entries").upsert(payload, { onConflict: "collection_slug,number" });
  if (error) {
    throw new Error(`Gagal menyimpan entry hadith: ${error.message}`);
  }

  revalidateTag("hadith-entries", "max");
  revalidatePath("/hadist");
  revalidatePath(`/hadist/${payload.collection_slug}`);
  revalidatePath(`/hadist/${payload.collection_slug}/${payload.number}`);
  redirect("/admin/hadith-entries?saved=1");
}

export async function upsertKitabBookAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    slug: requiredString(formData, "slug"),
    title: requiredString(formData, "title"),
    category: requiredString(formData, "category"),
    level: requiredString(formData, "level"),
    lessons_count: requiredNumber(formData, "lessons_count"),
    cover_image: requiredString(formData, "cover_image"),
    description: requiredString(formData, "description"),
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("kitab_books").upsert(payload, { onConflict: "slug" });
  if (error) {
    throw new Error(`Gagal menyimpan kitab book: ${error.message}`);
  }

  revalidateTag("kitab-books", "max");
  revalidatePath("/kitab");
  revalidatePath(`/kitab/${payload.slug}`);
  redirect("/admin/kitab-books?saved=1");
}

export async function upsertKitabChapterAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    book_slug: requiredString(formData, "book_slug"),
    slug: requiredString(formData, "slug"),
    title: requiredString(formData, "title"),
    duration_label: requiredString(formData, "duration_label"),
    position: requiredNumber(formData, "position"),
    arabic_text: String(formData.get("arabic_text") ?? "").trim() || null,
    translation: String(formData.get("translation") ?? "").trim() || null,
    explanation: String(formData.get("explanation") ?? "").trim() || null,
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("kitab_chapters").upsert(payload, { onConflict: "book_slug,slug" });
  if (error) {
    throw new Error(`Gagal menyimpan kitab chapter: ${error.message}`);
  }

  revalidateTag("kitab-chapters", "max");
  revalidatePath("/kitab");
  revalidatePath(`/kitab/${payload.book_slug}`);
  revalidatePath(`/kitab/${payload.book_slug}/${payload.slug}`);
  redirect("/admin/kitab-chapters?saved=1");
}

export async function upsertSurahAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    slug: requiredString(formData, "slug"),
    name: requiredString(formData, "name"),
    arabic: requiredString(formData, "arabic"),
    verses_count: requiredNumber(formData, "verses_count"),
    origin: requiredString(formData, "origin"),
    position: requiredNumber(formData, "position"),
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("surahs").upsert(payload, { onConflict: "slug" });
  if (error) {
    throw new Error(`Gagal menyimpan surah: ${error.message}`);
  }

  revalidateTag("surah-list", "max");
  revalidatePath("/quran");
  revalidatePath(`/quran/${payload.slug}`);
  redirect("/admin/surahs?saved=1");
}

export async function upsertSurahAyahAction(formData: FormData) {
  await requireAdminSession();

  const payload = {
    surah_slug: requiredString(formData, "surah_slug"),
    verse_number: requiredNumber(formData, "verse_number"),
    arabic_text: requiredString(formData, "arabic_text"),
    translation: requiredString(formData, "translation"),
    tafsir: String(formData.get("tafsir") ?? "").trim() || null,
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("surah_ayahs").upsert(payload, { onConflict: "surah_slug,verse_number" });
  if (error) {
    throw new Error(`Gagal menyimpan ayat: ${error.message}`);
  }

  revalidateTag("surah-ayahs", "max");
  revalidatePath(`/quran/${payload.surah_slug}`);
  redirect("/admin/surah-ayahs?saved=1");
}

export async function revalidateContentAction() {
  await requireAdminSession();

  for (const tag of cacheTags) {
    revalidateTag(tag, "max");
  }
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
  redirect("/admin?ok=1&saved=revalidate");
}
