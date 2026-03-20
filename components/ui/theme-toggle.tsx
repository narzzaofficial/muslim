"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Ubah tema tampilan"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="surface-card interactive-card flex h-11 w-11 items-center justify-center rounded-full text-[var(--foreground)]"
    >
      <SunMedium className="h-4 w-4 dark:hidden" />
      <MoonStar className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
