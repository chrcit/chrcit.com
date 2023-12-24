import { z, defineCollection } from "astro:content";

const pagesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const articlesCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      image: image().optional(),
      publishedAt: z.date().optional(),
    }),
});

const booksCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      rating: z.number(),
      author: z.string(),
      url: z.string(),
      category: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      cover: image(),
    }),
});

const filmsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    rating: z.number(),
    image: z.string().optional(),
    url: z.string(),
  }),
});

const showsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    rating: z.number(),
    image: z.string().optional(),
    url: z.string(),
  }),
});

const musiciansCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    url: z.string(),
    image: z.string().optional(),
  }),
});

const quotesCollection = defineCollection({
  type: "content",
  schema: z.object({
    text: z.string(),
    author: z.string(),
  }),
});

export const collections = {
  pages: pagesCollection,
  articles: articlesCollection,
  books: booksCollection,
  films: filmsCollection,
  shows: showsCollection,
  musicians: musiciansCollection,
  quotes: quotesCollection,
};
