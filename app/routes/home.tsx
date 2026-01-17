import { Link } from "react-router";
import type { Route } from "./+types/home";
import { listCollection } from "~/content/collections.server";
import {
  getAssetBaseDir,
  getAssetRoot,
  resolveAssetUrl,
} from "~/content/reader.server";
import { getContentEnv } from "~/content/env.server";
import { ContentCard } from "~/components/ContentCard";

export function meta() {
  return [
    { title: "Christian Cito" },
    {
      name: "description",
      content:
        "Product engineer + designer building digital experiences with clarity, motion, and intention.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = getContentEnv(context);
  const assetRoot = getAssetRoot(env);

  const [articles, projects, books] = await Promise.all([
    listCollection("articles", context),
    listCollection("projects", context),
    listCollection("books", context),
  ]);

  const featuredArticles = articles
    .sort((a, b) =>
      (b.frontmatter.publishedAt ?? "").localeCompare(
        a.frontmatter.publishedAt ?? "",
      ),
    )
    .slice(0, 2)
    .map((entry) => ({
      ...entry,
      image: resolveAssetUrl(
        assetRoot,
        getAssetBaseDir(entry.path),
        entry.frontmatter.image,
      ),
    }));

  const featuredProjects = projects
    .sort((a, b) => (a.frontmatter.order ?? 0) - (b.frontmatter.order ?? 0))
    .slice(0, 2)
    .map((entry) => ({
      ...entry,
      image: resolveAssetUrl(
        assetRoot,
        getAssetBaseDir(entry.path),
        entry.frontmatter.image,
      ),
    }));

  const featuredBooks = books
    .sort((a, b) => (b.frontmatter.rating ?? 0) - (a.frontmatter.rating ?? 0))
    .slice(0, 3)
    .map((entry) => ({
      ...entry,
      image: resolveAssetUrl(
        assetRoot,
        getAssetBaseDir(entry.path),
        entry.frontmatter.cover,
      ),
    }));

  return { featuredArticles, featuredProjects, featuredBooks };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featuredArticles, featuredProjects, featuredBooks } = loaderData;

  return (
    <div className="space-y-12">
      <section className="reveal border-b border-white/10 pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Digital product work
            </p>
            <h1 className="font-[var(--font-display)] text-[clamp(2.6rem,4.4vw,4.6rem)] font-semibold text-[color:var(--color-ink)]">
              I create digital products with taste, pressure, and clarity.
            </h1>
            <p className="max-w-2xl text-sm text-white/70">
              I work end to end across product, engineering, and design. I keep
              things direct, useful, and readable—my work and writing should
              speak for themselves.
            </p>
            <div className="space-y-3">
              <details className="group rounded-[1rem] border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-white/80">
                  <span>
                    Director at{" "}
                    <a
                      href="https://madebyarthouse.com"
                      className="text-[color:var(--color-brand)] underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Arthouse
                    </a>
                  </span>
                  <span className="text-white/50 transition group-open:rotate-45">
                    ↘
                  </span>
                </summary>
                <p className="mt-3 text-sm text-white/70">
                  A digital product studio focused on building sharp, resilient
                  products for teams who care about craft.
                </p>
              </details>
              <details className="group rounded-[1rem] border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-white/80">
                  <span>
                    Software team at{" "}
                    <a
                      href="https://hausgemacht.org"
                      className="text-[color:var(--color-brand)] underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      hausgemacht
                    </a>
                  </span>
                  <span className="text-white/50 transition group-open:rotate-45">
                    ↘
                  </span>
                </summary>
                <p className="mt-3 text-sm text-white/70">
                  A feminist techno collective in Vienna. I help with software,
                  systems, and digital operations.
                </p>
              </details>
            </div>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
              <Link to="/projects" className="hover:text-white">
                Projects
              </Link>
              <Link to="/articles" className="hover:text-white">
                Articles
              </Link>
              <Link to="/books" className="hover:text-white">
                Books
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10">
              <img
                src="/images/cut-out.png"
                alt="Christian Cito"
                className="h-56 w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-3 left-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
              10+ years on the web
            </span>
          </div>
        </div>
      </section>

      <section className="reveal space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Selected work
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--color-ink)]">
              Recent projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs uppercase tracking-[0.3em] text-white/50"
          >
            View all /
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {featuredProjects.map((project, index) => (
            <ContentCard
              key={project.id}
              to={`/projects/${project.slug}`}
              title={project.frontmatter.title}
              description={project.frontmatter.description}
              image={project.image}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="reveal space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Writing
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--color-ink)]">
              Stories & essays
            </h2>
          </div>
          <Link
            to="/articles"
            className="text-xs uppercase tracking-[0.3em] text-white/50"
          >
            View all /
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {featuredArticles.map((article, index) => (
            <ContentCard
              key={article.id}
              to={`/articles/${article.slug}`}
              title={article.frontmatter.title}
              description={article.frontmatter.description}
              image={article.image}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="reveal space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Reading shelf
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--color-ink)]">
              Favorite books
            </h2>
          </div>
          <Link
            to="/books"
            className="text-xs uppercase tracking-[0.3em] text-white/50"
          >
            View all /
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {featuredBooks.map((book, index) => (
            <ContentCard
              key={book.id}
              to={`/books/${book.slug}`}
              title={book.frontmatter.title}
              description={`${book.frontmatter.author} · ${book.frontmatter.year}`}
              image={book.image}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
