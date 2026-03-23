import type { Metadata } from "next";
import { KitabBooksExplorer } from "@/components/catalog/kitab-books-explorer";
import { Container } from "@/components/ui/primitives";
import { getKitabBooks } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Perpustakaan Kitab",
  description:
    "Daftar kitab Nahwu dan Sharaf untuk lanjut belajar dengan alur ringkas, fokus, dan mudah diikuti.",
  path: "/kitab",
  keywords: ["kitab nahwu", "kitab sharaf", "belajar bahasa arab", "mukhtashar jiddan", "muslim by narzza"],
});

export default async function KitabPage() {
  const kitabBooks = await getKitabBooks();

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
        <div className="px-1 py-3 text-center sm:py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Nahwu & Sharaf</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Daftar kitab</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Pilih kitab yang ingin dipelajari. Halaman ini dibuat ringkas agar fokus ke progres belajar.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-2 max-w-5xl">
        <KitabBooksExplorer books={kitabBooks} />
      </section>
    </Container>
  );
}
