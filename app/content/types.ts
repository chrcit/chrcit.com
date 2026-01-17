export type CollectionName =
  | "pages"
  | "articles"
  | "projects"
  | "books"
  | "films"
  | "shows"
  | "musicians"
  | "quotes";

export type PageFrontmatter = {
  title: string;
  description: string;
};

export type ArticleFrontmatter = {
  title: string;
  tags: string[];
  description: string;
  image?: string;
  publishedAt?: string;
};

export type ProjectFrontmatter = {
  title: string;
  order: number;
  tags: string[];
  description: string;
  image?: string;
};

export type BookFrontmatter = {
  title: string;
  rating: number;
  author: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  cover: string;
  year: number;
};

export type FilmFrontmatter = {
  title: string;
  rating: number;
  image?: string;
  url: string;
};

export type ShowFrontmatter = {
  title: string;
  rating: number;
  image?: string;
  url: string;
};

export type MusicianFrontmatter = {
  name: string;
  url: string;
  image?: string;
};

export type QuoteFrontmatter = {
  text: string;
  author: string;
};

export type FrontmatterByCollection = {
  pages: PageFrontmatter;
  articles: ArticleFrontmatter;
  projects: ProjectFrontmatter;
  books: BookFrontmatter;
  films: FilmFrontmatter;
  shows: ShowFrontmatter;
  musicians: MusicianFrontmatter;
  quotes: QuoteFrontmatter;
};

export type ContentEntry<T> = {
  id: string;
  slug: string;
  collection: CollectionName;
  path: string;
  frontmatter: T;
  excerpt?: string;
};

export type MdxEntry<T> = ContentEntry<T> & {
  code: string;
  headings: Array<{ depth: number; value: string; id: string }>;
  assetRoot: string;
  assetBaseDir: string;
};
