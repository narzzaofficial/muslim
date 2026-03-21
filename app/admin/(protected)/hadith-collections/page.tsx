import Link from "next/link";
import { upsertHadithCollectionAction } from "@/app/admin/actions";
import { getAdminHadithCollections } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminHadithCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const collections = await getAdminHadithCollections();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Hadith Collections</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        <form action={upsertHadithCollectionAction} className="mt-5 grid gap-3">
          <input name="slug" placeholder="slug" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="name" placeholder="nama koleksi" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="count_label" placeholder="count label" required className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="description" placeholder="deskripsi" required rows={3} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill w-fit rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan collection</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Hadith Collections</h2>
        <div className="mt-4 space-y-2">
          {collections.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2">
              <p className="text-sm font-medium">{item.slug} - {item.name}</p>
              <p className="text-xs text-[var(--muted)]">{item.count_label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
