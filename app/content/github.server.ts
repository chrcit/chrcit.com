import type { ContentEnv } from "~/content/env.server";

const treeCache = new Map<string, string[]>();
const fileCache = new Map<string, string>();

function getAuthHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchGithubTree(env: ContentEnv): Promise<string[]> {
  const cacheKey = `${env.repo}@${env.ref}`;
  const cached = treeCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/repos/${env.repo}/git/trees/${env.ref}?recursive=1`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...getAuthHeader(env.token),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load GitHub tree: ${response.status}`);
  }

  const data = (await response.json()) as {
    tree?: Array<{ path: string; type: string }>;
  };
  const paths = (data.tree ?? [])
    .filter((entry) => entry.type === "blob")
    .map((entry) => entry.path);

  treeCache.set(cacheKey, paths);
  return paths;
}

export async function fetchGithubFile(
  env: ContentEnv,
  filePath: string,
): Promise<string> {
  const cacheKey = `${env.repo}@${env.ref}:${filePath}`;
  const cached = fileCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://raw.githubusercontent.com/${env.repo}/${env.ref}/${filePath}`;
  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
      ...getAuthHeader(env.token),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load GitHub file: ${response.status}`);
  }

  const text = await response.text();
  fileCache.set(cacheKey, text);
  return text;
}

export async function fetchGithubAsset(
  env: ContentEnv,
  filePath: string,
): Promise<ArrayBuffer> {
  const url = `https://raw.githubusercontent.com/${env.repo}/${env.ref}/${filePath}`;
  const response = await fetch(url, {
    headers: {
      ...getAuthHeader(env.token),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load GitHub asset: ${response.status}`);
  }

  return response.arrayBuffer();
}

export function getGithubAssetRoot(env: ContentEnv) {
  return `https://raw.githubusercontent.com/${env.repo}/${env.ref}/${env.root}`;
}
