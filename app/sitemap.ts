import type { MetadataRoute } from "next";
import {
  getHadithCollections,
  getHadithItemsByCollection,
  getKitabBooks,
  getKitabChaptersByBook,
  getSurahList,
} from "@/lib/content/repository";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/hadist"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/kitab"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/quran"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const [collections, books, surahs] = await Promise.all([getHadithCollections(), getKitabBooks(), getSurahList()]);

    const hadithCollections = collections.map((collection) => ({
      url: absoluteUrl(`/hadist/${collection.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    routes.push(...hadithCollections);

    const hadithDetails = (
      await Promise.all(
        collections.map(async (collection) => {
          const items = await getHadithItemsByCollection(collection.slug);
          return items.map((item) => ({
            url: absoluteUrl(`/hadist/${collection.slug}/${item.number}`),
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
        }),
      )
    ).flat();
    routes.push(...hadithDetails);

    const kitabBooks = books.map((book) => ({
      url: absoluteUrl(`/kitab/${book.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    routes.push(...kitabBooks);

    const kitabChapters = (
      await Promise.all(
        books.map(async (book) => {
          const chapters = await getKitabChaptersByBook(book.slug);
          return chapters.map((chapter) => ({
            url: absoluteUrl(`/kitab/${book.slug}/${chapter.slug}`),
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
        }),
      )
    ).flat();
    routes.push(...kitabChapters);

    const quranSurahs = surahs.map((surah) => ({
      url: absoluteUrl(`/quran/${surah.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    routes.push(...quranSurahs);
  } catch {
    return routes;
  }

  return routes;
}
