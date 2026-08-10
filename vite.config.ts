import { reactRouter } from '@react-router/dev/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const previewOrigin =
    env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN ?? 'https://your-domain.example';

  return {
    // Sanity Presentation reads this at build time. Keep a code-level default
    // so a Cloudflare build cannot silently fall back to localhost.
    define: {
      'import.meta.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN':
        JSON.stringify(previewOrigin),
    },
    publicDir: 'static',
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './app'),
        '@': path.resolve(__dirname, './app'),
        '@root': path.resolve(__dirname, '.'),
      },
    },
  };
});
