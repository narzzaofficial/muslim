"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { KitabBook } from "@/lib/content/types";

export function KitabBooksExplorer({
  books,
}: {
  books: KitabBook[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(books.map((b) => b.category.toLowerCase())))],
    [books],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const byCategory = category === "all" || book.category.toLowerCase() === category;
      const byQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.slug.toLowerCase().includes(q) ||
        book.level.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [books, category, query]);

  return (
    <>
      <div className="mx-auto mt-5 max-w-2xl">
        <div className="interactive-card flex h-14 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kitab, level, atau jumlah pelajaran..."
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={
              category === item
                ? "interactive-pill rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                : "interactive-pill rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
            }
          >
            {item === "all" ? "Semua" : item}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((book) => (
            <Link
              key={book.slug}
              href={`/kitab/${book.slug}`}
              className="group surface-card interactive-card relative overflow-hidden rounded-2xl border border-[var(--border)] p-4"
            >
              <div className="flex gap-4">
                <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
                  <div
                    role="img"
                    aria-label={`Cover ${book.title}`}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${book.coverImage})` }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{book.level}</p>
                      <p className="mt-2 text-lg font-semibold leading-snug">{book.title}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-[var(--muted)]">
                      {book.category} - {book.lessons} pelajaran
                    </p>
                    <p className="text-xs leading-6 text-[var(--muted)]">{book.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
