import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      external: ["twitter-api-client"],
    },
  },
  markdown: {
    remarkPlugins: [remarkSectionize],
    rehypePlugins: [
      [
        rehypeSlug,
        {
          prefix: "heading-",
        },
      ],
    ],
  },
  site: "https://chrcit.com",
  integrations: [tailwind(), sitemap(), mdx(), robotsTxt()],
});
