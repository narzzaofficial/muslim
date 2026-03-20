"use client";

import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolvedTheme ?? "system"}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          whileTap={{ scale: 0.92 }}
        >
          {isDark ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
