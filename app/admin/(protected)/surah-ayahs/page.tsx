import Link from "next/link";
import { deleteSurahAyahAction, upsertSurahAyahAction } from "@/app/admin/actions";
import { getAdminSurahAyahByKey, getAdminSurahAyahsList, getAdminSurahs } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminSurahAyahsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; surah?: string; editSurah?: string; editVerse?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const surah = query.surah?.trim() ?? "";
  const editSurah = query.editSurah?.trim() ?? "";
  const editVerse = Number(query.editVerse ?? "");

  const [surahs, ayahs, editingAyah] = await Promise.all([
    getAdminSurahs(),
    getAdminSurahAyahsList({ surahSlug: surah || undefined, q, limit: 50 }),
    editSurah && Number.isFinite(editVerse) ? getAdminSurahAyahByKey(editSurah, editVerse) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Surah Ayahs</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}
        <form action={upsertSurahAyahAction} className="mt-5 grid gap-3">
          <select
            name="surah_slug"
            required
            defaultValue={editingAyah?.surah_slug ?? surahs[0]?.slug}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            {surahs.map((s) => <option key={s.slug} value={s.slug}>{s.slug}</option>)}
          </select>
          <input name="verse_number" placeholder="nomor ayat" type="number" required defaultValue={editingAyah?.verse_number ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="arabic_text" placeholder="teks arab" required rows={3} defaultValue={editingAyah?.arabic_text ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" required rows={3} defaultValue={editingAyah?.translation ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="tafsir" placeholder="tafsir (opsional)" rows={3} defaultValue={editingAyah?.tafsir ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingAyah ? "Update ayat" : "Simpan ayat"}
            </button>
            {editingAyah ? <Link href="/admin/surah-ayahs" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">Batal edit</Link> : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Surah Ayahs (max 50)</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select name="surah" defaultValue={surah} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="">Semua surah</option>
            {surahs.map((s) => <option key={s.slug} value={s.slug}>{s.slug}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Cari nomor ayat / terjemahan" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Filter</button>
        </form>
        <div className="mt-4 space-y-2">
          {ayahs.map((item) => (
            <div key={`${item.surah_slug}-${item.verse_number}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{item.surah_slug}:{item.verse_number} - {item.translation.slice(0, 80)}</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/surah-ayahs?editSurah=${item.surah_slug}&editVerse=${item.verse_number}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">Edit</Link>
                  <form action={deleteSurahAyahAction}>
                    <input type="hidden" name="surah_slug" value={item.surah_slug} />
                    <input type="hidden" name="verse_number" value={item.verse_number} />
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
