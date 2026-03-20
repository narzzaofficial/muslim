import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { hadithCollections, hadithTopics } from "@/data/mock";
import { FadeIn } from "@/components/ui/motion";
import { Container, SearchInput } from "@/components/ui/primitives";

export default function HadistPage() {
  const extendedTopics = Array.from(new Set([
    ...hadithTopics,
    "Akhlak",
    "Dzikir",
    "Doa",
    "Aqidah",
    "Fikih",
    "Muamalah",
    "Keluarga",
    "Pendidikan",
    "Ramadhan",
    "Akhir Zaman",
  ]));

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

          <div className="mx-auto max-w-2xl">
            <SearchInput placeholder="Cari hadist, perawi, atau tema..." />
          </div>

          <div className="mt-5">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Kategori
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {extendedTopics.map((topic, index) => (
              <button
                key={`${topic}-${index}`}
                className={
                  index < 2
                    ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                    : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
                }
              >
                {topic}
              </button>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mx-auto mt-8 max-w-5xl border-t border-[var(--border)] pt-8">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Koleksi</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {hadithCollections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/hadist/${collection.slug}`}
                className="group surface-card interactive-card rounded-[22px] px-5 py-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{collection.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{collection.count}</p>
                    <p className="pt-1 text-sm leading-7 text-[var(--muted)]">{collection.description}</p>
                  </div>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--card-strong)] p-2 text-[color:color-mix(in_srgb,var(--foreground)_72%,var(--muted)_28%)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>
    </Container>
  );
}
