import { createMdxComponents } from "~/components/mdx/mdx-components";
import { MdxLayout } from "~/components/mdx/MdxLayout";
import type { Route } from "./+types/page";
import { getMdxEntry } from "~/content/collections.server";
import { useMdxComponent } from "~/content/useMdxComponent";

export async function loader({ params, context }: Route.LoaderArgs) {
  const entry = await getMdxEntry("pages", params.slug, context);
  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }

  return { entry };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  return [
    { title: `${data.entry.frontmatter.title} · Christian Cito` },
    { name: "description", content: data.entry.frontmatter.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { entry } = loaderData;
  const Content = useMdxComponent(entry.code);
  const components = createMdxComponents({
    assetRoot: entry.assetRoot,
    assetBaseDir: entry.assetBaseDir,
  });

  return (
    <MdxLayout
      title={entry.frontmatter.title}
      description={entry.frontmatter.description}
      headings={entry.headings}
      eyebrow="Page"
    >
      <Content components={components} />
    </MdxLayout>
  );
}
