import { redirect } from "next/navigation";
import { loginAdminAction } from "@/app/admin/actions";
import { Container } from "@/components/ui/primitives";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  const query = await searchParams;

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-lg pt-16 sm:pt-24">
        <div className="surface-card surface-strong rounded-[28px] p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Login Admin</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Akses ini hanya untuk update konten. Tidak ada login user publik.</p>

          {query.error ? (
            <div className="mt-4 rounded-xl border border-red-400/45 bg-red-500/10 px-3 py-2 text-sm text-red-200">{query.error}</div>
          ) : null}

          <form action={loginAdminAction} className="mt-5 space-y-3">
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                placeholder="admin@email.com"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                placeholder="********"
              />
            </label>

            <button
              type="submit"
              className="interactive-pill mt-2 inline-flex w-full items-center justify-center rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]"
            >
              Masuk
            </button>
          </form>
        </div>
      </section>
    </Container>
  );
}
