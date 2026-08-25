// One-off migration: legacy uses.md -> site/src/content/items/tools
// Icons are fetched once and stored as local assets (no hotlinking).
// Run from repo root: node scripts/migrate-tools-to-items.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = "site/src/content/items/tools";
fs.mkdirSync(path.join(OUT, "icons"), { recursive: true });

// [slug, title, group, url, meta]
const tools = [
  // Gear
  ["macbook-pro", 'MacBook Pro 14"', "Gear", null, "M2 Pro, 32GB RAM"],
  ["caldigit-ts4", "CalDigit TS4", "Gear", null, "Thunderbolt 4 dock"],
  ["dell-displays", "2× Dell 2.5K displays", "Gear", null, "Due an upgrade since 2024"],
  ["shure-mv7", "Shure MV7", "Gear", null, "Microphone"],
  ["sony-a7iv", "Sony Alpha 7 IV", "Gear", null, "28–70mm and 35mm SEL-35F18F"],
  ["airpods-pro", "AirPods Pro", "Gear", null, "2nd generation"],
  ["ergotopia-nextback", "Ergotopia NextBack", "Gear", null, "Office chair"],
  ["huanuo-monitor-mount", "HUANUO monitor mount", "Gear", null, null],
  ["ikea-standing-desk", "Ikea standing desk", "Gear", null, null],
  // Stack
  ["typescript", "TypeScript", "Stack", "https://www.typescriptlang.org", "The default"],
  ["remix", "Remix", "Stack", "https://remix.run", null],
  ["tailwindcss", "TailwindCSS", "Stack", "https://tailwindcss.com", null],
  ["radix-ui", "Radix UI", "Stack", "https://www.radix-ui.com", null],
  ["framer-motion", "Framer Motion", "Stack", "https://www.framer.com/motion/", null],
  ["drizzle", "Drizzle ORM", "Stack", "https://orm.drizzle.team", null],
  ["vercel", "Vercel", "Stack", "https://vercel.com", null],
  ["cloudflare", "Cloudflare", "Stack", "https://www.cloudflare.com", null],
  ["planetscale", "PlanetScale", "Stack", "https://planetscale.com", null],
  // Dev Tools
  ["vscode", "VSCode", "Dev Tools", "https://code.visualstudio.com", "Plus the usual tailwind of extensions"],
  ["github-copilot", "GitHub Copilot", "Dev Tools", "https://github.com/features/copilot", null],
  ["github", "GitHub", "Dev Tools", "https://github.com", null],
  ["figma", "Figma", "Dev Tools", "https://www.figma.com", null],
  ["tableplus", "TablePlus", "Dev Tools", "https://tableplus.com", null],
  ["wappalyzer", "Wappalyzer", "Dev Tools", "https://www.wappalyzer.com", null],
  ["insomnia", "Insomnia", "Dev Tools", "https://insomnia.rest", null],
  ["terminal", "Terminal", "Dev Tools", null, "The default one"],
  ["local", "Local", "Dev Tools", "https://localwp.com", null],
  // Productivity
  ["setapp", "Setapp", "Productivity", "https://setapp.com", null],
  ["arc", "Arc", "Productivity", "https://arc.net", null],
  ["raycast", "Raycast", "Productivity", "https://raycast.com", "Launcher — replaced five apps on day one"],
  ["mailbrew", "Mailbrew", "Productivity", "https://mailbrew.com", null],
  ["readwise", "Readwise + Reader", "Productivity", "https://readwise.io", null],
  ["timing", "Timing", "Productivity", "https://timingapp.com", null],
  ["obsidian", "Obsidian", "Productivity", "https://obsidian.md", "Notes as plain files — will outlive the app"],
  ["notes-app", "Notes.app", "Productivity", null, "The one that ships with the OS"],
  ["textsniper", "TextSniper", "Productivity", "https://textsniper.app", null],
  ["bartender", "Bartender", "Productivity", "https://www.macbartender.com", null],
  ["istat-menus", "iStat Menus", "Productivity", "https://bjango.com/mac/istatmenus/", null],
  ["bettertouchtool", "BetterTouchTool", "Productivity", "https://folivora.ai", null],
  ["notion", "Notion", "Productivity", "https://www.notion.so", null],
  ["cleanshot-x", "CleanShot X", "Productivity", "https://cleanshot.com", null],
  ["1password", "1Password", "Productivity", "https://1password.com", null],
  ["backblaze", "Backblaze", "Productivity", "https://www.backblaze.com", null],
  ["rectangle", "Rectangle", "Productivity", "https://rectangleapp.com", null],
  ["things", "Things", "Productivity", "https://culturedcode.com/things/", "Tasks — the only list that survived the decade"],
];

async function fetchIcon(url, slug) {
  try {
    const host = new URL(url).hostname;
    const res = await fetch(`https://www.google.com/s2/favicons?domain=${host}&sz=128`);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    // PNG magic bytes; Google's placeholder globe is tiny, accept anything valid
    if (buf.length < 100 || buf.readUInt32BE(0) !== 0x89504e47) return null;
    fs.writeFileSync(path.join(OUT, "icons", `${slug}.png`), buf);
    return `./icons/${slug}.png`;
  } catch {
    return null;
  }
}

let icons = 0;
for (const [slug, title, group, url, meta] of tools) {
  const icon = url ? await fetchIcon(url, slug) : null;
  if (icon) icons++;

  const lines = [
    `title: ${JSON.stringify(title)}`,
    `category: "tool"`,
    `group: ${JSON.stringify(group)}`,
  ];
  if (url) lines.push(`url: ${JSON.stringify(url)}`);
  if (meta) lines.push(`meta: ${JSON.stringify(meta)}`);
  if (icon) lines.push(`icon: ${JSON.stringify(icon)}`);

  fs.writeFileSync(path.join(OUT, `${slug}.md`), `---\n${lines.join("\n")}\n---\n`);
}

console.log(`migrated ${tools.length} tools, ${icons} icons fetched`);
