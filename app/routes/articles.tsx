import type { Route } from "./+types/articles";
import { listCollection } from "~/content/collections.server";
import { getContentEnv } from "~/content/env.server";
import {
  getAssetBaseDir,
  getAssetRoot,
  resolveAssetUrl,
} from "~/content/reader.server";
import { ContentCard } from "~/components/ContentCard";
import { PageIntro } from "~/components/PageIntro";

export function meta() {
  return [
    { title: "Articles · Christian Cito" },
    { name: "description", content: "Essays, notes, and stories." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = getContentEnv(context);
  const assetRoot = getAssetRoot(env);
  const articles = await listCollection("articles", context);

  const items = articles
    .sort((a, b) =>
      (b.frontmatter.publishedAt ?? "").localeCompare(
        a.frontmatter.publishedAt ?? "",
      ),
    )
    .map((entry) => ({
      ...entry,
      image: resolveAssetUrl(
        assetRoot,
        getAssetBaseDir(entry.path),
        entry.frontmatter.image,
      ),
    }));

  return { items };
}

export default function Articles({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Writing"
        title="Articles"
        description="Reflections on product building, politics, and the web."
      />
      <div className="flex flex-col gap-4">
        {items.map((article, index) => (
          <ContentCard
            key={article.id}
            to={`/articles/${article.slug}`}
            title={article.frontmatter.title}
            description={article.frontmatter.description}
            image={article.image}
            eyebrow={article.frontmatter.publishedAt}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
