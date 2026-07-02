import chaptersData from '../data/chapters.json';
import juzsData from '../data/juzs.json';
import versesData from '../data/verses.json';
import pagesData from '../data/pages.json';
import mushafLinesData from '../data/mushaf-lines.json';
import type { Chapter, Juz, MushafPage, Page, Verse } from '../types/quran';

const chapters = chaptersData as Chapter[];
const juzsRaw = juzsData as unknown as Juz[];
const juzs = dedupeJuzs(juzsRaw);
const verses = versesData as Verse[];
const pages = pagesData as Page[];
const mushafPages = mushafLinesData as MushafPage[];

const verseMap = new Map<string, Verse>();
verses.forEach(v => verseMap.set(v.key, v));

const surahVerses = new Map<number, Verse[]>();
verses.forEach(v => {
  const list = surahVerses.get(v.surah) ?? [];
  list.push(v);
  surahVerses.set(v.surah, list);
});

const verseToPageMap = new Map<string, number>();
for (let i = 1; i <= 604; i++) {
  const page = pages[i];
  if (!page?.verses) continue;
  for (const v of page.verses) {
    if (!verseToPageMap.has(v.key)) {
      verseToPageMap.set(v.key, i);
    }
  }
}

function dedupeJuzs(list: Juz[]): Juz[] {
  const byNumber = new Map<number, Juz>();
  for (const juz of list) {
    const existing = byNumber.get(juz.juzNumber);
    if (!existing || juz.id < existing.id) {
      byNumber.set(juz.juzNumber, juz);
    }
  }
  return Array.from(byNumber.values()).sort((a, b) => a.juzNumber - b.juzNumber);
}

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

export function getMushafPage(pageNumber: number): MushafPage | undefined {
  if (pageNumber < 1 || pageNumber > 604) return undefined;
  return mushafPages[pageNumber];
}

export function getTotalPages(): number {
  return 604;
}

export function getPageForVerse(surah: number, ayah: number): number {
  const mapped = verseToPageMap.get(`${surah}:${ayah}`);
  if (mapped) return mapped;
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

export function getSurahPageRange(surahId: number): [number, number] {
  const chapter = getChapter(surahId);
  return chapter?.pages ?? [1, 1];
}

export function getJuzPageRange(juzNumber: number): [number, number] {
  const verses = getJuzVerses(juzNumber);
  if (verses.length === 0) {
    return [1, 1];
  }
  const start = getPageForVerse(verses[0].surah, verses[0].ayah);
  const last = verses[verses.length - 1];
  const end = getPageForVerse(last.surah, last.ayah);
  return [Math.min(start, end), Math.max(start, end)];
}

export function getLastReadPage(): number {
  return 1;
}
