import { Link } from "react-router";
import type { Route } from "./+types/books";
import { listCollection } from "~/content/collections.server";
import { getContentEnv } from "~/content/env.server";
import {
  getAssetBaseDir,
  getAssetRoot,
  resolveAssetUrl,
} from "~/content/reader.server";
import { PageIntro } from "~/components/PageIntro";

export function meta() {
  return [
    { title: "Books · Christian Cito" },
    { name: "description", content: "Favorite books and recommendations." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = getContentEnv(context);
  const assetRoot = getAssetRoot(env);
  const books = await listCollection("books", context);

  const items = books.map((entry) => ({
    ...entry,
    cover: resolveAssetUrl(
      assetRoot,
      getAssetBaseDir(entry.path),
      entry.frontmatter.cover,
    ),
  }));

  const grouped = items.reduce<Record<string, typeof items>>((acc, entry) => {
    const category = entry.frontmatter.category ?? "Other";
    acc[category] ??= [];
    acc[category].push(entry);
    return acc;
  }, {});

  for (const category of Object.keys(grouped)) {
    grouped[category].sort(
      (a, b) => (b.frontmatter.rating ?? 0) - (a.frontmatter.rating ?? 0),
    );
  }

  const categoryOrder = [
    "Politics, History, and Economics",
    "Self-Development",
    "Meditation",
    "Entertainment",
    "Fiction",
  ];
  const orderedCategories = Object.keys(grouped).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return { grouped, orderedCategories };
}

export default function Books({ loaderData }: Route.ComponentProps) {
  const { grouped, orderedCategories } = loaderData;

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Reading list"
        title="Books"
        description="A personal library of the stories, ideas, and manuals that shape my thinking."
      />

      <div className="space-y-12">
        {orderedCategories.map((category) => (
          <section key={category} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[color:var(--color-ink)]">
                {category}
              </h2>
              <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                {grouped[category].length} titles
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {grouped[category].map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.slug}`}
                  className="group relative flex w-36 flex-col gap-2"
                >
                  <div className="relative overflow-hidden rounded-[0.75rem] border border-white/10 bg-white/10">
                    <img
                      src={book.cover}
                      alt={book.frontmatter.title}
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                      {book.frontmatter.rating}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--color-ink)]">
                      {book.frontmatter.title}
                    </p>
                    <p className="text-xs text-white/60">
                      {book.frontmatter.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
