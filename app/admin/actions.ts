"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

export async function revalidateContentAction() {
  for (const tag of cacheTags) {
    revalidateTag(tag, "max");
  }
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
  redirect("/admin?ok=1");
}
