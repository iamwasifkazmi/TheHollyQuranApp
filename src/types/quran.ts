export interface Chapter {
  id: number;
  name: string;
  nameArabic: string;
  nameTranslation: string;
  versesCount: number;
  revelationPlace: string;
  pages: [number, number];
  juz: number | null;
}

export interface Juz {
  id: number;
  juzNumber: number;
  verseMapping: Record<string, string>;
}

export interface Verse {
  surah: number;
  ayah: number;
  key: string;
  text: string;
}

export interface PageChapter {
  number: number;
  nameEn: string;
  nameAr: string;
}

export interface Page {
  pageNumber: number;
  chapters: PageChapter[];
  juzNumber: number | null;
  verses: Verse[];
}

export type MushafLineType = 'surah-header' | 'basmala' | 'text';

export interface MushafLine {
  line: number;
  type: MushafLineType;
  text?: string;
}

export interface MushafPage {
  pageNumber: number;
  lines: MushafLine[];
}

export type BookmarkType = 'surah' | 'page' | 'verse' | 'juz';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  surah?: number;
  ayah?: number;
  page?: number;
  juz?: number;
  label: string;
  subtitle?: string;
  createdAt: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  SurahDetail: { surahId: number };
  JuzDetail: { juzNumber: number };
  Reader: { page?: number; surah?: number; ayah?: number };
  PageJump: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Surahs: undefined;
  Juz: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};
