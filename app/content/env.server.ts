import type { AppLoadContext } from "react-router";

export type ContentSource = "local" | "github";

export type ContentEnv = {
  source: ContentSource;
  repo: string;
  ref: string;
  root: string;
  token?: string;
};

const DEFAULT_ROOT = "astro-legacy/src/content";
const DEFAULT_REPO = "chrcit/chrcit.com";

const BRANCH_ENV_KEYS = [
  "CONTENT_REF",
  "CF_PAGES_BRANCH",
  "VERCEL_GIT_COMMIT_REF",
  "GITHUB_REF_NAME",
  "BRANCH",
];

function readEnvValue(
  context: AppLoadContext | undefined,
  key: string,
): string | undefined {
  const cloudflareEnv =
    (context as { cloudflare?: { env?: Record<string, string> } })?.cloudflare
      ?.env ?? {};
  return (
    cloudflareEnv[key] ??
    (typeof process !== "undefined" ? process.env[key] : undefined) ??
    (import.meta as { env?: Record<string, string> }).env?.[key]
  );
}

function resolveRef(context?: AppLoadContext) {
  for (const key of BRANCH_ENV_KEYS) {
    const value = readEnvValue(context, key);
    if (value) return value;
  }

  return "main";
}

export function getContentEnv(context?: AppLoadContext): ContentEnv {
  const explicitSource = readEnvValue(context, "CONTENT_SOURCE") as
    | ContentSource
    | undefined;
  const isProduction =
    typeof process !== "undefined"
      ? process.env.NODE_ENV === "production"
      : true;
  const source = explicitSource ?? (isProduction ? "github" : "local");

  return {
    source,
    repo: readEnvValue(context, "CONTENT_REPO") ?? DEFAULT_REPO,
    ref: resolveRef(context),
    root: readEnvValue(context, "CONTENT_ROOT") ?? DEFAULT_ROOT,
    token: readEnvValue(context, "GITHUB_TOKEN"),
  };
}
