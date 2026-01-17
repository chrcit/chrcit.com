import { createMdxComponents } from "~/components/mdx/mdx-components";
import { MdxLayout } from "~/components/mdx/MdxLayout";
import type { Route } from "./+types/articles.$slug";
import { getMdxEntry } from "~/content/collections.server";
import { resolveAssetUrl } from "~/content/reader.server";
import { useMdxComponent } from "~/content/useMdxComponent";

export async function loader({ params, context }: Route.LoaderArgs) {
  const entry = await getMdxEntry("articles", params.slug, context);
  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }

  const image = resolveAssetUrl(
    entry.assetRoot,
    entry.assetBaseDir,
    entry.frontmatter.image,
  );

  return { entry, image };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  return [
    { title: `${data.entry.frontmatter.title} · Christian Cito` },
    { name: "description", content: data.entry.frontmatter.description },
  ];
}

export default function Article({ loaderData }: Route.ComponentProps) {
  const { entry, image } = loaderData;
  const Content = useMdxComponent(entry.code);
  const components = createMdxComponents({
    assetRoot: entry.assetRoot,
    assetBaseDir: entry.assetBaseDir,
  });

  return (
    <MdxLayout
      title={entry.frontmatter.title}
      description={entry.frontmatter.description}
      image={image}
      headings={entry.headings}
      eyebrow="Article"
    >
      <Content components={components} />
    </MdxLayout>
  );
}
