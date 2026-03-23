"use client";

import { useMemo, useState } from "react";
import type { HadithTafsirVersion } from "@/lib/content/types";

type HadithTafsirPanelProps = {
  summary?: string | null;
  versions?: HadithTafsirVersion[];
};

type Option = {
  key: string;
  label: string;
  content: string;
};

export function HadithTafsirPanel({ summary, versions = [] }: HadithTafsirPanelProps) {
  const options = useMemo<Option[]>(() => {
    const result: Option[] = [];
    const cleanSummary = summary?.trim();

    if (cleanSummary) {
      result.push({
        key: "ringkas",
        label: "Tafsir Ringkas",
        content: cleanSummary,
      });
    }

    versions.forEach((item) => {
      result.push({
        key: item.sourceKey,
        label: item.source,
        content: item.content,
      });
    });

    return result;
  }, [summary, versions]);

  const [selectedKey, setSelectedKey] = useState(options[0]?.key ?? "");
  const active = options.find((item) => item.key === selectedKey) ?? options[0];

  return (
    <div className="surface-card rounded-[26px] p-6 sm:p-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Tafsir</p>
        {options.length > 1 ? (
          <select
            value={selectedKey}
            onChange={(event) => setSelectedKey(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
            aria-label="Pilih versi tafsir hadith"
          >
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <p className="text-sm leading-8 text-[var(--foreground)]/88 sm:text-base">{active?.content ?? "-"}</p>
    </div>
  );
}
