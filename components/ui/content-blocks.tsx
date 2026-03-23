import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Headphones,
  MapPin,
  Moon,
  NotebookPen,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, SurfaceCard } from "@/components/ui/primitives";
import type { Prayer } from "@/data/content";

export function QuickAccessCard({
  eyebrow,
  title,
  description,
  href,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "surface-card interactive-card group mesh-panel flex h-full flex-col rounded-[30px] p-6",
        featured ? "min-h-[320px] sm:p-8" : "min-h-[280px]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          {eyebrow}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/40 text-[var(--muted)] transition-all group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)] dark:bg-white/5">
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <div className={cn("space-y-4", featured && "max-w-3xl")}>
          <h3
            className={cn(
              "leading-tight font-semibold tracking-tight text-balance",
              featured ? "max-w-[12ch] text-[2.6rem] sm:text-[3rem]" : "max-w-[14ch] text-[1.9rem]",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "leading-8 text-[var(--muted)]",
              featured ? "max-w-[58ch] text-base" : "max-w-[30ch] text-sm",
            )}
          >
            {description}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/82 transition-colors group-hover:text-[var(--accent)]">
            Buka halaman
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PrayerOverview({
  prayers,
  compact = false,
}: {
  prayers: Prayer[];
  compact?: boolean;
}) {
  return (
    <SurfaceCard className={cn("mesh-panel", compact ? "p-5" : "p-6")}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">Shalat Berikutnya</p>
          <h3 className="mt-1 text-2xl font-semibold">Ashar dalam 01:12:24</h3>
        </div>
        <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Makassar</p>
          <p className="text-lg font-semibold">15:23 WITA</p>
        </div>
      </div>
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3",
              prayer.status === "next" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)]",
            )}
          >
            <div className="flex items-center gap-3">
              <Clock3 className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-medium">{prayer.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {prayer.status ? <Badge>{prayer.status === "next" ? "Berikutnya" : "Selesai"}</Badge> : null}
              <span className="text-sm font-semibold">{prayer.time}</span>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function ContinueCard({
  title,
  subtitle,
  progress,
  href,
}: {
  title: string;
  subtitle: string;
  progress: number;
  href: string;
}) {
  return (
    <Link href={href} className="surface-card interactive-card rounded-[28px] p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
        </div>
        <div className="h-2 rounded-full bg-black/5 dark:bg-white/10">
          <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{progress}% progres tersimpan</p>
      </div>
    </Link>
  );
}

export function HadithFeature({
  title,
  arabic,
  translation,
  meta,
}: {
  title: string;
  arabic: string;
  translation: string;
  meta: string;
}) {
  return (
    <SurfaceCard className="mesh-panel rounded-[32px] p-7">
      <div className="space-y-5">
        <Badge>{meta}</Badge>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="arabic-text text-right text-3xl leading-[2.3] sm:text-4xl">{arabic}</p>
        <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">{translation}</p>
      </div>
    </SurfaceCard>
  );
}

export function ArabicBlock({ text }: { text: string }) {
  return (
    <SurfaceCard className="rounded-[32px] p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Teks Arab</h3>
        <Badge>Arab</Badge>
      </div>
      <p className="arabic-text text-right text-3xl leading-[2.5] sm:text-[2.65rem]">{text}</p>
    </SurfaceCard>
  );
}

export function TranslationBlock({ text, title = "Terjemah" }: { text: string; title?: string }) {
  return (
    <SurfaceCard className="rounded-[32px] p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge>Indonesia</Badge>
      </div>
      <p className="text-base leading-8 text-[var(--foreground)]/88">{text}</p>
    </SurfaceCard>
  );
}

export function ChatExplanation({ items }: { items: { role: string; text: string }[] }) {
  return (
    <SurfaceCard className="rounded-[32px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Penjelasan Narzza</h3>
        <Badge>Gaya Chat</Badge>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.role}-${index}`} className={cn("flex", item.role === "assistant" ? "justify-start" : "justify-end")}>
            <div
              className={cn(
                "max-w-xl rounded-[24px] px-5 py-4 text-sm leading-7",
                item.role === "assistant"
                  ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                  : "surface-strong border border-[var(--border)]",
              )}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function SanadTree({ items }: { items: string[] }) {
  return (
    <SurfaceCard className="rounded-[32px] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Visualisasi Sanad</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">Rantai periwayatan diringkas agar mudah dipindai secara visual.</p>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-4">
            <div className="flex w-10 justify-center">
              <div className="relative h-10 w-px bg-[var(--border)]">
                {index < items.length - 1 ? <div className="absolute top-10 h-6 w-px bg-[var(--border)]" /> : null}
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-[var(--border)] px-4 py-3">
              <p className="font-medium">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function MetadataGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <SurfaceCard key={item.label} className="rounded-[28px] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</p>
          <p className="mt-3 text-base font-semibold">{item.value}</p>
        </SurfaceCard>
      ))}
    </div>
  );
}

export function BookCard({
  title,
  category,
  level,
  lessons,
  description,
  href,
}: {
  title: string;
  category: string;
  level: string;
  lessons: number;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="surface-card interactive-card rounded-[28px] p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--accent)]">{category}</p>
            <h3 className="mt-2 text-xl font-semibold">{title}</h3>
          </div>
          <Badge>{level}</Badge>
        </div>
        <p className="text-sm leading-7 text-[var(--muted)]">{description}</p>
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>{lessons} pelajaran</span>
          <span>Lanjutkan belajar</span>
        </div>
      </div>
    </Link>
  );
}

export function SurahCard({
  name,
  arabic,
  verses,
  origin,
  href,
}: {
  name: string;
  arabic: string;
  verses: number;
  origin: string;
  href: string;
}) {
  return (
    <Link href={href} className="surface-card interactive-card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {origin} • {verses} ayat
          </p>
        </div>
        <p className="arabic-text text-3xl">{arabic}</p>
      </div>
    </Link>
  );
}

export function FeaturedSurahCard({
  name,
  arabic,
  verses,
  origin,
  summary,
  href,
}: {
  name: string;
  arabic: string;
  verses: number;
  origin: string;
  summary: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="surface-card interactive-card mesh-panel group block overflow-hidden rounded-[34px] p-7 sm:p-8"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Surah Pilihan
          </span>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight sm:text-[2.1rem]">{name}</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {origin} • {verses} ayat
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="rounded-[28px] border border-[var(--border)] bg-white/45 px-5 py-4 shadow-sm dark:bg-white/5">
            <p className="arabic-text text-4xl leading-none sm:text-5xl">{arabic}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-white/70 p-6 shadow-sm dark:bg-white/4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Ringkasan</p>
        <p className="mt-4 max-w-[34ch] text-base leading-8 text-[var(--muted)]">{summary}</p>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/82 transition-colors group-hover:text-[var(--accent)]">
        Buka surat
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function StickySummary({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <SurfaceCard className="rounded-[32px] p-6 lg:sticky lg:top-28">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--border)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function SelectorCard({
  title,
  icon,
  value,
}: {
  title: string;
  icon: "location" | "moon";
  value: string;
}) {
  const Icon = icon === "location" ? MapPin : Moon;

  return (
    <SurfaceCard className="rounded-[28px] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">{title}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function AudioControlBar() {
  return (
    <SurfaceCard className="rounded-[28px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Kontrol Audio</p>
          <p className="font-semibold">Mishary Rashid Alafasy</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[var(--border)] p-3">
            <Volume2 className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-[var(--accent)] p-4 text-white">
            <Play className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-[var(--border)] p-3">
            <Pause className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-[var(--border)] p-3">
            <Headphones className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function LessonList({ items }: { items: { slug: string; title: string; duration: string; completed: boolean }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Link
          key={item.slug}
          href={`/kitab/mukhtashar-jiddan/${item.slug}`}
          className="surface-card flex items-center justify-between rounded-[24px] p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] font-semibold text-[var(--accent)]">
              {index + 1}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-[var(--muted)]">{item.duration}</p>
            </div>
          </div>
          <Badge>{item.completed ? "selesai" : "lanjut"}</Badge>
        </Link>
      ))}
    </div>
  );
}

export function AyahCard({
  number,
  arabic,
  translation,
  tafsir,
}: {
  number: number;
  arabic: string;
  translation: string;
  tafsir: string;
}) {
  return (
    <SurfaceCard className="rounded-[32px] p-7">
      <div className="flex items-center justify-between gap-4">
        <Badge>Ayat {number}</Badge>
        <button className="rounded-full border border-[var(--border)] p-3">
          <NotebookPen className="h-4 w-4" />
        </button>
      </div>
      <p className="arabic-text mt-8 text-right text-3xl leading-[2.45] sm:text-[2.45rem]">{arabic}</p>
      <p className="mt-8 text-base leading-8">{translation}</p>
      <div className="mt-6 rounded-[24px] bg-[var(--accent-soft)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Pratinjau Tafsir</p>
        <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/85">{tafsir}</p>
      </div>
    </SurfaceCard>
  );
}

export function SkeletonPreview() {
  return (
    <div className="surface-card rounded-[32px] p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-black/8 dark:bg-white/10" />
        <div className="h-8 w-3/4 rounded-full bg-black/8 dark:bg-white/10" />
        <div className="h-24 rounded-[24px] bg-black/8 dark:bg-white/10" />
      </div>
    </div>
  );
}
