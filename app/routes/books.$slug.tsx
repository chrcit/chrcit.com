import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BookLayout } from "~/components/layouts/BookLayout";
import { getBook } from "~/utils/content";
import { getEmbedConsent } from "~/utils/embed-consent";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const book = getBook(params.slug ?? "");
  if (!book) {
    throw new Response("Not Found", { status: 404 });
  }

  const embedConsent = await getEmbedConsent(request);

  return json({
    book,
    embedConsent,
  });
}

export default function BookPage() {
  const { book, embedConsent } = useLoaderData<typeof loader>();

  return (
    <BookLayout
      title={book.title}
      description={book.description}
      author={book.author}
      rating={book.rating}
      cover={book.cover}
      year={book.year}
      category={book.category}
      tags={book.tags}
      url={book.url}
      content={book.body.code}
      embedConsent={embedConsent}
    />
  );
}
