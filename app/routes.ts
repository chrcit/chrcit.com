import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route('robots.txt', 'routes/robots.txt.ts'),
  layout('routes/layout.tsx', [
    index('routes/index.tsx'),
    route(':slug', 'routes/page.$slug.tsx'),
    route('projects/:slug', 'routes/project.$slug.tsx'),
    route('writing/:slug', 'routes/article.$slug.tsx'),
  ]),
  route('api/event', 'routes/api.event.ts'),
  route('api/newsletter', 'routes/api.newsletter.ts'),
  route('api/preview-mode/enable', 'routes/api/preview-mode/enable.ts'),
  route('api/preview-mode/disable', 'routes/api/preview-mode/disable.ts'),
  route('js/script', 'routes/js.script.ts'),
  route('ingest/*', 'routes/ingest.$.ts'),
  route('studio/*', 'routes/studio.$.tsx'),
] satisfies RouteConfig;
