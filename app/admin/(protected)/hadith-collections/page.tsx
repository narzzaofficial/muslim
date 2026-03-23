import Link from "next/link";
import { deleteHadithCollectionAction, upsertHadithCollectionAction } from "@/app/admin/actions";
import { getAdminHadithCollectionBySlug, getAdminHadithCollectionsList } from "@/lib/content/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminHadithCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; edit?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const edit = query.edit?.trim() ?? "";

  const [collections, editingCollection] = await Promise.all([
    getAdminHadithCollectionsList({ q, limit: 50 }),
    edit ? getAdminHadithCollectionBySlug(edit) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Hadith Collections</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}

        <form action={upsertHadithCollectionAction} className="mt-5 grid gap-3">
          <input
            name="slug"
            placeholder="slug"
            required
            defaultValue={editingCollection?.slug ?? ""}
            readOnly={Boolean(editingCollection)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
          <input
            name="name"
            placeholder="nama koleksi"
            required
            defaultValue={editingCollection?.name ?? ""}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
          <input
            name="count_label"
            placeholder="count label"
            required
            defaultValue={editingCollection?.count_label ?? ""}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            placeholder="deskripsi"
            required
            rows={3}
            defaultValue={editingCollection?.description ?? ""}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingCollection ? "Update collection" : "Simpan collection"}
            </button>
            {editingCollection ? (
              <Link href="/admin/hadith-collections" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">
                Batal edit
              </Link>
            ) : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Hadith Collections</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input name="q" defaultValue={q} placeholder="Cari slug / nama koleksi" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Cari</button>
        </form>
        <div className="mt-4 space-y-2">
          {collections.map((item) => (
            <div key={item.slug} className="rounded-lg border border-[var(--border)] px-3 py-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{item.slug} - {item.name}</p>
                  <p className="text-xs text-[var(--muted)]">{item.count_label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/hadith-collections?edit=${item.slug}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">
                    Edit
                  </Link>
                  <form action={deleteHadithCollectionAction}>
                    <input type="hidden" name="slug" value={item.slug} />
                    <button type="submit" className="interactive-pill rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300">
                      Delete
                    </button>
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
