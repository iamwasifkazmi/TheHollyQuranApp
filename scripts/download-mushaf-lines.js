/**
 * Downloads line-by-line mushaf page layout (604 pages) for traditional page rendering.
 * Source: https://github.com/zonetecde/mushaf-layout (Hafs, Madani layout)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '../src/data/mushaf-lines.json');
const BASE =
  'https://raw.githubusercontent.com/zonetecde/mushaf-layout/refs/heads/main/mushaf/page-';

function fetchPage(pageNum) {
  const padded = String(pageNum).padStart(3, '0');
  return new Promise((resolve, reject) => {
    https
      .get(`${BASE}${padded}.json`, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Page ${pageNum}: ${e.message}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function runBatch(start, end, concurrency) {
  const pages = new Array(605).fill(null);
  let current = start;

  async function worker() {
    while (current <= end) {
      const n = current++;
      try {
        const data = await fetchPage(n);
        pages[n] = { pageNumber: n, lines: data.lines ?? [] };
        if (n % 50 === 0) console.log(`  downloaded page ${n}/${end}`);
      } catch (err) {
        console.error(`Failed page ${n}:`, err.message);
        pages[n] = { pageNumber: n, lines: [] };
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return pages;
}

async function main() {
  console.log('Downloading mushaf line layout (604 pages)...');
  const pages = await runBatch(1, 604, 25);
  fs.writeFileSync(OUT, JSON.stringify(pages));
  const size = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
  console.log(`Saved ${OUT} (${size} MB)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
