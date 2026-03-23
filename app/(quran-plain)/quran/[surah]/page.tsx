import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { QuranAyahsExplorer } from "@/components/catalog/quran-ayahs-explorer";
import { Container } from "@/components/ui/primitives";
import { ShareButton } from "@/components/ui/share-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAyahsBySurah, getSurahBySlug, getSurahList } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const surahs = await getSurahList();
  return surahs.map((item) => ({ surah: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ surah: string }>;
}): Promise<Metadata> {
  const { surah } = await params;
  const item = await getSurahBySlug(surah);

  return buildMetadata({
    title: `${item.name} (${item.arabic})`,
    description: `Baca Surah ${item.name} (${item.origin}, ${item.verses} ayat) lengkap dengan terjemahan dan tafsir ringkas.`,
    path: `/quran/${surah}`,
    type: "article",
    keywords: ["quran", "surah", item.name, item.origin, `${item.verses} ayat`],
  });
}

export default async function SurahDetailPage({
  params,
}: {
  params: Promise<{ surah: string }>;
}) {
  const { surah } = await params;
  const [item, ayahs] = await Promise.all([getSurahBySlug(surah), getAyahsBySurah(surah)]);
  const juzBySurah: Record<string, string> = {
    "al-fatihah": "Juz 1",
    "al-kahf": "Juz 15",
    maryam: "Juz 16",
    "ya-sin": "Juz 22",
    "ar-rahman": "Juz 27",
    "al-mulk": "Juz 29",
  };
  const juzLabel = juzBySurah[item.slug] ?? "Juz 1";

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-4xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/quran"
              className="interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke daftar surah
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={`Surah ${item.name}`} />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="surface-card surface-strong mt-4 rounded-[28px] p-5 text-center sm:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {item.origin}
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {item.verses} ayat
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {juzLabel}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{item.name}</h1>
          <p className="arabic-text mt-1 text-4xl">{item.arabic}</p>
        </div>
      </section>

      <QuranAyahsExplorer ayahs={ayahs} />
    </Container>
  );
}
