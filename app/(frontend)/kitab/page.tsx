import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { kitabFilters } from "@/data/content";
import { Container, SearchInput } from "@/components/ui/primitives";
import { getKitabBooks } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Perpustakaan Kitab",
  description:
    "Daftar kitab Nahwu dan Sharaf dengan tampilan ringkas untuk lanjut belajar, melihat level, jumlah pelajaran, dan progres.",
  keywords: [
    "kitab nahwu",
    "kitab sharaf",
    "belajar bahasa arab",
    "mukhtashar jiddan",
    "muslim by narzza",
  ],
  openGraph: {
    title: "Perpustakaan Kitab | Muslim by Narzza",
    description:
      "Pilih kitab, lihat level dan progres, lalu lanjut belajar dengan alur yang bersih dan fokus.",
    url: "https://muslim.narzza.com/kitab",
    siteName: "Muslim by Narzza",
    type: "website",
  },
  alternates: {
    canonical: "/kitab",
  },
};

export default async function KitabPage() {
  const kitabBooks = await getKitabBooks();
  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Nahwu & Sharaf</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Daftar kitab</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Pilih kitab yang ingin dipelajari. Halaman ini dibuat ringkas agar fokus ke progres belajar.
            </p>
          </div>

          <div className="mx-auto mt-5 max-w-2xl">
            <SearchInput placeholder="Cari kitab, level, atau jumlah pelajaran..." />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {kitabFilters.map((filter, index) => (
              <button
                key={`${filter}-${index}`}
                className={
                  index === 0
                    ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                    : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-5xl border-t border-[var(--border)] pt-6">
        <div className="surface-card surface-strong rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {kitabBooks.map((book) => (
              <Link
                key={book.slug}
                href={`/kitab/${book.slug}`}
                className="group surface-card interactive-card relative overflow-hidden rounded-2xl border border-[var(--border)] p-4"
              >
                <div className="flex gap-4">
                  <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
                    <div
                      role="img"
                      aria-label={`Cover ${book.title}`}
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${book.coverImage})` }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                          {book.level}
                        </p>
                        <p className="mt-2 text-lg font-semibold leading-snug">{book.title}</p>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                    </div>

                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-[var(--muted)]">
                        {book.category} • {book.lessons} pelajaran
                      </p>
                      <p className="text-xs leading-6 text-[var(--muted)]">{book.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
