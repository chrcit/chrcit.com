#!/usr/bin/env node
/**
 * Capture sunny-day Open Graph stills from the real WeatherDither shader.
 *
 *   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx --yes -p playwright node scripts/make-og.mjs
 *   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx --yes -p playwright node scripts/make-og.mjs --sheet
 *
 * Frozen scene: Clear (code 0), daytime, 26°C. Time/drift are composed per crop
 * so the sun sits in frame — do not letterbox one size into the other.
 */
import { createServer } from "node:http";
import { homedir } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createReadStream, existsSync, statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const chrome =
  process.env.PLAYWRIGHT_CHROMIUM ||
  join(homedir(), ".cache/ms-playwright/chromium-1234/chrome-linux64/chrome");

// Clear day, sun disc out, a little ochre. Birds skipped (drift keeps them off-stage).
const SCENE = {
  code: 0,
  temp: 26,
  night: 0,
  mark: 1,
  // Landscape ~1.91:1 — sun at ~72% x sits in the right third.
  landscape: { time: 11.2, drift: 22 },
  // Square 1:1 — same weather, different freeze so the disc is not cropped.
  square: { time: 8.4, drift: 18 },
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".woff2": "font/woff2",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".txt": "text/plain",
};

function extractShader(src, name) {
  const m = src.match(new RegExp(`const ${name} = \`([\\s\\S]*?)\`;`));
  if (!m) throw new Error(`WeatherDither.astro: missing ${name}`);
  return m[1];
}

async function loadHtml() {
  const astro = await readFile(join(root, "src/components/WeatherDither.astro"), "utf8");
  const template = await readFile(join(root, "scripts/og-capture.html"), "utf8");
  const shaders = JSON.stringify({
    vert: extractShader(astro, "VERT"),
    frag: extractShader(astro, "FRAG"),
  });
  if (!template.includes("__SHADER_JSON__")) {
    throw new Error("og-capture.html is missing __SHADER_JSON__");
  }
  return template.replace("__SHADER_JSON__", shaders);
}

function startServer(html) {
  const fonts = join(pub, "fonts");
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname === "/" || url.pathname === "/og-capture.html") {
      res.writeHead(200, { "content-type": MIME[".html"], "cache-control": "no-store" });
      res.end(html);
      return;
    }
    if (url.pathname.startsWith("/fonts/")) {
      const file = join(fonts, url.pathname.slice("/fonts/".length));
      if (!file.startsWith(fonts) || !existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
      createReadStream(file).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end("not found");
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

async function playwrightSpecs() {
  const specs = ["playwright", "playwright-core"];
  const extras = [
    join(homedir(), ".npm/_npx"),
    "/tmp/node_modules",
    join(root, "node_modules"),
  ];
  for (const dir of extras) {
    if (!existsSync(dir)) continue;
    const names = dir.endsWith("node_modules") ? [""] : await readdir(dir);
    for (const name of names) {
      const base = name ? join(dir, name, "node_modules") : dir;
      specs.push(join(base, "playwright/index.js"), join(base, "playwright-core/index.js"));
    }
  }
  return specs;
}

async function loadPlaywright() {
  for (const spec of await playwrightSpecs()) {
    try {
      if (spec.startsWith("/") || spec.startsWith(".")) {
        if (!existsSync(spec)) continue;
        return await import(pathToFileURL(spec).href);
      }
      return await import(spec);
    } catch {
      /* keep looking */
    }
  }
  throw new Error(
    "playwright is not installed. Re-run with:\n  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx --yes -p playwright node scripts/make-og.mjs",
  );
}

function query(extra) {
  const p = new URLSearchParams({
    code: String(SCENE.code),
    temp: String(SCENE.temp),
    night: String(SCENE.night),
    mark: String(SCENE.mark),
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
  });
  return p.toString();
}

async function capture(page, origin, { width, height, time, drift, mark }) {
  await page.setViewportSize({ width, height });
  const qs = query({ time, drift, mark: mark ?? SCENE.mark });
  await page.goto(`${origin}/og-capture.html?${qs}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.dataset.og === "ready" || document.documentElement.dataset.og === "fail",
    { timeout: 15000 },
  );
  const state = await page.evaluate(() => ({
    og: document.documentElement.dataset.og,
    error: document.documentElement.dataset.ogError || "",
    cell: document.documentElement.dataset.ogCell || "",
    sky: document.documentElement.dataset.ogSky || "",
  }));
  if (state.og !== "ready") {
    throw new Error(`WebGL capture failed: ${state.error || "unknown"}`);
  }
  const buf = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width, height },
    animations: "disabled",
    caret: "hide",
  });
  return { buf, ...state };
}

async function writePng(file, buf, width, height) {
  const sharp = (await import("sharp")).default;
  const out = await sharp(buf)
    .flatten({ background: "#f3f0e7" })
    .resize(width, height, { kernel: "nearest", fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toBuffer();
  await writeFile(file, out);
  const meta = await sharp(out).metadata();
  return { file, width: meta.width, height: meta.height, bytes: out.length };
}

async function main() {
  if (!existsSync(chrome)) {
    throw new Error(`Chromium not found at ${chrome}`);
  }

  const sheet = process.argv.includes("--sheet");
  const html = await loadHtml();
  const { server, origin } = await startServer(html);
  const pw = await loadPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  if (!chromium) throw new Error("playwright has no chromium export");

  const browser = await chromium.launch({
    executablePath: chrome,
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--disable-gpu-sandbox",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
    ],
  });

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    await page.emulateMedia({ reducedMotion: "reduce" });

    if (sheet) {
      const dir = join(root, "scripts", ".og-preview");
      await mkdir(dir, { recursive: true });
      const times = [0, 4.71, 8.4, 11.2, 22];
      const drifts = [2, 10, 18, 22, 35];
      const crops = [
        { name: "wide", width: 1200, height: 630 },
        { name: "square", width: 1200, height: 1200 },
      ];
      for (const crop of crops) {
        for (const time of times) {
          for (const drift of drifts) {
            const { buf, sky, cell } = await capture(page, origin, {
              ...crop,
              time,
              drift,
              mark: 1,
            });
            const file = join(dir, `${crop.name}-t${time}-d${drift}.png`);
            await writePng(file, buf, crop.width, crop.height);
            console.log(file, sky, `cell=${cell}`);
          }
        }
      }
      return;
    }

    const wide = await capture(page, origin, {
      width: 1200,
      height: 630,
      ...SCENE.landscape,
    });
    const square = await capture(page, origin, {
      width: 1200,
      height: 1200,
      ...SCENE.square,
    });

    const a = await writePng(join(pub, "og-image.png"), wide.buf, 1200, 630);
    const b = await writePng(join(pub, "og-image-square.png"), square.buf, 1200, 1200);
    console.log(
      JSON.stringify(
        {
          weather: `Clear (code ${SCENE.code}), daytime, ${SCENE.temp}°C`,
          landscape: { ...a, ...SCENE.landscape, sky: wide.sky, cell: wide.cell },
          square: { ...b, ...SCENE.square, sky: square.sky, cell: square.cell },
          wordmark: SCENE.mark === 1,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
