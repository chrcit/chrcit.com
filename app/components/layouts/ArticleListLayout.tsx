import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";

interface Article {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
}

interface ArticleListLayoutProps {
  articles: Article[];
}

export function ArticleListLayout({ articles }: ArticleListLayoutProps) {
  return (
    <RootLayout
      title="Articles"
      description="Articles about software development, design, and other topics."
      activeTab="/articles"
    >
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="prose prose-lg">
          <h1>Articles</h1>
          <p className="lead">
            I write about software development, design, and other topics that
            interest me.
          </p>
        </div>

        <ul className="mt-12 space-y-8">
          {articles.map((article) => (
            <li key={article.slug}>
              <article>
                <Link
                  to={`/articles/${article.slug}`}
                  className="group block space-y-2 no-underline"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-brand">
                    {article.title}
                  </h2>
                  {article.publishedAt && (
                    <time
                      dateTime={article.publishedAt}
                      className="block text-sm text-gray-500"
                    >
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  )}
                  <p className="text-gray-600">{article.description}</p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </RootLayout>
  );
}
