"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import type { KitabChapter } from "@/lib/content/types";

type DurationBucket = "all" | "short" | "medium" | "long";

function toMinutes(duration: string) {
  const parsed = Number.parseInt(duration, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBucket(duration: string): Exclude<DurationBucket, "all"> {
  const minutes = toMinutes(duration);
  if (minutes <= 10) return "short";
  if (minutes <= 15) return "medium";
  return "long";
}

export function KitabChaptersExplorer({
  slug,
  chapters,
  backHref,
}: {
  slug: string;
  chapters: KitabChapter[];
  backHref?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DurationBucket>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return chapters.filter((chapter) => {
      const bucket = toBucket(chapter.duration);
      const byCategory = category === "all" || bucket === category;
      const byQuery =
        !q ||
        chapter.title.toLowerCase().includes(q) ||
        chapter.duration.toLowerCase().includes(q) ||
        chapter.translation?.toLowerCase().includes(q) ||
        chapter.explanation?.toLowerCase().includes(q);

      return byCategory && byQuery;
    });
  }, [category, chapters, query]);

  return (
    <>
      <div className="mx-auto mt-5 flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
        {backHref ? (
          <Link
            href={backHref}
            className="interactive-pill inline-flex h-14 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>
        ) : null}
        <div className="interactive-card flex h-14 flex-1 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari bab atau kata kunci pelajaran..."
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCategory("all")}
          className={
            category === "all"
              ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
              : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
          }
        >
          Semua
        </button>
        <button
          onClick={() => setCategory("short")}
          className={
            category === "short"
              ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
              : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
          }
        >
          Singkat
        </button>
        <button
          onClick={() => setCategory("medium")}
          className={
            category === "medium"
              ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
              : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
          }
        >
          Menengah
        </button>
        <button
          onClick={() => setCategory("long")}
          className={
            category === "long"
              ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
              : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
          }
        >
          Panjang
        </button>
      </div>

      <section className="mx-auto mt-6 max-w-5xl border-t border-[var(--border)] pt-6">
        <div className="surface-card surface-strong rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-[var(--muted)]">Daftar isi ({filtered.length})</p>
          </div>
          <div className="space-y-2.5">
            {filtered.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/kitab/${slug}/${chapter.slug}`}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3.5"
              >
                <div className="flex items-center gap-4">
                  <p className="w-9 text-sm font-semibold text-[var(--muted)]">{index + 1}</p>
                  <div>
                    <p className="text-sm font-semibold sm:text-base">{chapter.title}</p>
                    <p className="text-xs text-[var(--muted)]">{chapter.duration}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--accent)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
