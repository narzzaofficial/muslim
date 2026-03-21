import Link from "next/link";
import { upsertKitabBookAction } from "@/app/admin/actions";
import { getAdminKitabBooks } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminKitabBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const books = await getAdminKitabBooks();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Kitab Books</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        <form action={upsertKitabBookAction} className="mt-5 grid gap-3">
          <input name="slug" placeholder="slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="category" placeholder="kategori" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="level" placeholder="level" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="lessons_count" placeholder="jumlah pelajaran" type="number" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="cover_image" placeholder="url cover" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="description" placeholder="deskripsi" required rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan kitab</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Kitab Books</h2>
        <div className="mt-4 space-y-2">
          {books.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.slug} - {item.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
