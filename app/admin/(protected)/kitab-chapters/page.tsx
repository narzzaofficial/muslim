import Link from "next/link";
import { upsertKitabChapterAction } from "@/app/admin/actions";
import { getAdminKitabBooks, getAdminRecentKitabChapters } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminKitabChaptersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [books, chapters] = await Promise.all([getAdminKitabBooks(), getAdminRecentKitabChapters(50)]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Kitab Chapters</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        <form action={upsertKitabChapterAction} className="mt-5 grid gap-3">
          <select name="book_slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            {books.map((b) => <option key={b.slug} value={b.slug}>{b.slug}</option>)}
          </select>
          <input name="slug" placeholder="slug chapter" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul chapter" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="duration_label" placeholder="durasi" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="position" placeholder="urutan" type="number" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="arabic_text" placeholder="teks arab" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="explanation" placeholder="penjelasan" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan chapter</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Kitab Chapters (50 terbaru)</h2>
        <div className="mt-4 space-y-2">
          {chapters.map((item) => (
            <div key={`${item.book_slug}-${item.slug}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.book_slug}/{item.slug} - {item.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
