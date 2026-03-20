import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdminAction } from "@/app/admin/actions";
import { Container } from "@/components/ui/primitives";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <Container className="pb-14">
      <section className="mx-auto max-w-4xl pt-8 sm:pt-10">
        <div className="surface-card surface-strong rounded-[22px] px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Admin Panel</p>
              <p className="text-sm text-[var(--muted)]">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="interactive-pill inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
              >
                Lihat situs
              </Link>
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="interactive-pill inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {children}
    </Container>
  );
}
