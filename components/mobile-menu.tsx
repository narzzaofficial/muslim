"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/data/mock";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        aria-label="Buka menu navigasi"
        onClick={() => setOpen((value) => !value)}
        className="surface-card interactive-card flex h-11 w-11 items-center justify-center rounded-full"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="surface-card absolute inset-x-4 top-20 rounded-[28px] p-5"
          >
            <div className="space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "interactive-pill block rounded-2xl px-4 py-3 text-sm font-medium",
                    pathname === item.href ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3">
              <span className="text-sm text-[var(--muted)]">Tema tampilan</span>
              <ThemeToggle />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
