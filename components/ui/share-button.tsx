"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  async function handleShare() {
    try {
      if (typeof window === "undefined") return;
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      // Silent fail for UI-only interaction.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="interactive-pill inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-medium"
      aria-label="Bagikan hadist ini"
    >
      <Share2 className="h-4 w-4" />
      Bagikan
    </button>
  );
}
