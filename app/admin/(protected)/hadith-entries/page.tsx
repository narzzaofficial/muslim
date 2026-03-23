import Link from "next/link";
import { deleteHadithEntryAction, upsertHadithEntryAction } from "@/app/admin/actions";
import { hadithTafsirSources } from "@/lib/content/hadith-tafsir";
import { getAdminHadithCollections, getAdminHadithEntriesList, getAdminHadithEntryByKey } from "@/lib/content/admin-repository";

type TafsirDefaultMap = Record<string, string>;

function pickTafsirDefaults(value: unknown): TafsirDefaultMap {
  if (!Array.isArray(value)) {
    return {};
  }
  const result: TafsirDefaultMap = {};
  value.forEach((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return;
    }
    const key = typeof item.sourceKey === "string" ? item.sourceKey : "";
    const content = typeof item.content === "string" ? item.content : "";
    if (key && content) {
      result[key] = content;
    }
  });
  return result;
}

export const dynamic = "force-dynamic";

export default async function AdminHadithEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; collection?: string; editCollection?: string; editNumber?: string }>;
}) {
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const collection = query.collection?.trim() ?? "";
  const editCollection = query.editCollection?.trim() ?? "";
  const editNumber = Number(query.editNumber ?? "");

  const [collections, entries, editingEntry] = await Promise.all([
    getAdminHadithCollections(),
    getAdminHadithEntriesList({ collectionSlug: collection || undefined, q, limit: 50 }),
    editCollection && Number.isFinite(editNumber)
      ? getAdminHadithEntryByKey(editCollection, editNumber)
      : Promise.resolve(null),
  ]);

  const tafsirDefaults = pickTafsirDefaults(editingEntry?.tafsir_versions);

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Hadith Entry</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}
        {query.deleted ? <p className="mt-3 text-sm text-amber-300">Berhasil dihapus.</p> : null}

        <form action={upsertHadithEntryAction} className="mt-5 grid gap-3">
          <select
            name="collection_slug"
            required
            defaultValue={editingEntry?.collection_slug ?? collections[0]?.slug}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            {collections.map((c) => <option key={c.slug} value={c.slug}>{c.slug}</option>)}
          </select>
          <input name="number" placeholder="nomor hadith" required type="number" defaultValue={editingEntry?.number ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="title" placeholder="judul" required defaultValue={editingEntry?.title ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input name="narrator" placeholder="perawi" required defaultValue={editingEntry?.narrator ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <select name="grade" required defaultValue={editingEntry?.grade ?? "Shahih"} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="Shahih">Shahih</option>
            <option value="Hasan">Hasan</option>
            <option value="Hasan Shahih">Hasan Shahih</option>
            <option value="Dhaif">Dhaif</option>
            <option value="Maudhu">Maudhu</option>
            <option value="Muttafaq &apos;alaih">Muttafaq &apos;alaih</option>
          </select>
          <textarea name="arabic_text" placeholder="teks arab" rows={3} defaultValue={editingEntry?.arabic_text ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="translation" placeholder="terjemahan" rows={3} defaultValue={editingEntry?.translation ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <textarea name="summary" placeholder="tafsir ringkas" rows={3} defaultValue={editingEntry?.summary ?? ""} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />

          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-sm font-medium">Tafsir Multi Versi (Opsional)</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Isi satu atau beberapa versi tafsir populer. Jika kosong, frontend hanya menampilkan tafsir ringkas.
            </p>
            <div className="mt-3 grid gap-3">
              {hadithTafsirSources.map((source) => (
                <label key={source.key} className="block">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{source.label}</span>
                  <textarea
                    name={`tafsir_${source.key}`}
                    placeholder={`Tafsir versi ${source.label} (opsional)`}
                    rows={3}
                    defaultValue={tafsirDefaults[source.key] ?? ""}
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              {editingEntry ? "Update hadith" : "Simpan hadith"}
            </button>
            {editingEntry ? (
              <Link href="/admin/hadith-entries" className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">
                Batal edit
              </Link>
            ) : null}
          </div>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Hadith Entries (max 50)</h2>
        <form method="get" className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select name="collection" defaultValue={collection} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]">
            <option value="">Semua koleksi</option>
            {collections.map((c) => <option key={c.slug} value={c.slug}>{c.slug}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Cari judul/perawi/nomor" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Filter</button>
        </form>

        <div className="mt-4 space-y-2">
          {entries.map((item) => (
            <div key={`${item.collection_slug}-${item.number}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{item.collection_slug}/{item.number} - {item.title} ({item.grade})</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/hadith-entries?editCollection=${item.collection_slug}&editNumber=${item.number}`} className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">
                    Edit
                  </Link>
                  <form action={deleteHadithEntryAction}>
                    <input type="hidden" name="collection_slug" value={item.collection_slug} />
                    <input type="hidden" name="number" value={item.number} />
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
