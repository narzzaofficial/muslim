import Link from "next/link";
import { navLinks } from "@/data/content";
import { MobileMenu } from "@/components/mobile-menu";
import { Container } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-xl">
      <Container className="relative flex h-20 items-center justify-between gap-6 lg:justify-center">
        <Link href="/" aria-label="Narzza Muslim" className="inline-flex items-center gap-3 lg:absolute lg:left-6">
          <BrandLogo sizeClassName="h-12 w-auto" />
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-[-0.02em]">Narzza Muslim</span>
            <span className="block text-[11px] font-medium tracking-[0.08em] text-[var(--muted)] uppercase">
              In Shaa Allah Barokah
            </span>
          </span>
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

        <div className="hidden items-center lg:absolute lg:right-6 lg:flex">
          <ThemeToggle />
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
