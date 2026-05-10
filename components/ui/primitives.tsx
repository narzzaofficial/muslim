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
