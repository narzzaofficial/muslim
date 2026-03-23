"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/data/content";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

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
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Narzza Muslim"
              className="mb-4 inline-flex items-center gap-3"
            >
              <BrandLogo sizeClassName="h-11 w-auto" />
              <span className="leading-tight">
                <span className="block text-base font-semibold tracking-[-0.02em]">Narzza Muslim</span>
                <span className="block text-[11px] font-medium tracking-[0.08em] text-[var(--muted)] uppercase">
                  Baca. Belajar. Tadabbur.
                </span>
              </span>
            </Link>

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
