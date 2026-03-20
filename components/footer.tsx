import Link from "next/link";
import { navLinks } from "@/data/content";
import { Container } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-[var(--border)] py-8">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Muslim by Narzza</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Sederhana, fokus, dan nyaman dipakai setiap hari.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="interactive-pill rounded-full px-2 py-1 hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
