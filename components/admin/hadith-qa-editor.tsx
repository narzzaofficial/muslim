"use client";

import { useMemo, useState } from "react";

type QaLineRole = "question" | "answer";

type QaLine = {
  id: number;
  role: QaLineRole;
  text: string;
  imageUrl?: string;
};

type HadithQaEditorValue = {
  sourceName: string;
  sourceUrl: string;
  lines: QaLine[];
};

type HadithQaEditorProps = {
  name: string;
  initialValue?: HadithQaEditorValue;
};

function makeLine(role: QaLineRole, id: number): QaLine {
  return { id, role, text: "", imageUrl: "" };
}

function normalizeInitial(value?: HadithQaEditorValue): { value: HadithQaEditorValue; nextId: number } {
  if (!value) {
    return {
      value: {
        sourceName: "",
        sourceUrl: "",
        lines: [makeLine("question", 1), makeLine("answer", 2)],
      },
      nextId: 3,
    };
  }

  const normalizedLines = Array.isArray(value.lines)
    ? value.lines
        .map((item) => {
          const role: QaLineRole = item.role === "answer" ? "answer" : "question";
          return {
            id: Number(item.id) || 0,
            role,
            text: typeof item.text === "string" ? item.text : "",
            imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
          };
        })
        .filter((item) => item.text.trim().length > 0 || item.imageUrl)
    : [];

  return {
    value: {
      sourceName: value.sourceName ?? "",
      sourceUrl: value.sourceUrl ?? "",
      lines: normalizedLines.length ? normalizedLines : [makeLine("question", 1), makeLine("answer", 2)],
    },
    nextId:
      (normalizedLines.length ? Math.max(...normalizedLines.map((item) => item.id)) : 2) + 1,
  };
}

export function HadithQaEditor({ name, initialValue }: HadithQaEditorProps) {
  const initial = normalizeInitial(initialValue);
  const [state, setState] = useState<HadithQaEditorValue>(initial.value);
  const [nextId, setNextId] = useState<number>(initial.nextId);

  const serialized = useMemo(() => {
    return JSON.stringify({
      sourceName: state.sourceName.trim(),
      sourceUrl: state.sourceUrl.trim(),
      lines: state.lines.map((item) => ({
        role: item.role,
        text: item.text.trim(),
        imageUrl: item.imageUrl?.trim() || undefined,
      })),
    });
  }, [state]);

  return (
    <div className="rounded-lg border border-(--border) p-3">
      <p className="text-sm font-medium">Penjelasan Author (Q&A) Dinamis</p>
      <p className="mt-1 text-xs text-(--muted)">Format chat lines, khusus input admin hadist.</p>

      <input
        type="hidden"
        name={name}
        value={serialized}
        readOnly
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={state.sourceName}
          onChange={(event) => setState((prev) => ({ ...prev, sourceName: event.target.value }))}
          placeholder="Nama sumber (contoh: Kompas.com)"
          className="rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="url"
          value={state.sourceUrl}
          onChange={(event) => setState((prev) => ({ ...prev, sourceUrl: event.target.value }))}
          placeholder="URL sumber (contoh: https://...)"
          className="rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--muted)]">Chat Lines (Tanya/Jawab)</p>
        <button
          type="button"
          className="interactive-pill rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
          onClick={() => {
            setState((prev) => ({ ...prev, lines: [...prev.lines, makeLine("question", nextId)] }));
            setNextId((prev) => prev + 1);
          }}
        >
          + Tambah Line
        </button>
      </div>

      <div className="mt-2 space-y-3">
        {state.lines.map((line) => (
          <div key={line.id} className="rounded-lg border border-[var(--border)] p-3">
            <div className="flex gap-2">
              <select
                value={line.role}
                onChange={(event) => {
                  const role = event.target.value === "answer" ? "answer" : "question";
                  setState((prev) => ({
                    ...prev,
                    lines: prev.lines.map((item) => (item.id === line.id ? { ...item, role } : item)),
                  }));
                }}
                className="w-28 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                <option value="question">Tanya</option>
                <option value="answer">Jawab</option>
              </select>

              <input
                type="text"
                value={line.text}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    lines: prev.lines.map((item) => (item.id === line.id ? { ...item, text: event.target.value } : item)),
                  }))
                }
                placeholder={line.role === "question" ? "Pertanyaan..." : "Jawaban..."}
                className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
              />

              <button
                type="button"
                className="interactive-pill rounded-lg border border-red-400/40 px-3 py-2 text-sm text-red-300"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    lines: prev.lines.length > 1 ? prev.lines.filter((item) => item.id !== line.id) : prev.lines,
                  }))
                }
                aria-label="Hapus line"
                title="Hapus line"
              >
                x
              </button>
            </div>

            <div className="mt-2">
              <p className="text-xs font-medium text-[var(--muted)]">Gambar (opsional)</p>
              <input
                type="url"
                value={line.imageUrl ?? ""}
                onChange={(event) =>
                  setState((prev) => ({
                    ...prev,
                    lines: prev.lines.map((item) => (item.id === line.id ? { ...item, imageUrl: event.target.value } : item)),
                  }))
                }
                placeholder="URL gambar (opsional)"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
