import type { Route } from "./+types/content";
import { getContentEnv } from "~/content/env.server";
import { fetchGithubAsset } from "~/content/github.server";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const contentPath = params["*"];
  if (!contentPath) {
    throw new Response("Not found", { status: 404 });
  }

  const env = getContentEnv(context);
  const extension = `.${contentPath.split(".").pop() ?? ""}`.toLowerCase();
  const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

  if (env.source === "github") {
    const body = await fetchGithubAsset(env, `${env.root}/${contentPath}`);
    return new Response(body, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=3600",
      },
    });
  }

  const [{ readFile }, pathModule] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const root = pathModule.resolve(process.cwd(), env.root);
  const absolutePath = pathModule.resolve(root, contentPath);

  if (!absolutePath.startsWith(root)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const buffer = await readFile(absolutePath);
  return new Response(buffer, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600",
    },
  });
}

// Resource route: no component export so the loader response is streamed directly.
