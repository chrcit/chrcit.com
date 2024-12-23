import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BookListLayout } from "~/components/layouts/BookListLayout";
import { getBooks } from "~/utils/content";

export function loader() {
  const books = getBooks();
  return json({ books });
}

export default function BooksPage() {
  const { books } = useLoaderData<typeof loader>();
  return <BookListLayout books={books} />;
}
