import Link from "next/link";
import { upsertSurahAyahAction } from "@/app/admin/actions";
import { getAdminRecentSurahAyahs, getAdminSurahs } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminSurahAyahsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [surahs, ayahs] = await Promise.all([getAdminSurahs(), getAdminRecentSurahAyahs(50)]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Surah Ayahs</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        <form action={upsertSurahAyahAction} className="mt-5 grid gap-3">
          <select name="surah_slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            {surahs.map((s) => <option key={s.slug} value={s.slug}>{s.slug}</option>)}
          </select>
          <input name="verse_number" placeholder="nomor ayat" type="number" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="arabic_text" placeholder="teks arab" required rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" required rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="tafsir" placeholder="tafsir (opsional)" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan ayat</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Surah Ayahs (50 terbaru)</h2>
        <div className="mt-4 space-y-2">
          {ayahs.map((item) => (
            <div key={`${item.surah_slug}-${item.verse_number}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.surah_slug}:{item.verse_number}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
