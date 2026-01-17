import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("articles", "routes/articles.tsx"),
  route("articles/:slug", "routes/articles.$slug.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("books", "routes/books.tsx"),
  route("books/:slug", "routes/books.$slug.tsx"),
  route("music", "routes/music.tsx"),
  route("content/*", "routes/content.tsx"),
  route(":slug", "routes/page.tsx"),
] satisfies RouteConfig;
