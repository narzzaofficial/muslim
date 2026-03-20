export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      hadith_collections: {
        Row: {
          slug: string;
          name: string;
          count_label: string;
          description: string;
        };
      };
      hadith_entries: {
        Row: {
          id: string;
          collection_slug: string;
          number: number;
          title: string;
          narrator: string;
          grade: string;
          arabic_text: string | null;
          translation: string | null;
          summary: string | null;
        };
      };
      kitab_books: {
        Row: {
          slug: string;
          title: string;
          category: string;
          level: string;
          lessons_count: number;
          cover_image: string;
          description: string;
        };
      };
      kitab_chapters: {
        Row: {
          id: string;
          book_slug: string;
          slug: string;
          title: string;
          duration_label: string;
          position: number;
          arabic_text: string | null;
          translation: string | null;
          explanation: string | null;
        };
      };
      surahs: {
        Row: {
          slug: string;
          name: string;
          arabic: string;
          verses_count: number;
          origin: string;
          position: number;
        };
      };
      surah_ayahs: {
        Row: {
          id: string;
          surah_slug: string;
          verse_number: number;
          arabic_text: string;
          translation: string;
          tafsir: string | null;
        };
      };
      prayer_schedule: {
        Row: {
          id: string;
          name: string;
          time_label: string;
          status: "next" | "done" | null;
          position: number;
        };
      };
    };
  };
};
