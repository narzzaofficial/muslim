import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminRevalidateToken } from "@/lib/supabase/env";

const cacheTags = [
  "hadith-collections",
  "hadith-entries",
  "kitab-books",
  "kitab-chapters",
  "surah-list",
  "surah-ayahs",
] as const;

const paths = [
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

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";

  if (!token || token !== getAdminRevalidateToken()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  cacheTags.forEach((tag) => revalidateTag(tag, "max"));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
