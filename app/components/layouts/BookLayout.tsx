import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";
import { type EmbedConsent } from "~/utils/embed-consent";
import { getMDXComponents } from "../mdx";
import { useMemo } from "react";
import { RelatedContent } from "../RelatedContent";
import { findRelatedContent } from "~/utils/content-relations";

interface BookLayoutProps {
  title: string;
  description: string;
  author: string;
  rating: number;
  cover: string;
  year: number;
  category: string;
  tags: string[];
  url: string;
  slug: string;
  content: string;
  embedConsent: EmbedConsent;
}

export function BookLayout({
  title,
  description,
  author,
  rating,
  cover,
  year,
  category,
  tags,
  url,
  slug,
  content,
  embedConsent,
}: BookLayoutProps) {
  const components = useMemo(
    () => getMDXComponents({ embedConsent }),
    [embedConsent],
  );

  const relatedContent = findRelatedContent("book", slug, tags);

  return (
    <RootLayout title={title} description={description} activeTab="/books">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            to="/books"
            className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-brand"
          >
            ← Back to books
          </Link>
        </div>

        <article className="prose prose-lg">
          <div className="not-prose mb-12 grid gap-8 lg:grid-cols-[300px,1fr]">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={cover}
                alt={`Cover of ${title}`}
                className="h-full w-full object-cover"
                width={300}
                height={450}
              />
            </div>

            <div>
              <h1 className="mb-2 text-4xl font-bold">{title}</h1>
              <p className="mb-4 text-xl text-gray-600">by {author}</p>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-500">({rating}/5)</span>
              </div>

              <p className="mb-6 text-lg text-gray-600">{description}</p>

              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {category}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {year}
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90"
              >
                View on Amazon
              </a>
            </div>
          </div>

          <div className="mdx">{content}</div>
        </article>

        <RelatedContent items={relatedContent} title="Related Books" />
      </main>
    </RootLayout>
  );
}
