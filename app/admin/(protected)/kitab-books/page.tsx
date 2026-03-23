import Link from "next/link";
import { deleteKitabBookAction, upsertKitabBookAction } from "@/app/admin/actions";
import { getAdminKitabBookBySlug, getAdminKitabBooks, getAdminKitabBooksList } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminKitabBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; category?: string; edit?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const category = query.category?.trim() ?? "";
  const edit = query.edit?.trim() ?? "";

  const [booksForSelect, books, editingBook] = await Promise.all([
    getAdminKitabBooks(),
    getAdminKitabBooksList({ category: category || undefined, q, limit: 50 }),
    edit ? getAdminKitabBookBySlug(edit) : Promise.resolve(null),
  ]);
  const categories = Array.from(new Set(booksForSelect.map((b) => b.category))).sort();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Kitab Books</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}
        <form action={upsertKitabBookAction} className="mt-5 grid gap-3">
          <input name="slug" placeholder="slug" required defaultValue={editingBook?.slug ?? ""} readOnly={Boolean(editingBook)} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul" required defaultValue={editingBook?.title ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="category" placeholder="kategori" required defaultValue={editingBook?.category ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="level" placeholder="level" required defaultValue={editingBook?.level ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="lessons_count" placeholder="jumlah pelajaran" type="number" required defaultValue={editingBook?.lessons_count ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="cover_image" placeholder="url cover" required defaultValue={editingBook?.cover_image ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="description" placeholder="deskripsi" required rows={3} defaultValue={editingBook?.description ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingBook ? "Update kitab" : "Simpan kitab"}
            </button>
            {editingBook ? <Link href="/admin/kitab-books" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">Batal edit</Link> : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Kitab Books (max 50)</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select name="category" defaultValue={category} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="">Semua kategori</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Cari slug/judul" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Filter</button>
        </form>
        <div className="mt-4 space-y-2">
          {books.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{item.slug} - {item.title} ({item.category})</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/kitab-books?edit=${item.slug}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">Edit</Link>
                  <form action={deleteKitabBookAction}>
                    <input type="hidden" name="slug" value={item.slug} />
                    <button type="submit" className="interactive-pill rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
