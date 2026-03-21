import Link from "next/link";
import { updatePrayerScheduleAction } from "@/app/admin/actions";
import { getPrayerSchedule } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function AdminPrayerPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const prayerSchedule = await getPrayerSchedule();

  return (
    <section className="mx-auto mt-6 grid max-w-4xl gap-4">
      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Form Jadwal Shalat</h1>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Kembali</Link>
        </div>
        {query.saved ? <p className="mt-3 text-sm text-emerald-300">Berhasil disimpan.</p> : null}

        <form action={updatePrayerScheduleAction} className="mt-5 space-y-3">
          {prayerSchedule.map((item, index) => {
            const position = index + 1;
            return (
              <div key={item.name} className="grid items-end gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-[1.2fr_1fr_1fr]">
                <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Nama
                  <input name={`name_${position}`} defaultValue={item.name} readOnly className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 text-sm" />
                </label>
                <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Jam
                  <input name={`time_${position}`} defaultValue={item.time} required pattern="^[0-2][0-9]:[0-5][0-9]$" className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-2 text-sm" />
                </label>
                <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Status
                  <select name={`status_${position}`} defaultValue={item.status ?? ""} className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-2 text-sm">
                    <option value="">Belum masuk</option>
                    <option value="done">Sudah lewat</option>
                    <option value="next">Berikutnya</option>
                  </select>
                </label>
              </div>
            );
          })}
          <button type="submit" className="interactive-pill rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">Simpan jadwal</button>
        </form>
      </div>

      <div className="surface-card rounded-[24px] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">List Jadwal Shalat</h2>
        <div className="mt-4 space-y-2">
          {prayerSchedule.map((item) => (
            <div key={item.name} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              {item.name} - {item.time} {item.status ? `(${item.status})` : ""}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
