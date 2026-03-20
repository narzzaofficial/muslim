import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { continueItems, prayerSchedule } from "@/data/mock";
import { FadeIn } from "@/components/ui/motion";
import { Container } from "@/components/ui/primitives";

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

export default function HomePage() {
  const nextPrayer = prayerSchedule.find((item) => item.status === "next") ?? prayerSchedule[2];

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
              Berikutnya: <span className="font-semibold text-[var(--foreground)]">{nextPrayer.name}</span> ({nextPrayer.time} WITA)
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
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent)]">
                        {item.status === "next" ? "Berikutnya" : "Selesai"}
                      </span>
                    ) : null}
                    <span className="text-sm font-semibold">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.14}>
        <section className="mx-auto mt-8 max-w-5xl border-t border-[var(--border)] pt-8 text-center">
          <p className="text-sm font-medium text-[var(--muted)]">Lanjut cepat</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {continueItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium"
              >
                <span>{item.title}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>
    </Container>
  );
}
