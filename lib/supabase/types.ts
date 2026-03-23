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
        Insert: {
          slug: string;
          name: string;
          count_label: string;
          description: string;
        };
        Update: {
          slug?: string;
          name?: string;
          count_label?: string;
          description?: string;
        };
        Relationships: [];
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
          tafsir_versions: Json;
        };
        Insert: {
          id?: string;
          collection_slug: string;
          number: number;
          title: string;
          narrator: string;
          grade: string;
          arabic_text?: string | null;
          translation?: string | null;
          summary?: string | null;
          tafsir_versions?: Json;
        };
        Update: {
          id?: string;
          collection_slug?: string;
          number?: number;
          title?: string;
          narrator?: string;
          grade?: string;
          arabic_text?: string | null;
          translation?: string | null;
          summary?: string | null;
          tafsir_versions?: Json;
        };
        Relationships: [];
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
        Insert: {
          slug: string;
          title: string;
          category: string;
          level: string;
          lessons_count: number;
          cover_image: string;
          description: string;
        };
        Update: {
          slug?: string;
          title?: string;
          category?: string;
          level?: string;
          lessons_count?: number;
          cover_image?: string;
          description?: string;
        };
        Relationships: [];
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
        Insert: {
          id?: string;
          book_slug: string;
          slug: string;
          title: string;
          duration_label: string;
          position: number;
          arabic_text?: string | null;
          translation?: string | null;
          explanation?: string | null;
        };
        Update: {
          id?: string;
          book_slug?: string;
          slug?: string;
          title?: string;
          duration_label?: string;
          position?: number;
          arabic_text?: string | null;
          translation?: string | null;
          explanation?: string | null;
        };
        Relationships: [];
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
        Insert: {
          slug: string;
          name: string;
          arabic: string;
          verses_count: number;
          origin: string;
          position: number;
        };
        Update: {
          slug?: string;
          name?: string;
          arabic?: string;
          verses_count?: number;
          origin?: string;
          position?: number;
        };
        Relationships: [];
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
        Insert: {
          id?: string;
          surah_slug: string;
          verse_number: number;
          arabic_text: string;
          translation: string;
          tafsir?: string | null;
        };
        Update: {
          id?: string;
          surah_slug?: string;
          verse_number?: number;
          arabic_text?: string;
          translation?: string;
          tafsir?: string | null;
        };
        Relationships: [];
      };
      prayer_schedule: {
        Row: {
          id: string;
          name: string;
          time_label: string;
          status: "next" | "done" | null;
          position: number;
        };
        Insert: {
          id?: string;
          name: string;
          time_label: string;
          status?: "next" | "done" | null;
          position: number;
        };
        Update: {
          id?: string;
          name?: string;
          time_label?: string;
          status?: "next" | "done" | null;
          position?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
