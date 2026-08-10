import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './app/sanity/schema/index';
import { structure } from './app/sanity/structure';
import { projectId, dataset, apiVersion } from './app/sanity/project-details';
import { locations, mainDocuments } from './app/sanity/presentation/resolve';
import { StudioLogo, studioTheme } from './app/sanity/studio/branding';

function getPreviewOrigin(): string | undefined {
  // Sanity CLI / Node
  if (typeof process !== 'undefined' && process.env) {
    const value =
      process.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN ??
      process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
    if (value) return value;
  }

  // Embedded Studio (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env as unknown as {
      VITE_SANITY_STUDIO_PREVIEW_ORIGIN?: string;
    };
    if (env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN) {
      return env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN;
    }
  }

  return undefined;
}

export default defineConfig({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  name: 'default',
  title: 'chrcit.com',
  icon: StudioLogo,
  theme: studioTheme,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      allowOrigins: ['http://localhost:*'],
      resolve: { locations, mainDocuments },
      previewUrl: {
        origin: getPreviewOrigin() || 'http://localhost:5173',
        preview: '/',
        previewMode: {
          enable: '/api/preview-mode/enable',
          disable: '/api/preview-mode/disable',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
