import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { getCollection, getHadithItems, hadithTopics } from "@/data/mock";
import { Container, SearchInput } from "@/components/ui/primitives";

export default async function HadithCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const meta = getCollection(collection);
  const items = getHadithItems(collection);

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <Link
            href="/hadist"
            className="interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke pusat hadist
          </Link>

          <div className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{meta.name}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Daftar hadist</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Pilih hadist yang ingin dibaca. Halaman ini khusus untuk list agar tetap bersih dan fokus.
            </p>
          </div>

          <div className="mx-auto mt-5 max-w-2xl">
            <SearchInput placeholder="Cari nomor, judul, atau perawi..." />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {hadithTopics.map((topic, index) => (
              <button
                key={topic}
                className={
                  index === 0
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

      <section className="mx-auto mt-6 max-w-5xl border-t border-[var(--border)] pt-6">
        <div className="surface-card surface-strong rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-2.5">
            {items.map((item) => (
              <Link
                key={item.number}
                href={`/hadist/${collection}/${item.number}`}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3.5"
              >
                <div className="flex items-center gap-4">
                  <p className="w-9 text-sm font-semibold text-[var(--muted)]">{item.number}</p>
                  <div>
                    <p className="text-sm font-semibold sm:text-base">{item.title}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.narrator} • {item.grade}
                    </p>
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
