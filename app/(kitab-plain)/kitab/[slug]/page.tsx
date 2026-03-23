import type { Metadata } from "next";
import { KitabChaptersExplorer } from "@/components/catalog/kitab-chapters-explorer";
import { Container } from "@/components/ui/primitives";
import { getKitabBookBySlug, getKitabBooks, getKitabChaptersByBook } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const books = await getKitabBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getKitabBookBySlug(slug);

  return buildMetadata({
    title: `${book.title} - Daftar Bab`,
    description: book.description,
    path: `/kitab/${slug}`,
    keywords: ["kitab", "nahwu", "sharaf", book.title, book.category, book.level],
  });
}

export default async function KitabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [book, chapters] = await Promise.all([getKitabBookBySlug(slug), getKitabChaptersByBook(slug)]);

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {book.category} - {book.level}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{book.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{book.description}</p>
          </div>
        </div>
      </section>

      <KitabChaptersExplorer slug={slug} chapters={chapters} backHref="/kitab" />
    </Container>
  );
}
