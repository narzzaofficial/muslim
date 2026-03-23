"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import type { HadithItem } from "@/lib/content/types";

export function HadithItemsExplorer({
  collectionSlug,
  items,
  backHref,
}: {
  collectionSlug: string;
  items: HadithItem[];
  backHref?: string;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");

  const grades = useMemo(
    () => ["all", ...Array.from(new Set(items.map((item) => item.grade.trim()).filter(Boolean)))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      const byGrade = grade === "all" || item.grade === grade;
      const byQuery =
        !q ||
        String(item.number).includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.narrator.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q) ||
        item.translation?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q);

      return byGrade && byQuery;
    });
  }, [grade, items, query]);

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
            placeholder="Cari nomor, judul, atau perawi..."
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {grades.map((item) => (
          <button
            key={item}
            onClick={() => setGrade(item)}
            className={
              grade === item
                ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
            }
          >
            {item === "all" ? "Semua grade" : item}
          </button>
        ))}
      </div>

      <section className="mx-auto mt-6 max-w-5xl border-t border-[var(--border)] pt-6">
        <div className="surface-card surface-strong rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-[var(--muted)]">{filtered.length} hadist</p>
          </div>
          <div className="space-y-2.5">
            {filtered.map((item) => (
              <Link
                key={item.number}
                href={`/hadist/${collectionSlug}/${item.number}`}
                className="group interactive-row flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3.5"
              >
                <div className="flex items-center gap-4">
                  <p className="w-9 text-sm font-semibold text-[var(--muted)]">{item.number}</p>
                  <div>
                    <p className="text-sm font-semibold sm:text-base">{item.title}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.narrator} - {item.grade}
                    </p>
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
