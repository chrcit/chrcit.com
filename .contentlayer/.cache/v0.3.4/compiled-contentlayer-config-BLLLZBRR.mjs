// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true }
  }
}));
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: "articles/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    description: { type: "string", required: true },
    image: { type: "string", required: false },
    publishedAt: { type: "date", required: false }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "projects/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    order: { type: "number", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    description: { type: "string", required: true },
    image: { type: "string", required: false }
  }
}));
var Book = defineDocumentType(() => ({
  name: "Book",
  filePathPattern: "books/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    rating: { type: "number", required: true },
    author: { type: "string", required: true },
    url: { type: "string", required: true },
    category: { type: "string", required: true },
    description: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: true },
    year: { type: "number", required: true }
  }
}));
var Film = defineDocumentType(() => ({
  name: "Film",
  filePathPattern: "films/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    rating: { type: "number", required: true },
    image: { type: "string", required: false },
    url: { type: "string", required: true }
  }
}));
var Show = defineDocumentType(() => ({
  name: "Show",
  filePathPattern: "shows/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    rating: { type: "number", required: true },
    image: { type: "string", required: false },
    url: { type: "string", required: true }
  }
}));
var Musician = defineDocumentType(() => ({
  name: "Musician",
  filePathPattern: "musicians/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    url: { type: "string", required: true },
    image: { type: "string", required: false }
  }
}));
var Quote = defineDocumentType(() => ({
  name: "Quote",
  filePathPattern: "quotes/**/*.mdx",
  contentType: "mdx",
  fields: {
    text: { type: "string", required: true },
    author: { type: "string", required: true }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Page, Article, Project, Book, Film, Show, Musician, Quote]
});
export {
  Article,
  Book,
  Film,
  Musician,
  Page,
  Project,
  Quote,
  Show,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-BLLLZBRR.mjs.map
