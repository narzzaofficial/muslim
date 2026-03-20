import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { ShareButton } from "@/components/ui/share-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAyahsBySurah, getSurahBySlug, getSurahList } from "@/lib/content/repository";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const surahs = await getSurahList();
  return surahs.map((item) => ({ surah: item.slug }));
}

export default async function SurahDetailPage({
  params,
}: {
  params: Promise<{ surah: string }>;
}) {
  const { surah } = await params;
  const [item, ayatSample] = await Promise.all([getSurahBySlug(surah), getAyahsBySurah(surah)]);
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

      <section className="mx-auto mt-6 max-w-4xl border-t border-[var(--border)] pt-6">
        <div className="space-y-4">
          {ayatSample.map((ayah) => (
            <article key={ayah.number} className="surface-card rounded-[24px] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  Ayat {ayah.number}
                </span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] px-4 py-4 sm:px-5">
                <p className="arabic-text text-right text-3xl leading-[2.2]">{ayah.arabic}</p>
              </div>

              <div className="mt-3 rounded-2xl border border-[var(--border)] px-4 py-4 sm:px-5">
                <p className="text-sm leading-8 text-[var(--foreground)]/88">{ayah.translation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
