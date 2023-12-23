import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';


// https://astro.build/config
export default defineConfig({
    vite: {
        ssr: {
            external: ['twitter-api-client']
        }
    },
    integrations: [tailwind(), sitemap(), mdx()]
});