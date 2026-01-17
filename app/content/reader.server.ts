import type { ContentEnv } from "~/content/env.server";
import { fetchGithubFile, fetchGithubTree, getGithubAssetRoot } from "~/content/github.server";

const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);

function extname(file: string) {
  const lastDot = file.lastIndexOf(".");
  return lastDot >= 0 ? file.slice(lastDot) : "";
}

function dirname(file: string) {
  const lastSlash = file.lastIndexOf("/");
  return lastSlash >= 0 ? file.slice(0, lastSlash) : ".";
}

async function walk(
  dir: string,
  prefix = "",
  readdir: typeof import("node:fs/promises").readdir,
  pathModule: typeof import("node:path"),
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = pathModule.join(dir, entry.name);
    const relative = `${prefix}/${entry.name}`.replace(/\/+/g, "/");

    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath, relative, readdir, pathModule)));
      continue;
    }

    if (MARKDOWN_EXTENSIONS.has(extname(entry.name))) {
      results.push(relative);
    }
  }

  return results;
}

export async function listCollectionFiles(
  env: ContentEnv,
  collection: string,
): Promise<string[]> {
  if (env.source === "github") {
    const tree = await fetchGithubTree(env);
    const prefix = `${env.root}/${collection}/`;
    return tree
      .filter((entry) => entry.startsWith(prefix))
      .filter((entry) => MARKDOWN_EXTENSIONS.has(extname(entry)))
      .map((entry) => entry.replace(`${env.root}/`, ""));
  }

  const { readdir } = await import("node:fs/promises");
  const pathModule = await import("node:path");
  const root = pathModule.resolve(process.cwd(), env.root, collection);
  const files = await walk(root, "", readdir, pathModule);
  return files.map((entry) => `${collection}/${entry}`.replace(/\/+/g, "/"));
}

export async function readContentFile(
  env: ContentEnv,
  relativePath: string,
): Promise<string> {
  if (env.source === "github") {
    return fetchGithubFile(env, `${env.root}/${relativePath}`);
  }

  const [{ readFile }, pathModule] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const absolutePath = pathModule.resolve(process.cwd(), env.root, relativePath);
  return readFile(absolutePath, "utf8");
}

export function getAssetRoot(env: ContentEnv): string {
  if (env.source === "github") {
    return getGithubAssetRoot(env).replace(/\/$/, "");
  }

  return "/content";
}

export function getAssetBaseDir(relativePath: string): string {
  return dirname(relativePath);
}

export function resolveAssetUrl(
  assetRoot: string,
  assetBaseDir: string,
  src?: string,
) {
  if (!src) return src;
  if (src.startsWith("http")) return src;
  const resolved = new URL(
    src,
    `https://content.local/${assetBaseDir}/`,
  ).pathname.replace(/^\//, "");
  return `${assetRoot}/${resolved}`.replace(/\/+/g, "/");
}
