"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hadithTafsirSources } from "@/lib/content/hadith-tafsir";

const cacheTags = [
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

export async function deleteHadithCollectionAction(formData: FormData) {
  await requireAdminSession();
  const slug = requiredString(formData, "slug");

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("hadith_collections").delete().eq("slug", slug);
  if (error) {
    throw new Error(`Gagal menghapus koleksi hadith: ${error.message}`);
  }

  revalidateTag("hadith-collections", "max");
  revalidateTag("hadith-entries", "max");
  revalidatePath("/hadist");
  revalidatePath(`/hadist/${slug}`);
  redirect("/admin/hadith-collections?deleted=1");
}

export async function upsertHadithEntryAction(formData: FormData) {
  await requireAdminSession();

  const tafsirVersions = hadithTafsirSources
    .map((source) => {
      const content = String(formData.get(`tafsir_${source.key}`) ?? "").trim();
      if (!content) {
        return null;
      }
      return {
        source: source.label,
        sourceKey: source.key,
        content,
      };
    })
    .filter((item): item is { source: string; sourceKey: string; content: string } => item !== null);

  const payload = {
    collection_slug: requiredString(formData, "collection_slug"),
    number: requiredNumber(formData, "number"),
    title: requiredString(formData, "title"),
    narrator: requiredString(formData, "narrator"),
    grade: requiredString(formData, "grade"),
    arabic_text: String(formData.get("arabic_text") ?? "").trim() || null,
    translation: String(formData.get("translation") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    tafsir_versions: tafsirVersions,
  };

  const admin = createAdminSupabaseClient();
  let { error } = await admin.from("hadith_entries").upsert(payload, { onConflict: "collection_slug,number" });
  if (error?.message?.includes("tafsir_versions")) {
    const legacyPayload = {
      collection_slug: payload.collection_slug,
      number: payload.number,
      title: payload.title,
      narrator: payload.narrator,
      grade: payload.grade,
      arabic_text: payload.arabic_text,
      translation: payload.translation,
      summary: payload.summary,
    };
    const legacyResult = await admin.from("hadith_entries").upsert(legacyPayload, { onConflict: "collection_slug,number" });
    error = legacyResult.error;
  }
  if (error) {
    throw new Error(`Gagal menyimpan entry hadith: ${error.message}`);
  }

  revalidateTag("hadith-entries", "max");
  revalidatePath("/hadist");
  revalidatePath(`/hadist/${payload.collection_slug}`);
  revalidatePath(`/hadist/${payload.collection_slug}/${payload.number}`);
  redirect("/admin/hadith-entries?saved=1");
}

export async function deleteHadithEntryAction(formData: FormData) {
  await requireAdminSession();
  const collectionSlug = requiredString(formData, "collection_slug");
  const number = requiredNumber(formData, "number");

  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("hadith_entries")
    .delete()
    .eq("collection_slug", collectionSlug)
    .eq("number", number);
  if (error) {
    throw new Error(`Gagal menghapus entry hadith: ${error.message}`);
  }

  revalidateTag("hadith-entries", "max");
  revalidatePath("/hadist");
  revalidatePath(`/hadist/${collectionSlug}`);
  revalidatePath(`/hadist/${collectionSlug}/${number}`);
  redirect("/admin/hadith-entries?deleted=1");
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

export async function deleteKitabBookAction(formData: FormData) {
  await requireAdminSession();
  const slug = requiredString(formData, "slug");

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("kitab_books").delete().eq("slug", slug);
  if (error) {
    throw new Error(`Gagal menghapus kitab book: ${error.message}`);
  }

  revalidateTag("kitab-books", "max");
  revalidateTag("kitab-chapters", "max");
  revalidatePath("/kitab");
  revalidatePath(`/kitab/${slug}`);
  redirect("/admin/kitab-books?deleted=1");
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

export async function deleteKitabChapterAction(formData: FormData) {
  await requireAdminSession();
  const bookSlug = requiredString(formData, "book_slug");
  const slug = requiredString(formData, "slug");

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("kitab_chapters").delete().eq("book_slug", bookSlug).eq("slug", slug);
  if (error) {
    throw new Error(`Gagal menghapus kitab chapter: ${error.message}`);
  }

  revalidateTag("kitab-chapters", "max");
  revalidatePath("/kitab");
  revalidatePath(`/kitab/${bookSlug}`);
  revalidatePath(`/kitab/${bookSlug}/${slug}`);
  redirect("/admin/kitab-chapters?deleted=1");
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

export async function deleteSurahAction(formData: FormData) {
  await requireAdminSession();
  const slug = requiredString(formData, "slug");

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("surahs").delete().eq("slug", slug);
  if (error) {
    throw new Error(`Gagal menghapus surah: ${error.message}`);
  }

  revalidateTag("surah-list", "max");
  revalidateTag("surah-ayahs", "max");
  revalidatePath("/quran");
  revalidatePath(`/quran/${slug}`);
  redirect("/admin/surahs?deleted=1");
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

export async function deleteSurahAyahAction(formData: FormData) {
  await requireAdminSession();
  const surahSlug = requiredString(formData, "surah_slug");
  const verseNumber = requiredNumber(formData, "verse_number");

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("surah_ayahs").delete().eq("surah_slug", surahSlug).eq("verse_number", verseNumber);
  if (error) {
    throw new Error(`Gagal menghapus ayat: ${error.message}`);
  }

  revalidateTag("surah-ayahs", "max");
  revalidatePath(`/quran/${surahSlug}`);
  redirect("/admin/surah-ayahs?deleted=1");
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
