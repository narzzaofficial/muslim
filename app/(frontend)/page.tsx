import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { Container } from "@/components/ui/primitives";
import { getPrayerSchedule } from "@/lib/content/repository";

const mainMenu = [
  {
    title: "Pusat Hadist",
    description: "Cari hadist dan buka koleksi.",
    href: "/hadist",
  },
  {
    title: "Kitab Nahwu & Sharaf",
    description: "Lanjutkan belajar kitab.",
    href: "/kitab",
  },
  {
    title: "Al-Qur'an",
    description: "Buka surah dan lanjut baca.",
    href: "/quran",
  },
];

export default async function HomePage() {
  const prayerSchedule = await getPrayerSchedule();
  const nextPrayer = prayerSchedule.find((item) => item.status === "next") ?? prayerSchedule.at(0);

  return (
    <Container className="pb-20">
      <FadeIn>
        <section className="mx-auto max-w-5xl pt-10 sm:pt-12">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Menu utama</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Pilih tujuanmu dan langsung masuk. Ringkas, jelas, tanpa distraksi.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {mainMenu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group surface-card interactive-card rounded-[24px] px-5 py-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold tracking-[-0.02em]">{item.title}</h2>
                    <p className="text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section id="shalat-hari-ini" className="mx-auto mt-8 max-w-5xl border-t border-[var(--border)] pt-8">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Shalat hari ini</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Berikutnya:{" "}
              <span className="font-semibold text-[var(--foreground)]">{nextPrayer?.name ?? "Belum tersedia"}</span>{" "}
              ({nextPrayer?.time ?? "--:--"} WITA)
            </p>
          </div>

          <div className="surface-card rounded-[24px] p-4 sm:p-5">
            <div className="space-y-2">
              {prayerSchedule.map((item) => (
                <div
                  key={item.name}
                  className="interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    {item.status ? (
                      <span
                        aria-label={item.status === "next" ? "Waktu shalat berikutnya" : "Waktu shalat sudah lewat"}
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          item.status === "next" ? "bg-[var(--accent)]" : "bg-[var(--muted)]/45"
                        }`}
                        title={item.status === "next" ? "Waktu berikutnya" : "Sudah lewat"}
                      />
                    ) : (
                      <span
                        aria-label="Waktu shalat mendatang"
                        className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--border)]"
                        title="Belum masuk waktu"
                      />
                    )}
                    <span
                      className={`w-[4.2ch] text-right tabular-nums ${
                        item.status === "next" ? "text-sm font-semibold text-[var(--accent)]" : "text-sm font-semibold"
                      }`}
                    >
                      {item.time}
                    </span>
                    {item.status === "next" ? (
                      <span className="sr-only">
                        Waktu shalat berikutnya
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

    </Container>
  );
}
