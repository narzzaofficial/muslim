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

function parseLineList(rawValue: string): string[] {
  return rawValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseTags(rawValue: string): string[] {
  return rawValue
    .split(/[\r\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseAuthorQa(rawValue: string): { question: string; answer: string }[] {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
              return null;
            }
            const question = typeof item["question"] === "string" ? item["question"].trim() : "";
            const answer = typeof item["answer"] === "string" ? item["answer"].trim() : "";
            if (!question || !answer) {
              return null;
            }
            return { question, answer };
          })
          .filter((item): item is { question: string; answer: string } => item !== null);
      }

      if (parsed && typeof parsed === "object") {
        const payload = parsed as Record<string, unknown>;
        if (!Array.isArray(payload.lines)) {
          return [];
        }
        const sourceName = typeof payload.sourceName === "string" ? payload.sourceName.trim() : "";
        const sourceUrl = typeof payload.sourceUrl === "string" ? payload.sourceUrl.trim() : "";
        const lines = payload.lines as unknown[];
        const result: { question: string; answer: string }[] = [];
        let pendingQuestion: string | null = null;

        lines.forEach((line) => {
          if (!line || typeof line !== "object" || Array.isArray(line)) {
            return;
          }
          const linePayload = line as Record<string, unknown>;
          const role = linePayload.role === "answer" ? "answer" : "question";
          const text = typeof linePayload.text === "string" ? linePayload.text.trim() : "";

          if (!text) {
            return;
          }
          if (role === "question") {
            pendingQuestion = text;
            return;
          }
          if (!pendingQuestion) {
            return;
          }

          result.push({
            question: pendingQuestion,
            answer: text,
            ...(sourceName ? { sourceName } : {}),
            ...(sourceUrl ? { sourceUrl } : {}),
          } as { question: string; answer: string });
          pendingQuestion = null;
        });

        return result;
      }
    } catch {
      // fallback to the legacy delimiter format below
    }
  }

  return rawValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const delimiter = line.includes("||") ? "||" : "|";
      const parts = line.split(delimiter);
      if (parts.length < 2) {
        return null;
      }
      const question = parts[0]?.trim() ?? "";
      const answer = parts.slice(1).join(delimiter).trim();
      if (!question || !answer) {
        return null;
      }
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);
}

function parseRelatedHadith(rawValue: string): { collectionSlug: string; number: number; title?: string }[] {
  const items = rawValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const delimiter = line.includes("||") ? "||" : "|";
      const [ref, ...titleParts] = line.split(delimiter);
      const [collectionSlugRaw, numberRaw] = (ref ?? "").split("/");
      const collectionSlug = (collectionSlugRaw ?? "").trim();
      const numberValue = Number((numberRaw ?? "").trim());
      if (!collectionSlug || !Number.isFinite(numberValue) || !Number.isInteger(numberValue)) {
        return null;
      }
      const title = titleParts.join(delimiter).trim();
      return {
        collectionSlug,
        number: numberValue,
        ...(title ? { title } : {}),
      };
    });
  return items.filter((item): item is { collectionSlug: string; number: number; title?: string } => item !== null);
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
    sanad_nodes: parseLineList(String(formData.get("sanad_nodes") ?? "")),
    author_qa: parseAuthorQa(String(formData.get("author_qa") ?? "")),
    tags: parseTags(String(formData.get("tags") ?? "")),
    related_hadith: parseRelatedHadith(String(formData.get("related_hadith") ?? "")),
  };

  const admin = createAdminSupabaseClient();
  let { error } = await admin.from("hadith_entries").upsert(payload, { onConflict: "collection_slug,number" });
  if (
    error?.message?.includes("tafsir_versions") ||
    error?.message?.includes("sanad_nodes") ||
    error?.message?.includes("author_qa") ||
    error?.message?.includes("tags") ||
    error?.message?.includes("related_hadith")
  ) {
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
