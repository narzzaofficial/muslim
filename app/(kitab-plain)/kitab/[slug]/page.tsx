import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { getBook, kitabChapters } from "@/data/mock";
import { Container, SearchInput } from "@/components/ui/primitives";

export default async function KitabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <Link
            href="/kitab"
            className="interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke perpustakaan kitab
          </Link>

          <div className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {book.category} • {book.level}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{book.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{book.description}</p>
          </div>

          <div className="mx-auto mt-5 max-w-2xl">
            <SearchInput placeholder="Cari bab atau kata kunci pelajaran..." />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-5xl border-t border-[var(--border)] pt-6">
        <div className="surface-card surface-strong rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-[var(--muted)]">Daftar isi</p>
          </div>
          <div className="space-y-2.5">
            {kitabChapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/kitab/${slug}/${chapter.slug}`}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3.5"
              >
                <div className="flex items-center gap-4">
                  <p className="w-9 text-sm font-semibold text-[var(--muted)]">{index + 1}</p>
                  <div>
                    <p className="text-sm font-semibold sm:text-base">{chapter.title}</p>
                    <p className="text-xs text-[var(--muted)]">{chapter.duration}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--accent)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
