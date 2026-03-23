import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { Container } from "@/components/ui/primitives";
import { PrayerTodaySection } from "@/components/home/prayer-today-section";
import { getPrayerSchedule } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Beranda",
  description:
    "Beranda Muslim by Narzza untuk akses cepat ke Hadist, Kitab Nahwu-Sharaf, Al-Qur'an, dan jadwal shalat harian.",
  path: "/",
  keywords: ["beranda muslim", "jadwal shalat", "hadist", "quran", "kitab islam"],
});

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
        <PrayerTodaySection initialSchedule={prayerSchedule} />
      </FadeIn>

    </Container>
  );
}
