import Link from "next/link";
import { revalidateContentAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const sections = [
  {
    category: "Hadith",
    items: [
      { href: "/admin/hadith-collections", label: "Hadith Collections" },
      { href: "/admin/hadith-entries", label: "Hadith Entries" },
    ],
  },
  {
    category: "Kitab",
    items: [
      { href: "/admin/kitab-books", label: "Kitab Books" },
      { href: "/admin/kitab-chapters", label: "Kitab Chapters" },
    ],
  },
  {
    category: "Qur'an",
    items: [
      { href: "/admin/surahs", label: "Surahs" },
      { href: "/admin/surah-ayahs", label: "Surah Ayahs" },
    ],
  },
] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; saved?: string }>;
}) {
  const query = await searchParams;

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h1 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Satu form per halaman, dikelompokkan per kategori konten.</p>

        {query.ok ? (
          <div className="mt-4 rounded-xl border border-emerald-500/45 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Revalidate berhasil dijalankan.
          </div>
        ) : null}
      </div>

      {sections.map((section) => (
        <div key={section.category} className="surface-card rounded-[24px] p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">{section.category}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="interactive-pill inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">Revalidate Cache</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Gunakan ini setelah update besar agar semua halaman langsung refresh.</p>
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
