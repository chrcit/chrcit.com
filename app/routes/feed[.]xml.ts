import { type LoaderFunctionArgs } from "@remix-run/node";
import { getArticles } from "~/utils/content";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const articles = getArticles();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Christian Cito</title>
    <description>Personal website of Christian Cito</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    ${articles
      .map(
        (article) => `
    <item>
      <title>${article.title}</title>
      <description>${article.description}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${article.slug}</guid>
      ${article.tags.map((tag) => `<category>${tag}</category>`).join("")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(feed)),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
