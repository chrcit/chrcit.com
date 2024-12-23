import { getArticles, getBooks, getProjects } from "./content";

interface RelatedContent {
  title: string;
  description: string;
  slug: string;
  type: "article" | "book" | "project";
  tags: string[];
}

export function findRelatedContent(
  type: "article" | "book" | "project",
  slug: string,
  tags: string[],
  limit = 3,
): RelatedContent[] {
  const articles = getArticles();
  const books = getBooks();
  const projects = getProjects();

  // Exclude the current content
  const allContent: RelatedContent[] = [
    ...articles
      .filter((article) => article.slug !== slug)
      .map((article) => ({
        title: article.title,
        description: article.description,
        slug: article.slug,
        type: "article" as const,
        tags: article.tags,
      })),
    ...books
      .filter((book) => book.slug !== slug)
      .map((book) => ({
        title: book.title,
        description: book.description,
        slug: book.slug,
        type: "book" as const,
        tags: book.tags,
      })),
    ...projects
      .filter((project) => project.slug !== slug)
      .map((project) => ({
        title: project.title,
        description: project.description,
        slug: project.slug,
        type: "project" as const,
        tags: project.tags,
      })),
  ];

  // Calculate relevance score based on tag matches
  const scoredContent = allContent.map((content) => {
    const matchingTags = tags.filter((tag) =>
      content.tags.includes(tag),
    ).length;
    return {
      ...content,
      score: matchingTags,
    };
  });

  // Sort by score and get top matches
  return scoredContent
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ title, description, slug, type, tags }) => ({
      title,
      description,
      slug,
      type,
      tags,
    }));
}

export function getRelatedArticles(slug: string, tags: string[], limit = 3) {
  return findRelatedContent("article", slug, tags, limit).filter(
    (content) => content.type === "article",
  );
}

export function getRelatedBooks(slug: string, tags: string[], limit = 3) {
  return findRelatedContent("book", slug, tags, limit).filter(
    (content) => content.type === "book",
  );
}

export function getRelatedProjects(slug: string, tags: string[], limit = 3) {
  return findRelatedContent("project", slug, tags, limit).filter(
    (content) => content.type === "project",
  );
}
