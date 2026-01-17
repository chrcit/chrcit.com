import { createMdxComponents } from "~/components/mdx/mdx-components";
import type { Route } from "./+types/books.$slug";
import { getMdxEntry } from "~/content/collections.server";
import { resolveAssetUrl } from "~/content/reader.server";
import { useMdxComponent } from "~/content/useMdxComponent";

export async function loader({ params, context }: Route.LoaderArgs) {
  const entry = await getMdxEntry("books", params.slug, context);
  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }

  const cover = resolveAssetUrl(
    entry.assetRoot,
    entry.assetBaseDir,
    entry.frontmatter.cover,
  );

  return { entry, cover };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  return [
    { title: `${data.entry.frontmatter.title} · Christian Cito` },
    { name: "description", content: data.entry.frontmatter.description },
  ];
}

export default function Book({ loaderData }: Route.ComponentProps) {
  const { entry, cover } = loaderData;
  const Content = useMdxComponent(entry.code);
  const components = createMdxComponents({
    assetRoot: entry.assetRoot,
    assetBaseDir: entry.assetBaseDir,
  });

  return (
    <article className="space-y-8">
      <header className="grid gap-6 border-b border-white/10 pb-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/10">
          <img src={cover} alt={entry.frontmatter.title} />
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Book notes
          </p>
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-semibold text-[color:var(--color-ink)]">
            {entry.frontmatter.title}
          </h1>
          <p className="text-sm text-white/70">
            {entry.frontmatter.author} · {entry.frontmatter.year}
          </p>
          <p className="max-w-xl text-base text-white/70">
            {entry.frontmatter.description}
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
            <span>Rating {entry.frontmatter.rating}</span>
            <span>{entry.frontmatter.category}</span>
          </div>
        </div>
      </header>

      <section className="prose prose-base max-w-none font-sans prose-headings:font-[var(--font-display)] prose-headings:font-semibold prose-headings:text-[color:var(--color-ink)] prose-a:text-[color:var(--color-brand)] prose-strong:text-[color:var(--color-ink)] prose-p:text-white/75 prose-code:font-[var(--font-mono)] prose-code:text-white/80 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50">
        <Content components={components} />
      </section>
    </article>
  );
}
