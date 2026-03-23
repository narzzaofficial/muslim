"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HadithCollection } from "@/lib/content/types";

export function HadithCollectionsExplorer({
  collections,
}: {
  collections: HadithCollection[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => [{ key: "all", label: "Semua" }, ...collections.map((c) => ({ key: c.slug, label: c.name }))],
    [collections],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collections.filter((item) => {
      const byCategory = category === "all" || item.slug === category;
      const byQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [collections, category, query]);

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="interactive-card flex h-14 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari hadist, perawi, atau tema..."
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Kategori</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item.key}
              onClick={() => setCategory(item.key)}
              className={
                category === item.key
                  ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                  : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Koleksi</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((collection) => (
            <Link
              key={collection.slug}
              href={`/hadist/${collection.slug}`}
              className="group surface-card interactive-card rounded-[22px] px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{collection.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{collection.count}</p>
                  <p className="pt-1 text-sm leading-7 text-[var(--muted)]">{collection.description}</p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--card-strong)] p-2 text-[color:color-mix(in_srgb,var(--foreground)_72%,var(--muted)_28%)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
