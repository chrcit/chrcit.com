// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://chrcit.com",
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  session: false,
  integrations: [mdx(), sitemap(), react()],
  vite: {
    server: {
      proxy: {
        "/js/script.js": {
          target: "https://plausible.io",
          changeOrigin: true,
          rewrite: () => "/js/script.outbound-links.js",
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
