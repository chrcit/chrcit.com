import {
  allArticles,
  allBooks,
  allPages,
  allProjects,
} from "contentlayer/generated";

export function getArticles() {
  return allArticles.sort(
    (a, b) =>
      new Date(b.publishedAt ?? 0).getTime() -
      new Date(a.publishedAt ?? 0).getTime(),
  );
}

export function getArticle(slug: string) {
  return allArticles.find((article) => article.slug === slug);
}

export function getProjects() {
  return allProjects.sort((a, b) => a.order - b.order);
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export function getBooks() {
  return allBooks.sort((a, b) => b.year - a.year);
}

export function getBook(slug: string) {
  return allBooks.find((book) => book.slug === slug);
}

export function getPage(slug: string) {
  return allPages.find((page) => page.slug === slug);
}
