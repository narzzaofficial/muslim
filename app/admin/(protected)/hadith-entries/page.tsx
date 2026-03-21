import Link from "next/link";
import { upsertHadithEntryAction } from "@/app/admin/actions";
import { getAdminHadithCollections, getAdminRecentHadithEntries } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminHadithEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [collections, entries] = await Promise.all([getAdminHadithCollections(), getAdminRecentHadithEntries(50)]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Hadith Entry</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}

        <form action={upsertHadithEntryAction} className="mt-5 grid gap-3">
          <select name="collection_slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            {collections.map((c) => <option key={c.slug} value={c.slug}>{c.slug}</option>)}
          </select>
          <input name="number" placeholder="nomor hadith" required type="number" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="narrator" placeholder="perawi" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <select name="grade" required defaultValue="Shahih" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            <option value="Shahih">Shahih</option>
            <option value="Hasan">Hasan</option>
            <option value="Hasan Shahih">Hasan Shahih</option>
            <option value="Dhaif">Dhaif</option>
            <option value="Maudhu">Maudhu</option>
            <option value="Muttafaq &apos;alaih">Muttafaq &apos;alaih</option>
          </select>
          <textarea name="arabic_text" placeholder="teks arab" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="summary" placeholder="tafsir ringkas" rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan hadith</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Hadith Entries (50 terbaru)</h2>
        <div className="mt-4 space-y-2">
          {entries.map((item) => (
            <div key={`${item.collection_slug}-${item.number}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.collection_slug}/{item.number} - {item.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
