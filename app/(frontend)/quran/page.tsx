import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { surahList } from "@/data/mock";
import { FadeIn } from "@/components/ui/motion";
import { Container, SearchInput } from "@/components/ui/primitives";

export default function QuranPage() {
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

          <div className="mx-auto max-w-2xl">
            <SearchInput placeholder="Cari surah atau nomor..." />
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mx-auto mt-8 max-w-5xl border-t border-[var(--border)] pt-8">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Daftar surah</h2>
          </div>
          <div className="space-y-2">
            {surahList.map((item, index) => (
              <Link
                key={item.slug}
                href={`/quran/${item.slug}`}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <p className="w-8 text-sm font-semibold text-[var(--muted)]">{index + 1}</p>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.origin} - {item.verses} ayat
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="arabic-text text-xl">{item.arabic}</p>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>
    </Container>
  );
}
