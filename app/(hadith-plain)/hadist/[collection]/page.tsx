import type { Metadata } from "next";
import { HadithItemsExplorer } from "@/components/catalog/hadith-items-explorer";
import { Container } from "@/components/ui/primitives";
import { getHadithCollectionBySlug, getHadithCollections, getHadithItemsByCollection } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 604800;

export async function generateStaticParams() {
  const collections = await getHadithCollections();
  return collections.map((item) => ({ collection: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const meta = await getHadithCollectionBySlug(collection);

  return buildMetadata({
    title: `${meta.name} - Daftar Hadist`,
    description: meta.description,
    path: `/hadist/${collection}`,
    keywords: ["hadist", meta.name, "daftar hadist", "kajian islam"],
  });
}

export default async function HadithCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const [meta, items] = await Promise.all([getHadithCollectionBySlug(collection), getHadithItemsByCollection(collection)]);

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{meta.name}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Daftar hadist</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Pilih hadist yang ingin dibaca. Halaman ini khusus list agar tetap bersih.</p>
          </div>
        </div>
      </section>

      <HadithItemsExplorer collectionSlug={collection} items={items} backHref="/hadist" />
    </Container>
  );
}
