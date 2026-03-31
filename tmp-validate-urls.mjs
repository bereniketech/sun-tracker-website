import { readFileSync } from 'fs';

const content = readFileSync('src/lib/landmarks-data.ts', 'utf-8');

const entries = [];
const lineRegex = /id:\s*"([^"]+)".*?imageUrl:\s*"([^"]+)"/g;

let match;
while ((match = lineRegex.exec(content)) !== null) {
  entries.push({ id: match[1], imageUrl: match[2] });
}

console.log(`Total URLs to test: ${entries.length}\n`);

const CONCURRENCY = 5;
const DELAY_BETWEEN_BATCHES_MS = 2000;
const broken = [];
let completed = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUrl(entry) {
  const controller = new AbortController();
  try {
    // Use GET but abort after headers arrive to avoid downloading the full image
    const res = await fetch(entry.imageUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    // We got the status, abort the body download
    controller.abort();
    completed++;
    if (res.status !== 200) {
      broken.push({ ...entry, status: res.status });
      console.log(`[${completed}/${entries.length}] BROKEN ${entry.id} -> ${res.status}`);
    } else {
      if (completed % 25 === 0) console.log(`[${completed}/${entries.length}] checked... all OK so far`);
    }
  } catch (err) {
    completed++;
    // AbortError is expected (we abort after getting status)
    if (err.name === 'AbortError') {
      // This means we got the response and aborted - already handled above
      return;
    }
    broken.push({ ...entry, status: `ERROR: ${err.message}` });
    console.log(`[${completed}/${entries.length}] ERROR ${entry.id} -> ${err.message}`);
  }
}

for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(checkUrl));
  if (i + CONCURRENCY < entries.length) {
    await sleep(DELAY_BETWEEN_BATCHES_MS);
  }
}

console.log(`\n========== RESULTS ==========`);
console.log(`Total URLs tested: ${entries.length}`);
console.log(`Broken URLs: ${broken.length}`);
console.log(`Working URLs: ${entries.length - broken.length}`);

if (broken.length > 0) {
  console.log(`\n--- Broken URL Details ---`);
  for (const b of broken) {
    console.log(`  ID: ${b.id}`);
    console.log(`  URL: ${b.imageUrl}`);
    console.log(`  Status: ${b.status}`);
    console.log('');
  }
}
