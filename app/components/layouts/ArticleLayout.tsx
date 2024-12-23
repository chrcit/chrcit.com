import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";
import { type EmbedConsent } from "~/utils/embed-consent";
import { getMDXComponents } from "../mdx";
import { useMemo } from "react";
import { RelatedContent } from "../RelatedContent";
import { findRelatedContent } from "~/utils/content-relations";

interface ArticleLayoutProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  slug: string;
  content: string;
  embedConsent: EmbedConsent;
}

export function ArticleLayout({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  tags,
  slug,
  content,
  embedConsent,
}: ArticleLayoutProps) {
  const components = useMemo(
    () => getMDXComponents({ embedConsent }),
    [embedConsent],
  );

  const relatedContent = findRelatedContent("article", slug, tags);

  return (
    <RootLayout title={title} description={description} activeTab="/articles">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            to="/articles"
            className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-brand"
          >
            ← Back to articles
          </Link>
        </div>

        <article className="prose prose-lg">
          <header className="not-prose mb-12">
            <h1 className="mb-4 text-4xl font-bold">{title}</h1>
            <p className="mb-6 text-xl text-gray-600">{description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">By {author}</span>
                <span className="text-gray-300">•</span>
                <time dateTime={publishedAt} className="text-sm text-gray-600">
                  {new Date(publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {updatedAt && (
                  <>
                    <span className="text-gray-300">•</span>
                    <time
                      dateTime={updatedAt}
                      className="text-sm text-gray-600"
                    >
                      Updated{" "}
                      {new Date(updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </>
                )}
              </div>
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
            </div>
          </header>

          <div className="mdx">{content}</div>
        </article>

        <RelatedContent items={relatedContent} title="Related Articles" />
      </main>
    </RootLayout>
  );
}
