import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";
import { HadithCollectionsExplorer } from "@/components/catalog/hadith-collections-explorer";
import { Container } from "@/components/ui/primitives";
import { getHadithCollections } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pusat Hadist",
  description: "Jelajahi koleksi hadist dan pilih riwayat yang ingin dibaca dalam tampilan sederhana dan fokus.",
  path: "/hadist",
  keywords: ["hadist", "koleksi hadist", "hadis muslim", "belajar hadist"],
});

export default async function HadistPage() {
  const hadithCollections = await getHadithCollections();

  return (
    <Container className="pb-20">
      <FadeIn>
        <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Pusat hadist</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Tampilan dibuat sederhana agar fokus langsung ke bacaan.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mx-auto mt-2 max-w-5xl">
          <HadithCollectionsExplorer collections={hadithCollections} />
        </section>
      </FadeIn>
    </Container>
  );
}
