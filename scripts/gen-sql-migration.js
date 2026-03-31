/**
 * Generates SQL migration for landmarks image_url column.
 * Run: node scripts/gen-sql-migration.js
 */
const fs = require("fs");
const path = require("path");

const srcPath = path.join(__dirname, "../src/lib/landmarks-data.ts");
const outPath = path.join(__dirname, "../supabase/migrations/20260401000000_update_image_url_landmarks.sql");

const content = fs.readFileSync(srcPath, "utf8");

// Match all entries that have imageUrl
const pattern = /\{ id: "([^"]+)",[^\n]+imageUrl: "([^"]+)"[^\n]*\}/g;
let match;
const rows = [];
while ((match = pattern.exec(content)) !== null) {
  rows.push({ id: match[1], url: match[2] });
}

console.log(`Found ${rows.length} entries with imageUrl`);

const lines = [
  "-- Auto-generated: populate image_url in landmarks table",
  "-- Generated from src/lib/landmarks-data.ts",
  "",
];

for (const { id, url } of rows) {
  // Escape single quotes in URL (shouldn't appear, but safe)
  const safeUrl = url.replace(/'/g, "''");
  lines.push(`UPDATE landmarks SET image_url = '${safeUrl}' WHERE id = '${id}';`);
}

fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`SQL migration written to: ${outPath}`);
console.log(`Total UPDATE statements: ${rows.length}`);
