export type HadithTafsirVersion = {
  source: string;
  sourceKey: string;
  content: string;
};

export type HadithCollection = {
  slug: string;
  name: string;
  count: string;
  description: string;
};

export type HadithItem = {
  number: number;
  title: string;
  narrator: string;
  grade: string;
  arabicText?: string | null;
  translation?: string | null;
  summary?: string | null;
  tafsirVersions?: HadithTafsirVersion[];
};

export type KitabBook = {
  slug: string;
  title: string;
  category: string;
  level: string;
  lessons: number;
  coverImage: string;
  description: string;
};

export type KitabChapter = {
  slug: string;
  title: string;
  duration: string;
  arabicText?: string | null;
  translation?: string | null;
  explanation?: string | null;
};

export type Surah = {
  slug: string;
  name: string;
  arabic: string;
  verses: number;
  origin: string;
};

export type Ayah = {
  number: number;
  arabic: string;
  translation: string;
  tafsir?: string | null;
};

export type PrayerItem = {
  name: string;
  time: string;
  status?: "next" | "done";
};
