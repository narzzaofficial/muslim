import Link from "next/link";
import { deleteSurahAction, upsertSurahAction } from "@/app/admin/actions";
import { getAdminSurahBySlug, getAdminSurahs, getAdminSurahsList } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminSurahsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; origin?: string; edit?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const origin = query.origin?.trim() ?? "";
  const edit = query.edit?.trim() ?? "";

  const [surahsForSelect, surahs, editingSurah] = await Promise.all([
    getAdminSurahs(),
    getAdminSurahsList({ origin: origin || undefined, q, limit: 50 }),
    edit ? getAdminSurahBySlug(edit) : Promise.resolve(null),
  ]);
  const origins = Array.from(new Set(surahsForSelect.map((x) => x.origin))).sort();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Surahs</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}
        <form action={upsertSurahAction} className="mt-5 grid gap-3">
          <input name="slug" placeholder="slug surah" required defaultValue={editingSurah?.slug ?? ""} readOnly={Boolean(editingSurah)} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="name" placeholder="nama surah" required defaultValue={editingSurah?.name ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="arabic" placeholder="nama arabic" required defaultValue={editingSurah?.arabic ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="verses_count" placeholder="jumlah ayat" type="number" required defaultValue={editingSurah?.verses_count ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="origin" placeholder="Makkiyah/Madaniyah" required defaultValue={editingSurah?.origin ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="position" placeholder="urutan mushaf" type="number" required defaultValue={editingSurah?.position ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingSurah ? "Update surah" : "Simpan surah"}
            </button>
            {editingSurah ? <Link href="/admin/surahs" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">Batal edit</Link> : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Surahs (max 50)</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select name="origin" defaultValue={origin} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="">Semua origin</option>
            {origins.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Cari slug/nama surah" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Filter</button>
        </form>
        <div className="mt-4 space-y-2">
          {surahs.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{item.position}. {item.slug} - {item.name} ({item.origin})</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/surahs?edit=${item.slug}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">Edit</Link>
                  <form action={deleteSurahAction}>
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
