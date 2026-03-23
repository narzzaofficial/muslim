"use client";

import { useMemo, useState } from "react";
import type { Ayah } from "@/lib/content/types";

type AyahCategory = "all" | "with-tafsir" | "without-tafsir";

export function QuranAyahsExplorer({
  ayahs,
}: {
  ayahs: Ayah[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AyahCategory>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return ayahs.filter((ayah) => {
      const hasTafsir = Boolean(ayah.tafsir?.trim());
      const byCategory =
        category === "all" || (category === "with-tafsir" ? hasTafsir : !hasTafsir);
      const byQuery =
        !q ||
        String(ayah.number).includes(q) ||
        ayah.arabic.includes(q) ||
        ayah.translation.toLowerCase().includes(q) ||
        ayah.tafsir?.toLowerCase().includes(q);

      return byCategory && byQuery;
    });
  }, [ayahs, category, query]);

  return (
    <>
      <section className="mx-auto mt-6 max-w-4xl">
        <div className="mx-auto max-w-2xl">
          <div className="interactive-card flex h-14 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari ayat, terjemahan, atau tafsir..."
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
            onClick={() => setCategory("with-tafsir")}
            className={
              category === "with-tafsir"
                ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
            }
          >
            Ada tafsir
          </button>
          <button
            onClick={() => setCategory("without-tafsir")}
            className={
              category === "without-tafsir"
                ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
            }
          >
            Tanpa tafsir
          </button>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-4xl border-t border-[var(--border)] pt-6">
        <div className="space-y-4">
          {filtered.map((ayah) => (
            <article key={ayah.number} className="surface-card rounded-[24px] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  Ayat {ayah.number}
                </span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] px-4 py-4 sm:px-5">
                <p className="arabic-text text-right text-3xl leading-[2.2]">{ayah.arabic}</p>
              </div>

              <div className="mt-3 rounded-2xl border border-[var(--border)] px-4 py-4 sm:px-5">
                <p className="text-sm leading-8 text-[var(--foreground)]/88">{ayah.translation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

