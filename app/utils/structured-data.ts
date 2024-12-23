interface Article {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  url: string;
  image?: string;
  tags: string[];
}

interface Book {
  title: string;
  description: string;
  author: string;
  rating: number;
  cover: string;
  year: number;
  category: string;
  tags: string[];
  url: string;
}

interface Project {
  title: string;
  description: string;
  image?: string;
  url: string;
  tags: string[];
}

export function generateArticleStructuredData(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: article.image,
    url: article.url,
    keywords: article.tags.join(", "),
  };
}

export function generateBookStructuredData(book: Book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    author: {
      "@type": "Person",
      name: book.author,
    },
    datePublished: book.year.toString(),
    image: book.cover,
    url: book.url,
    genre: book.category,
    keywords: book.tags.join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: book.rating,
      bestRating: "5",
      ratingCount: "1",
    },
  };
}

export function generateProjectStructuredData(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    image: project.image,
    url: project.url,
    applicationCategory: "WebApplication",
    keywords: project.tags.join(", "),
  };
}
