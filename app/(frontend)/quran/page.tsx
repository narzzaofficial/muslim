import type { Metadata } from "next";
import { QuranSurahExplorer } from "@/components/catalog/quran-surah-explorer";
import { FadeIn } from "@/components/ui/motion";
import { Container } from "@/components/ui/primitives";
import { getSurahList } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Al-Qur'an",
  description: "Baca dan jelajahi daftar surah Al-Qur'an dengan tampilan bersih, nyaman, dan mudah diteruskan.",
  path: "/quran",
  keywords: ["al quran", "surah", "baca quran online", "tafsir ringkas"],
});

export default async function QuranPage() {
  const surahList = await getSurahList();
  return (
    <Container className="pb-20">
      <FadeIn>
        <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Al-Qur&apos;an</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Cari surah dan lanjutkan tilawah dengan tampilan bersih.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mx-auto mt-2 max-w-5xl">
          <QuranSurahExplorer surahs={surahList} />
        </section>
      </FadeIn>
    </Container>
  );
}
