"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Surah } from "@/lib/content/types";

export function QuranSurahExplorer({
  surahs,
}: {
  surahs: Surah[];
}) {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");

  const origins = useMemo(
    () => ["all", ...Array.from(new Set(surahs.map((item) => item.origin).filter(Boolean)))],
    [surahs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return surahs.filter((item) => {
      const byOrigin = origin === "all" || item.origin === origin;
      const byQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        String(item.verses).includes(q);

      return byOrigin && byQuery;
    });
  }, [origin, query, surahs]);

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="interactive-card flex h-14 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari surah atau nomor..."
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Kategori</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {origins.map((item) => (
            <button
              key={item}
              onClick={() => setOrigin(item)}
              className={
                origin === item
                  ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                  : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
              }
            >
              {item === "all" ? "Semua" : item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Daftar surah</h2>
        </div>
        <div className="space-y-2">
          {filtered.map((item, index) => (
            <Link
              key={item.slug}
              href={`/quran/${item.slug}`}
              className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <p className="w-8 text-sm font-semibold text-[var(--muted)]">{index + 1}</p>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.origin} - {item.verses} ayat
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="arabic-text text-xl">{item.arabic}</p>
                <ArrowUpRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
