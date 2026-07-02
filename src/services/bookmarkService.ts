import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Bookmark, BookmarkType } from '../types/quran';

const STORAGE_KEY = '@quran_bookmarks';
const LAST_READ_KEY = '@quran_last_read';

let cache: Bookmark[] | null = null;

async function loadBookmarks(): Promise<Bookmark[]> {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? JSON.parse(raw) : [];
    return cache!;
  } catch {
    cache = [];
    return [];
  }
}

async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
  cache = bookmarks;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await loadBookmarks();
  return bookmarks.sort((a, b) => b.createdAt - a.createdAt);
}

export async function isBookmarked(
  type: BookmarkType,
  params: { surah?: number; page?: number; juz?: number; ayah?: number },
): Promise<boolean> {
  const bookmarks = await loadBookmarks();
  return bookmarks.some(b => {
    if (b.type !== type) return false;
    if (type === 'surah') return b.surah === params.surah;
    if (type === 'page') return b.page === params.page;
    if (type === 'juz') return b.juz === params.juz;
    if (type === 'verse')
      return b.surah === params.surah && b.ayah === params.ayah;
    return false;
  });
}

export async function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
  const bookmarks = await loadBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `${bookmark.type}_${Date.now()}`,
    createdAt: Date.now(),
  };
  bookmarks.unshift(newBookmark);
  await saveBookmarks(bookmarks);
  return newBookmark;
}

export async function removeBookmark(id: string): Promise<void> {
  const bookmarks = await loadBookmarks();
  await saveBookmarks(bookmarks.filter(b => b.id !== id));
}

export async function toggleBookmark(
  bookmark: Omit<Bookmark, 'id' | 'createdAt'>,
): Promise<boolean> {
  const bookmarks = await loadBookmarks();
  const existing = bookmarks.findIndex(b => {
    if (b.type !== bookmark.type) return false;
    if (bookmark.type === 'surah') return b.surah === bookmark.surah;
    if (bookmark.type === 'page') return b.page === bookmark.page;
    if (bookmark.type === 'juz') return b.juz === bookmark.juz;
    if (bookmark.type === 'verse')
      return b.surah === bookmark.surah && b.ayah === bookmark.ayah;
    return false;
  });

  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    await saveBookmarks(bookmarks);
    return false;
  }

  await addBookmark(bookmark);
  return true;
}

export async function saveLastRead(page: number): Promise<void> {
  await AsyncStorage.setItem(LAST_READ_KEY, String(page));
}

export async function getLastRead(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(LAST_READ_KEY);
    return val ? parseInt(val, 10) : 1;
  } catch {
    return 1;
  }
}
