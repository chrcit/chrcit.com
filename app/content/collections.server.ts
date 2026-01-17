import matter from "gray-matter";
import type { AppLoadContext } from "react-router";
import { getContentEnv } from "~/content/env.server";
import {
  getAssetBaseDir,
  getAssetRoot,
  listCollectionFiles,
  readContentFile,
} from "~/content/reader.server";
import { compileMdx } from "~/content/mdx.server";
import type {
  CollectionName,
  ContentEntry,
  FrontmatterByCollection,
  MdxEntry,
} from "~/content/types";

function toSlug(pathName: string) {
  return pathName.replace(/\.mdx?$/, "");
}

function toId(collection: string, slug: string) {
  return `${collection}/${slug}`;
}

function normalizeFrontmatter<T>(frontmatter: T): T {
  if (
    typeof frontmatter === "object" &&
    frontmatter !== null &&
    "publishedAt" in frontmatter
  ) {
    const value = (frontmatter as { publishedAt?: unknown }).publishedAt;
    if (value instanceof Date) {
      return {
        ...frontmatter,
        publishedAt: value.toISOString().slice(0, 10),
      } as T;
    }
  }

  return frontmatter;
}

export async function listCollection<T extends CollectionName>(
  collection: T,
  context?: AppLoadContext,
): Promise<ContentEntry<FrontmatterByCollection[T]>[]> {
  const env = getContentEnv(context);
  const files = await listCollectionFiles(env, collection);

  const entries = await Promise.all(
    files.map(async (relativePath) => {
      const raw = await readContentFile(env, relativePath);
      const { data } = matter(raw);
      const slug = toSlug(relativePath.split("/").pop() ?? "");

      return {
        id: toId(collection, slug),
        slug,
        collection,
        path: relativePath,
        frontmatter: normalizeFrontmatter(data as FrontmatterByCollection[T]),
      };
    }),
  );

  return entries;
}

export async function getEntryBySlug<T extends CollectionName>(
  collection: T,
  slug: string,
  context?: AppLoadContext,
): Promise<ContentEntry<FrontmatterByCollection[T]> | null> {
  const env = getContentEnv(context);
  const files = await listCollectionFiles(env, collection);
  const match = files.find((file) => toSlug(file.split("/").pop() ?? "") === slug);
  if (!match) return null;

  const raw = await readContentFile(env, match);
  const { data } = matter(raw);

  return {
    id: toId(collection, slug),
    slug,
    collection,
    path: match,
    frontmatter: normalizeFrontmatter(data as FrontmatterByCollection[T]),
  };
}

export async function getMdxEntry<T extends CollectionName>(
  collection: T,
  slug: string,
  context?: AppLoadContext,
): Promise<MdxEntry<FrontmatterByCollection[T]> | null> {
  const env = getContentEnv(context);
  const files = await listCollectionFiles(env, collection);
  const match = files.find((file) => toSlug(file.split("/").pop() ?? "") === slug);
  if (!match) return null;

  const raw = await readContentFile(env, match);
  const { data, content } = matter(raw);
  const { code, headings } = await compileMdx(content);

  return {
    id: toId(collection, slug),
    slug,
    collection,
    path: match,
    frontmatter: normalizeFrontmatter(data as FrontmatterByCollection[T]),
    code,
    headings,
    assetRoot: getAssetRoot(env),
    assetBaseDir: getAssetBaseDir(match),
  };
}
