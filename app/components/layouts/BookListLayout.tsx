import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";

interface Book {
  title: string;
  description: string;
  slug: string;
  author: string;
  rating: number;
  cover: string;
  year: number;
  category: string;
  tags: string[];
}

interface BookListLayoutProps {
  books: Book[];
}

export function BookListLayout({ books }: BookListLayoutProps) {
  return (
    <RootLayout
      title="Books"
      description="A collection of books I've read and recommend."
      activeTab="/books"
    >
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-lg">
          <h1>Books</h1>
          <p className="lead">
            A collection of books I've read and recommend. I try to read a mix
            of fiction and non-fiction, with a focus on technology, science, and
            philosophy.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <li key={book.slug}>
              <Link
                to={`/books/${book.slug}`}
                className="group block h-full space-y-4 rounded-lg border border-gray-200 p-6 no-underline transition-all hover:border-brand"
              >
                <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover"
                    width={300}
                    height={450}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">by {book.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < book.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({book.rating}/5)
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {book.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {book.year}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </RootLayout>
  );
}
