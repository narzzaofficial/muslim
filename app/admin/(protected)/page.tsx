import { revalidateContentAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const query = await searchParams;

  return (
    <section className="mx-auto mt-6 max-w-4xl">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h1 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Konten Publish</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Setelah update konten di Supabase, jalankan revalidate untuk menyegarkan halaman static/ISR.
        </p>

        {query.ok ? (
          <div className="mt-4 rounded-xl border border-emerald-500/45 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Revalidate berhasil dijalankan.
          </div>
        ) : null}

        <form action={revalidateContentAction} className="mt-5">
          <button
            type="submit"
            className="interactive-pill inline-flex items-center rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]"
          >
            Revalidate semua konten
          </button>
        </form>
      </div>
    </section>
  );
}
