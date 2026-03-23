import type { Metadata } from "next";

export const siteConfig = {
  name: "Muslim by Narzza",
  shortName: "Muslim",
  description:
    "Platform Muslim by Narzza untuk baca Al-Qur'an, hadist, dan kitab Nahwu-Sharaf dengan tampilan fokus dan nyaman.",
  url: "https://muslim.narzza.com",
  locale: "id_ID",
  ogImage: "/android-chrome-512x512.png",
};

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(canonical),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: siteConfig.ogImage,
          width: 512,
          height: 512,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
