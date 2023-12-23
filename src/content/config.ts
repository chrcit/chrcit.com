import { z, defineCollection } from "astro:content";

const articlesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    publishedAt: z.date().optional(),
  }),
});

const booksCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    rating: z.number(),
    author: z.string(),
    url: z.string(),
    image: z.string().optional(),
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
  articles: articlesCollection,
  books: booksCollection,
  films: filmsCollection,
  shows: showsCollection,
  musicians: musiciansCollection,
  quotes: quotesCollection,
};
