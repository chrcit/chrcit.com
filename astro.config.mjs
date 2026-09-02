// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://chrcit.com",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    server: {
      proxy: {
        "/js/script.js": {
          target: "https://plausible.io",
          changeOrigin: true,
        },
        "/api/event": {
          target: "https://plausible.io",
          changeOrigin: true,
        },
      },
    },
  },
  redirects: {
    "/articles": "/",
    "/writing": "/",
    "/writing/2023-year-in-review": "/articles/2023-year-in-review",
    "/projects": "/",
    "/privacy-policy": "/privacy",
    "/books/breaking-out-of-homeostasis": "/books",
  },
});
