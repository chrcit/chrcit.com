import type { Route } from "./+types/projects";
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
    { title: "Projects · Christian Cito" },
    { name: "description", content: "Selected projects and experiments." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = getContentEnv(context);
  const assetRoot = getAssetRoot(env);
  const projects = await listCollection("projects", context);

  const items = projects
    .sort((a, b) => (a.frontmatter.order ?? 0) - (b.frontmatter.order ?? 0))
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

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Selected work"
        title="Projects"
        description="Apps, platforms, and digital experiments built to ship fast and stand out."
      />
      <div className="flex flex-col gap-4">
        {items.map((project, index) => (
          <ContentCard
            key={project.id}
            to={`/projects/${project.slug}`}
            title={project.frontmatter.title}
            description={project.frontmatter.description}
            image={project.image}
            eyebrow={project.frontmatter.tags?.[0]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
