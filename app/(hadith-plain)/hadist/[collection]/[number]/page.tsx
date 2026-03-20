import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronLeft } from "lucide-react";
import { hadithQa, hadithTags, relatedHadith, sanadNodes } from "@/data/content";
import { Container } from "@/components/ui/primitives";
import { ShareButton } from "@/components/ui/share-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getHadithCollectionBySlug, getHadithCollections, getHadithItemsByCollection } from "@/lib/content/repository";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const collections = await getHadithCollections();
  const params: { collection: string; number: string }[] = [];

  for (const collection of collections) {
    const items = await getHadithItemsByCollection(collection.slug);
    items.forEach((item) => {
      params.push({ collection: collection.slug, number: String(item.number) });
    });
  }

  return params;
}

export default async function HadithDetailPage({
  params,
}: {
  params: Promise<{ collection: string; number: string }>;
}) {
  const { collection, number } = await params;
  const [meta, items] = await Promise.all([getHadithCollectionBySlug(collection), getHadithItemsByCollection(collection)]);

  const parsedNumber = Number(number);
  const active = items.find((item) => item.number === parsedNumber);

  if (!active) {
    notFound();
  }

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-4xl pt-8 sm:pt-10">
        <div className="surface-card rounded-[28px] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/hadist/${collection}`}
              className="interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke daftar hadist
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={`${meta.name} - Hadist ${active.number}`} />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <div className="surface-card surface-strong rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {meta.name}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Detail Hadist</span>
            </div>

            <h1 className="mt-4 text-2xl leading-tight font-semibold tracking-[-0.02em] sm:text-3xl">{active.title}</h1>
            <p className="mt-2.5 text-base leading-7 text-[var(--muted)]">
              Hadist no. {active.number} • Perawi: {active.narrator} • Derajat: {active.grade}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-4xl space-y-5 border-t border-[var(--border)] pt-6">
        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Teks Arab</p>
          <p className="arabic-text text-right text-3xl leading-[2.2] sm:text-[2.35rem]">{active.arabicText ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Pohon Sanad</p>
          <div className="space-y-3">
            {sanadNodes.map((node, index) => (
              <div key={node} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-xs font-semibold">{index + 1}</div>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                <div className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2.5">
                  <p className="text-sm font-medium">{node}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Terjemahan</p>
          <p className="text-sm leading-8 text-[var(--foreground)]/88 sm:text-base">{active.translation ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Tafsir Ringkas</p>
          <p className="text-sm leading-8 text-[var(--foreground)]/88 sm:text-base">{active.summary ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Penjelasan Author (Q&A)</p>
          <div className="space-y-3">
            {hadithQa.map((item) => (
              <div key={item.question} className="space-y-2">
                <div className="w-fit max-w-[90%] rounded-2xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--card-strong)_85%,transparent)] px-4 py-3">
                  <p className="text-sm font-medium">
                    <span className="mr-2 font-semibold text-[var(--accent)]">Q:</span>
                    {item.question}
                  </p>
                </div>
                <div className="ml-auto w-fit max-w-[95%] rounded-2xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3">
                  <p className="text-sm leading-7">
                    <span className="mr-2 font-semibold text-[var(--accent)]">A:</span>
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Tag</p>
          <div className="flex flex-wrap gap-2">
            {hadithTags.map((tag) => (
              <span key={tag} className="interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Hadist terkait</p>
          <div className="space-y-2">
            {relatedHadith.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-[var(--muted)]">No. {item.number}</p>
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

