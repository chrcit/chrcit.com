#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist/client");
const origin = "https://chrcit.com";
const errors = [];
// On-demand routes are not written to dist. Treat them as valid link targets.
const ssrRoutes = new Set(["/"]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const decodeHtml = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const textContent = (value) => decodeHtml(value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
const attributes = (tag) => {
  const values = new Map();
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    if (name === "meta" || name === "link") continue;
    values.set(name.toLowerCase(), decodeHtml(doubleQuoted ?? singleQuoted ?? unquoted ?? ""));
  }
  return values;
};
const tags = (html, name) => {
  const pattern = new RegExp(`<${escapeRegExp(name)}\\b[^>]*>`, "gi");
  return [...html.matchAll(pattern)].map((match) => match[0]);
};
const contentTags = (html, name) => {
  const pattern = new RegExp(`<${escapeRegExp(name)}\\b[^>]*>([\\s\\S]*?)</${escapeRegExp(name)}\\s*>`, "gi");
  return [...html.matchAll(pattern)].map((match) => textContent(match[1]));
};
const metaTags = (html, attribute, value) =>
  tags(html, "meta").filter((tag) => attributes(tag).get(attribute) === value);
const one = (matches, label, file) => {
  if (matches.length !== 1) {
    errors.push(`${file}: expected exactly one ${label}, found ${matches.length}`);
    return false;
  }
  return true;
};
const nonemptyMeta = (html, attribute, value, label, file, { allowMultiple = false } = {}) => {
  const matches = metaTags(html, attribute, value);
  if (allowMultiple ? matches.length < 1 : !one(matches, label, file)) {
    if (allowMultiple && matches.length < 1) errors.push(`${file}: expected at least one ${label}, found 0`);
    return false;
  }
  for (const match of matches) {
    if (!(attributes(match).get("content") ?? "").trim()) {
      errors.push(`${file}: ${label} is empty`);
      return false;
    }
  }
  return true;
};

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
};
const hasFile = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};
const routeForFile = (file) => {
  const path = relative(dist, file).replaceAll("\\", "/");
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html")) return `/${path.slice(0, -"index.html".length)}`;
  return `/${path}`;
};
const routeCandidates = (pathname) => {
  const normalized = pathname.replaceAll("\\", "/").replace(/\/+/g, "/");
  const route = normalized.replace(/^\//, "");
  if (!route) return [join(dist, "index.html")];
  const candidates = [join(dist, route), join(dist, route, "index.html")];
  if (!extname(route)) candidates.push(join(dist, `${route}.html`));
  return candidates;
};

const checkInternalLinks = async (file, html) => {
  const route = routeForFile(file);
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)].map(
    (match) => decodeHtml(match[1] ?? match[2] ?? match[3] ?? ""),
  );
  for (const href of hrefs) {
    if (!href || href.startsWith("#") || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, `${origin}${route}`);
    } catch {
      errors.push(`${relative(root, file)}: invalid href ${JSON.stringify(href)}`);
      continue;
    }
    if (url.origin !== origin) continue;
    if (ssrRoutes.has(url.pathname) || ssrRoutes.has(url.pathname.replace(/\/+$/, "") || "/")) continue;
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      errors.push(`${relative(root, file)}: invalid encoded href ${JSON.stringify(href)}`);
      continue;
    }
    const candidates = routeCandidates(pathname).filter(
      (candidate) => candidate === dist || candidate.startsWith(`${dist}/`),
    );
    if (!(await Promise.all(candidates.map(hasFile))).some(Boolean)) {
      errors.push(`${relative(root, file)}: internal href has no built target ${JSON.stringify(href)}`);
    }
  }
};

const htmlFiles = (await walk(dist)).filter((file) => extname(file).toLowerCase() === ".html");
if (htmlFiles.length === 0) {
  console.error("Site validation failed: no HTML files found in dist");
  process.exit(1);
}

const seenTitles = new Map();
const seenDescriptions = new Map();
for (const file of htmlFiles) {
  const display = relative(root, file);
  const html = await readFile(file, "utf8");
  const isRedirect = /<meta\b[^>]*http-equiv\s*=\s*["']?refresh\b/i.test(html);
  const isNotFound = display === "dist/client/404.html";

  // Astro emits redirect documents without the normal page shell. They are intentionally
  // excluded from document metadata/H1 checks, but their links still get resolved below.
  if (!isRedirect) {
    const titles = contentTags(html, "title");
    if (one(titles, "title", display)) {
      if (seenTitles.has(titles[0])) errors.push(`${display}: duplicate title also used by ${seenTitles.get(titles[0])}`);
      else seenTitles.set(titles[0], display);
    }
    const descriptions = metaTags(html, "name", "description");
    if (nonemptyMeta(html, "name", "description", "description meta", display)) {
      const description = attributes(descriptions[0]).get("content").trim();
      if (seenDescriptions.has(description)) errors.push(`${display}: duplicate description also used by ${seenDescriptions.get(description)}`);
      else seenDescriptions.set(description, display);
    }

    const checks = [
      ...(isNotFound ? [] : [["rel", "canonical", "canonical link"]]),
      ["property", "og:title", "og:title meta"],
      ["property", "og:description", "og:description meta"],
      ["property", "og:type", "og:type meta"],
      ...(isNotFound ? [] : [["property", "og:url", "og:url meta"]]),
    ];
    for (const [attribute, value, label] of checks) {
      const matches = attribute === "rel" ? tags(html, "link").filter((tag) => attributes(tag).get(attribute) === value) : metaTags(html, attribute, value);
      if (!one(matches, label, display)) continue;
      const key = attribute === "rel" ? "href" : "content";
      if (!(attributes(matches[0]).get(key) ?? "").trim()) errors.push(`${display}: ${label} is empty`);
    }
    nonemptyMeta(html, "property", "og:image", "og:image meta", display);
    nonemptyMeta(html, "name", "twitter:card", "twitter:card meta", display);
    nonemptyMeta(html, "name", "twitter:image", "twitter:image meta", display);
    const twitterCard = attributes(metaTags(html, "name", "twitter:card")[0] ?? "").get("content") ?? "";
    if (twitterCard && twitterCard !== "summary_large_image") {
      errors.push(`${display}: twitter:card should be summary_large_image, found ${JSON.stringify(twitterCard)}`);
    }
    const ogImages = metaTags(html, "property", "og:image").map((tag) => attributes(tag).get("content") ?? "");
    const twitterImage = attributes(metaTags(html, "name", "twitter:image")[0] ?? "").get("content") ?? "";
    if (twitterImage && !/^https:\/\//i.test(twitterImage)) {
      errors.push(`${display}: twitter:image must be an absolute https URL`);
    }
    if (twitterImage.includes("og-image-square")) {
      errors.push(`${display}: twitter:image points at the square asset; summary_large_image needs the landscape image`);
    }
    if (ogImages.length === 1 && twitterImage && ogImages[0] !== twitterImage) {
      errors.push(`${display}: twitter:image should match og:image so X and Open Graph stay in sync`);
    }
    const h1s = tags(html, "h1");
    if (h1s.length !== 1) errors.push(`${display}: expected exactly one h1, found ${h1s.length}`);

    const plausible = tags(html, "script").some((tag) => {
      const attrs = attributes(tag);
      return attrs.get("src") === "/js/script.js" && attrs.get("data-domain") === "chrcit.com";
    });
    if (!plausible) errors.push(`${display}: missing Plausible script`);
  }
  await checkInternalLinks(file, html);
}

const notFound = join(dist, "404.html");
if (await hasFile(notFound)) {
  const robots = metaTags(await readFile(notFound, "utf8"), "name", "robots");
  if (robots.length !== 1 || !/\bnoindex\b/i.test(attributes(robots[0]).get("content") ?? "")) {
    errors.push("dist/client/404.html: expected a robots meta tag containing noindex");
  }
} else errors.push("dist/client/404.html: missing built 404 page");

const robotsPath = join(dist, "robots.txt");
if (!(await hasFile(robotsPath))) errors.push("dist/client/robots.txt: missing");
else if (!(await readFile(robotsPath, "utf8")).trim()) errors.push("dist/client/robots.txt: empty");

let sitemap;
for (const name of ["sitemap.xml", "sitemap-index.xml"]) {
  const candidate = join(dist, name);
  if (await hasFile(candidate)) {
    sitemap = candidate;
    break;
  }
}
if (!sitemap) errors.push("dist/client: missing sitemap.xml or sitemap-index.xml");
else if (!(await readFile(sitemap, "utf8")).trim()) errors.push(`${relative(root, sitemap)}: empty`);

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Site validation passed: ${htmlFiles.length} HTML pages checked, internal links resolved, 404/robots/sitemap present.`);
