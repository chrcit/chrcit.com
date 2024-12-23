import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArticleLayout } from "~/components/layouts/ArticleLayout";
import { getArticle } from "~/utils/content";
import { getEmbedConsent } from "~/utils/embed-consent";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const article = getArticle(params.slug ?? "");
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  const embedConsent = await getEmbedConsent(request);

  return json({
    article,
    embedConsent,
  });
}

export default function ArticlePage() {
  const { article, embedConsent } = useLoaderData<typeof loader>();

  return (
    <ArticleLayout
      title={article.title}
      description={article.description}
      publishedAt={article.publishedAt}
      content={article.body.code}
      embedConsent={embedConsent}
    />
  );
}
