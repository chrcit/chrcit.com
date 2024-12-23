import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";
import { type EmbedConsent } from "~/utils/embed-consent";
import { getMDXComponents } from "../mdx";
import { useMemo } from "react";
import { RelatedContent } from "../RelatedContent";
import { findRelatedContent } from "~/utils/content-relations";

interface ProjectLayoutProps {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  slug: string;
  content: string;
  embedConsent: EmbedConsent;
}

export function ProjectLayout({
  title,
  description,
  tags,
  image,
  slug,
  content,
  embedConsent,
}: ProjectLayoutProps) {
  const components = useMemo(
    () => getMDXComponents({ embedConsent }),
    [embedConsent],
  );

  const relatedContent = findRelatedContent("project", slug, tags);

  return (
    <RootLayout title={title} description={description} activeTab="/projects">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-brand"
          >
            ← Back to projects
          </Link>
        </div>

        <article className="prose prose-lg">
          <header className="not-prose mb-12">
            <h1 className="mb-4 text-4xl font-bold">{title}</h1>
            <p className="mb-6 text-xl text-gray-600">{description}</p>
            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {image && (
            <div className="not-prose mb-12 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                width={800}
                height={400}
              />
            </div>
          )}

          <div className="mdx">{content}</div>
        </article>

        <RelatedContent items={relatedContent} title="Related Projects" />
      </main>
    </RootLayout>
  );
}
