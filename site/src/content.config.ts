import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// One generic item schema with a category flag (book, tool; later film, album/artist/song).
// Items render only where explicitly referenced (<Item ref="books/antifragile" />)
// or on their category archive page — never autoloaded into authored content.
const items = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/items" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(["book", "tool"]),
      author: z.string().optional(),
      year: z.number().optional(),
      rating: z.number().min(0).max(10).optional(),
      url: z.string().optional(),
      // one-line note shown under the title (dry; humour lives here)
      meta: z.string().optional(),
      // longer note for archive pages
      description: z.string().optional(),
      // tools only: Gear / Stack / Dev Tools / Productivity
      group: z.string().optional(),
      // lower = heavier / more important in the uses list
      rank: z.number().optional(),
      genre: z.string().optional(),
      cover: image().optional(),
      icon: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.date(),
      kind: z.enum(["notes", "annual"]).default("notes"),
      image: image().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      order: z.number().optional(),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
    }),
});

export const collections = { items, posts, projects };
