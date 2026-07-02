/**
 * Prepares offline Quran data bundles from authentic sources:
 * - Chapters & Juz: api.quran.com (Quran Foundation)
 * - Uthmani text: api.islamic.app (Tanzil Uthmani)
 * - Page layout: hamzakat/madani-muhsaf-json (Madani Mushaf)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '../src/data');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('Fetching chapter metadata from Quran.com...');
  const chaptersRes = await fetch(
    'https://api.quran.com/api/v4/chapters?language=en',
  );
  const chapters = chaptersRes.chapters.map(c => ({
    id: c.id,
    name: c.name_simple,
    nameArabic: c.name_arabic,
    nameTranslation: c.translated_name.name,
    versesCount: c.verses_count,
    revelationPlace: c.revelation_place,
    pages: c.pages,
    juz: null,
  }));

  console.log('Fetching juz metadata...');
  const juzsRes = await fetch('https://api.quran.com/api/v4/juzs');
  const juzs = juzsRes.juzs.map(j => ({
    id: j.id,
    juzNumber: j.juz_number,
    verseMapping: j.verse_mapping,
  }));

  // Assign juz to chapters based on starting page
  for (const chapter of chapters) {
    const startPage = chapter.pages[0];
    for (const juz of juzs) {
      const mapping = Object.keys(juz.verseMapping)[0];
      const [surahNum] = mapping.split(':').map(Number);
      const juzChapter = chapters.find(c => c.id === surahNum);
      if (juzChapter && startPage >= juzChapter.pages[0]) {
        chapter.juz = juz.juzNumber;
      }
    }
  }

  console.log('Fetching Uthmani text from islamic.app (Tanzil)...');
  const uthmaniRes = await fetch(
    'https://api.islamic.app/v1/quran/verses/uthmani',
  );
  const verses = uthmaniRes.data.ayahs.map(a => {
    const [surah, ayah] = a.verse_key.split(':').map(Number);
    return { surah, ayah, key: a.verse_key, text: a.text };
  });

  console.log('Fetching Madani Mushaf page layout...');
  const mushafRes = await fetch(
    'https://raw.githubusercontent.com/hamzakat/madani-muhsaf-json/main/madani-muhsaf.json',
  );

  const pages = [];
  for (let i = 0; i <= 604; i++) {
    pages.push({ pageNumber: i, chapters: [], juzNumber: null, verses: [] });
  }

  for (let pageIdx = 1; pageIdx < mushafRes.length; pageIdx++) {
    const pageData = mushafRes[pageIdx];
    if (!pageData || Object.keys(pageData).length === 0) continue;

    const juzNumber = pageData.juzNumber || null;
    const pageVerses = [];

    for (const key of Object.keys(pageData)) {
      if (key === 'juzNumber') continue;
      const chapter = pageData[key];
      const surahNum = parseInt(chapter.chapterNumber, 10);
      pages[pageIdx].chapters.push({
        number: surahNum,
        nameEn: chapter.titleEn,
        nameAr: chapter.titleAr,
      });
      for (const v of chapter.text) {
        const ayahNum = parseInt(v.verseNumber, 10);
        pageVerses.push({
          surah: surahNum,
          ayah: ayahNum,
          key: `${surahNum}:${ayahNum}`,
          text: v.text.trim(),
        });
      }
    }

    pages[pageIdx].juzNumber = juzNumber;
    pages[pageIdx].verses = pageVerses;
  }

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(
    path.join(OUT, 'chapters.json'),
    JSON.stringify(chapters),
  );
  fs.writeFileSync(path.join(OUT, 'juzs.json'), JSON.stringify(juzs));
  fs.writeFileSync(path.join(OUT, 'verses.json'), JSON.stringify(verses));
  fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages));

  const sizes = ['chapters', 'juzs', 'verses', 'pages'].map(f => {
    const size = fs.statSync(path.join(OUT, `${f}.json`)).size;
    return `${f}: ${(size / 1024).toFixed(1)} KB`;
  });

  console.log('\nData prepared successfully:');
  sizes.forEach(s => console.log('  ', s));
  console.log(`  Total verses: ${verses.length}`);
  console.log(`  Total pages: ${pages.filter(p => p.verses.length > 0).length}`);
}

main().catch(err => {
  console.error('Failed to prepare data:', err);
  process.exit(1);
});
