import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="py-8 sm:py-10">
      <div className="surface-card mesh-panel rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              {eyebrow}
            </span>
            <h1 className="max-w-[13ch] text-[clamp(2.35rem,4.8vw,4rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-[var(--foreground)] text-balance">
              {title}
            </h1>
          </div>

          <div className="space-y-5 lg:pl-6">
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-[1.02rem]">
              {description}
            </p>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface-card rounded-[28px] p-6", className)}>{children}</div>;
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium capitalize text-[var(--accent)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="interactive-card flex h-14 items-center rounded-2xl border border-[var(--border)] bg-[var(--card-strong)] px-4 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)]">
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)] focus-visible:outline-none"
      />
    </div>
  );
}

export function ChipRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <button
          key={item}
          className={cn(
            "interactive-pill rounded-full border px-4 py-2 text-sm",
            index === 0
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="interactive-card inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/15"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="interactive-pill inline-flex items-center justify-center rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
    >
      {children}
    </Link>
  );
}
