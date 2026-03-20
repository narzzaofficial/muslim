import Link from "next/link";
import { BookOpen, Compass } from "lucide-react";
import { navLinks } from "@/data/content";
import { MobileMenu } from "@/components/mobile-menu";
import { Container } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-xl">
      <Container className="relative flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-lg shadow-green-900/15">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Narzza</div>
            <div className="text-[1rem] font-semibold tracking-[-0.02em]">Muslim</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-2 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="interactive-pill rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/quran"
            className="interactive-card inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[var(--background)]"
          >
            <BookOpen className="h-4 w-4" />
            Baca
          </Link>
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
