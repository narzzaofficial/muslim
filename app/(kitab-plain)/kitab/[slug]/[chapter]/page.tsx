import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { ShareButton } from "@/components/ui/share-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getKitabBookBySlug, getKitabBooks, getKitabChapterBySlug, getKitabChaptersByBook } from "@/lib/content/repository";

export const revalidate = 2592000;

export async function generateStaticParams() {
  const books = await getKitabBooks();
  const params: { slug: string; chapter: string }[] = [];

  for (const book of books) {
    const chapters = await getKitabChaptersByBook(book.slug);
    chapters.forEach((chapter) => {
      params.push({ slug: book.slug, chapter: chapter.slug });
    });
  }

  return params;
}

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const [book, chapters, activeChapter] = await Promise.all([
    getKitabBookBySlug(slug),
    getKitabChaptersByBook(slug),
    getKitabChapterBySlug(slug, chapter),
  ]);

  if (!activeChapter) {
    notFound();
  }

  const chapterIndex = chapters.findIndex((item) => item.slug === chapter);
  const activeIndex = chapterIndex >= 0 ? chapterIndex : 0;
  const prev = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const next = activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;

  const qaThread = [
    { role: "q", text: "Ustaz, inti kaidah ini apa?" },
    { role: "a", text: "Intinya, isim dikenali lewat tanda, bukan lewat tebakan rasa bahasa." },
    { role: "q", text: "Kenapa harus pakai tanda dulu?" },
    { role: "a", text: "Karena tanda itu objektif. Kalau tanda ada, keputusan i'rab jadi lebih aman." },
    { role: "q", text: "Frasa al-ismu yu'rafu bil-jarri itu dibaca logikanya bagaimana?" },
    { role: "a", text: "Al-ismu sebagai topik, yu'rafu sebagai predikat, bil-jarri sebagai cara mengenali." },
    { role: "q", text: "Berarti jar itu seperti sinyal identitas?" },
    { role: "a", text: "Betul. Saat kata menerima jar, itu sinyal kuat bahwa dia isim." },
    { role: "q", text: "Kalau ada huruf jar sebelum kata, langkah saya apa?" },
    { role: "a", text: "Tandai huruf jar, cek kata sesudahnya, lalu tetapkan sebagai isim majrur." },
    { role: "q", text: "Kalau kalimat panjang dan saya mulai bingung?" },
    { role: "a", text: "Pecah jadi unit kecil. Cari penanda jar, tanwin, nida, alif lam, dan idhafah." },
    { role: "q", text: "Tanwin juga penanda isim kan?" },
    { role: "a", text: "Iya. Kalau tanwin valid secara kaidah, itu menguatkan bahwa kata tersebut isim." },
    { role: "q", text: "Idhafah membantu apa untuk pemula?" },
    { role: "a", text: "Idhafah membantu membaca relasi antar isim, misalnya makna milik atau keterkaitan." },
    { role: "q", text: "Kesalahan paling umum pemula apa?" },
    { role: "a", text: "Langsung menebak arti global tanpa memetakan jenis kata terlebih dahulu." },
    { role: "q", text: "Urutan belajar paling aman untuk bab ini bagaimana?" },
    { role: "a", text: "Kenali tanda, tentukan jenis kata, tetapkan i'rab, lalu baca makna kalimat utuh." },
  ] as const;

  return (
    <Container className="pb-20">
      <section className="mx-auto max-w-4xl pt-10 sm:pt-12">
        <div className="surface-card surface-strong rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/kitab/${slug}`}
              className="interactive-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke daftar isi
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={`${book.title} - ${activeChapter.title}`} />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="surface-card surface-strong mt-5 rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {book.category}
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {book.level}
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Bab Kitab
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{activeChapter.title}</h1>
        </div>
      </section>

      <section className="mx-auto mt-4 max-w-4xl space-y-5 border-t border-[var(--border)] pt-4">
        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Teks Arab</p>
          <p className="arabic-text text-right text-3xl leading-[2.2] sm:text-[2.35rem]">{activeChapter.arabicText ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Terjemahan</p>
          <p className="text-sm leading-8 text-[var(--foreground)]/88 sm:text-base">{activeChapter.translation ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Penjelasan Singkat</p>
          <p className="text-sm leading-8 text-[var(--foreground)]/88 sm:text-base">{activeChapter.explanation ?? "-"}</p>
        </div>

        <div className="surface-card rounded-[26px] p-6 sm:p-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Penjelasan Detail (Q&A)</p>
          <div className="space-y-6 px-1 sm:px-2">
            {qaThread.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === "q" ? "justify-start" : "justify-end"}`}>
                <div
                  className={
                    item.role === "q"
                      ? "max-w-[80%] rounded-3xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--card-strong)_85%,transparent)] px-5 py-4"
                      : "max-w-[80%] rounded-3xl border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-4"
                  }
                >
                  <p className="text-sm leading-6 sm:text-[15px]">
                    <span className="mr-2 font-semibold text-[var(--accent)]">{item.role === "q" ? "Q:" : "A:"}</span>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-4xl border-t border-[var(--border)] pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/kitab/${slug}/${prev.slug}`}
              className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]">Awal pelajaran</div>
          )}

          {next ? (
            <Link
              href={`/kitab/${slug}/${next.slug}`}
              className="interactive-pill rounded-xl border border-[var(--border)] px-4 py-3 text-right text-sm"
            >
              <span className="inline-flex items-center gap-2">
                {next.title}
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-right text-sm text-[var(--muted)]">Akhir pelajaran</div>
          )}
        </div>
      </section>
    </Container>
  );
}

