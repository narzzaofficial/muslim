import Link from "next/link";
import { upsertSurahAction } from "@/app/admin/actions";
import { getAdminSurahs } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminSurahsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const surahs = await getAdminSurahs();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Surahs</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        <form action={upsertSurahAction} className="mt-5 grid gap-3">
          <select name="slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            {surahs.map((s) => <option key={s.slug} value={s.slug}>{s.slug}</option>)}
          </select>
          <input name="name" placeholder="nama surah" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="arabic" placeholder="nama arabic" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="verses_count" placeholder="jumlah ayat" type="number" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="origin" placeholder="Makkiyah/Madaniyah" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="position" placeholder="urutan mushaf" type="number" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan surah</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Surahs</h2>
        <div className="mt-4 space-y-2">
          {surahs.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.position}. {item.slug} - {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
