import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArticleListLayout } from "~/components/layouts/ArticleListLayout";
import { getArticles } from "~/utils/content";

export function loader() {
  const articles = getArticles();
  return json({ articles });
}

export default function ArticlesPage() {
  const { articles } = useLoaderData<typeof loader>();
  return <ArticleListLayout articles={articles} />;
}
