// One-off migration: astro-legacy books -> site/src/content/items/books
// Run from repo root: node scripts/migrate-books-to-items.mjs
import fs from "node:fs";
import path from "node:path";

// legacy book frontmatter is flat: strings, numbers, [inline arrays]
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return data;
}

const SRC = "astro-legacy/src/content/books";
const OUT = "site/src/content/items/books";

fs.mkdirSync(path.join(OUT, "covers"), { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md"));
let count = 0;

for (const file of files) {
  const data = parseFrontmatter(fs.readFileSync(path.join(SRC, file), "utf8"));

  const coverFile = path.basename(data.cover);
  fs.copyFileSync(path.join(SRC, "covers", coverFile), path.join(OUT, "covers", coverFile));

  const frontmatter = {
    title: data.title,
    category: "book",
    author: data.author,
    year: data.year,
    rating: data.rating,
    url: data.url,
    genre: data.category,
    description: data.description,
    cover: `./covers/${coverFile}`,
    tags: data.tags ?? [],
  };

  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.map((t) => JSON.stringify(t)).join(", ")}]`;
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join("\n");

  fs.writeFileSync(path.join(OUT, file), `---\n${yaml}\n---\n`);
  count++;
}

console.log(`migrated ${count} books`);
