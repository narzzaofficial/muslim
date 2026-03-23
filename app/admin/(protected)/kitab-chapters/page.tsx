import Link from "next/link";
import { deleteKitabChapterAction, upsertKitabChapterAction } from "@/app/admin/actions";
import { getAdminKitabBooks, getAdminKitabChapterByKey, getAdminKitabChaptersList } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminKitabChaptersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; book?: string; editBook?: string; editSlug?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const book = query.book?.trim() ?? "";
  const editBook = query.editBook?.trim() ?? "";
  const editSlug = query.editSlug?.trim() ?? "";

  const [books, chapters, editingChapter] = await Promise.all([
    getAdminKitabBooks(),
    getAdminKitabChaptersList({ bookSlug: book || undefined, q, limit: 50 }),
    editBook && editSlug ? getAdminKitabChapterByKey(editBook, editSlug) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Kitab Chapters</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}
        <form action={upsertKitabChapterAction} className="mt-5 grid gap-3">
          <select name="book_slug" required defaultValue={editingChapter?.book_slug ?? books[0]?.slug} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            {books.map((b) => <option key={b.slug} value={b.slug}>{b.slug}</option>)}
          </select>
          <input name="slug" placeholder="slug chapter" required defaultValue={editingChapter?.slug ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul chapter" required defaultValue={editingChapter?.title ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="duration_label" placeholder="durasi" required defaultValue={editingChapter?.duration_label ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="position" placeholder="urutan" type="number" required defaultValue={editingChapter?.position ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="arabic_text" placeholder="teks arab" rows={3} defaultValue={editingChapter?.arabic_text ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" rows={3} defaultValue={editingChapter?.translation ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="explanation" placeholder="penjelasan" rows={3} defaultValue={editingChapter?.explanation ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingChapter ? "Update chapter" : "Simpan chapter"}
            </button>
            {editingChapter ? <Link href="/admin/kitab-chapters" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">Batal edit</Link> : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Kitab Chapters (max 50)</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select name="book" defaultValue={book} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="">Semua kitab</option>
            {books.map((b) => <option key={b.slug} value={b.slug}>{b.slug}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Cari slug/judul" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Filter</button>
        </form>
        <div className="mt-4 space-y-2">
          {chapters.map((item) => (
            <div key={`${item.book_slug}-${item.slug}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{item.book_slug}/{item.slug} - {item.title}</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/kitab-chapters?editBook=${item.book_slug}&editSlug=${item.slug}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">Edit</Link>
                  <form action={deleteKitabChapterAction}>
                    <input type="hidden" name="book_slug" value={item.book_slug} />
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
