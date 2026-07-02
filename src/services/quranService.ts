import chaptersData from '../data/chapters.json';
import juzsData from '../data/juzs.json';
import versesData from '../data/verses.json';
import pagesData from '../data/pages.json';
import type { Chapter, Juz, Page, Verse } from '../types/quran';

const chapters = chaptersData as Chapter[];
const juzs = juzsData as unknown as Juz[];
const verses = versesData as Verse[];
const pages = pagesData as Page[];

const verseMap = new Map<string, Verse>();
verses.forEach(v => verseMap.set(v.key, v));

const surahVerses = new Map<number, Verse[]>();
verses.forEach(v => {
  const list = surahVerses.get(v.surah) ?? [];
  list.push(v);
  surahVerses.set(v.surah, list);
});

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapter(id: number): Chapter | undefined {
  return chapters.find(c => c.id === id);
}

export function getJuzs(): Juz[] {
  return juzs;
}

export function getJuz(juzNumber: number): Juz | undefined {
  return juzs.find(j => j.juzNumber === juzNumber);
}

export function getJuzVerses(juzNumber: number): Verse[] {
  const juz = getJuz(juzNumber);
  if (!juz) return [];

  const result: Verse[] = [];
  for (const [surahKey, range] of Object.entries(juz.verseMapping)) {
    const surahNum = parseInt(surahKey, 10);
    const [start, end] = range.split('-').map(Number);
    for (let ayah = start; ayah <= end; ayah++) {
      const verse = verseMap.get(`${surahNum}:${ayah}`);
      if (verse) result.push(verse);
    }
  }
  return result;
}

export function getSurahVerses(surahId: number): Verse[] {
  return surahVerses.get(surahId) ?? [];
}

export function getVerse(surah: number, ayah: number): Verse | undefined {
  return verseMap.get(`${surah}:${ayah}`);
}

export function getPage(pageNumber: number): Page | undefined {
  if (pageNumber < 1 || pageNumber > 604) return undefined;
  return pages[pageNumber];
}

export function getTotalPages(): number {
  return 604;
}

export function getPageForVerse(surah: number, ayah: number): number {
  for (let i = 1; i <= 604; i++) {
    const page = pages[i];
    if (page.verses.some(v => v.surah === surah && v.ayah === ayah)) {
      return i;
    }
  }
  const chapter = getChapter(surah);
  return chapter?.pages[0] ?? 1;
}

export function searchChapters(query: string): Chapter[] {
  const q = query.trim().toLowerCase();
  if (!q) return chapters;
  return chapters.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.nameTranslation.toLowerCase().includes(q) ||
      c.nameArabic.includes(query.trim()) ||
      String(c.id) === q,
  );
}

export function getLastReadPage(): number {
  return 1;
}
