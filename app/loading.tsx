import { Container } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-5xl animate-pulse pt-10 sm:pt-12">
        <div className="mb-6 flex flex-col items-center">
          <div className="h-7 w-44 rounded-full bg-black/8 dark:bg-white/10" />
          <div className="mt-3 h-4 w-80 max-w-[90%] rounded-full bg-black/8 dark:bg-white/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface-card rounded-3xl p-5">
            <div className="h-5 w-32 rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-3 h-4 w-full rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-2 h-4 w-4/5 rounded-full bg-black/8 dark:bg-white/10" />
          </div>
          <div className="surface-card rounded-3xl p-5">
            <div className="h-5 w-36 rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-3 h-4 w-full rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-2 h-4 w-4/5 rounded-full bg-black/8 dark:bg-white/10" />
          </div>
          <div className="surface-card rounded-3xl p-5">
            <div className="h-5 w-28 rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-3 h-4 w-full rounded-full bg-black/8 dark:bg-white/10" />
            <div className="mt-2 h-4 w-4/5 rounded-full bg-black/8 dark:bg-white/10" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-5xl animate-pulse border-t border-[var(--border)] pt-8">
        <div className="mb-5 flex flex-col items-center">
          <div className="h-5 w-40 rounded-full bg-black/8 dark:bg-white/10" />
          <div className="mt-2 h-4 w-72 max-w-[90%] rounded-full bg-black/8 dark:bg-white/10" />
        </div>

        <div className="surface-card rounded-3xl p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <div className="h-4 w-16 rounded-full bg-black/8 dark:bg-white/10" />
              <div className="h-4 w-10 rounded-full bg-black/8 dark:bg-white/10" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <div className="h-4 w-16 rounded-full bg-black/8 dark:bg-white/10" />
              <div className="h-4 w-10 rounded-full bg-black/8 dark:bg-white/10" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <div className="h-4 w-16 rounded-full bg-black/8 dark:bg-white/10" />
              <div className="h-4 w-10 rounded-full bg-black/8 dark:bg-white/10" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <div className="h-4 w-16 rounded-full bg-black/8 dark:bg-white/10" />
              <div className="h-4 w-10 rounded-full bg-black/8 dark:bg-white/10" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <div className="h-4 w-16 rounded-full bg-black/8 dark:bg-white/10" />
              <div className="h-4 w-10 rounded-full bg-black/8 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
