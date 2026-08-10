import type { LoaderFunctionArgs } from 'react-router';
import { getServerConfig } from '@/config';
import { publicPageCacheControl } from '@/lib/cache';

function getBaseUrl(url: URL): string {
  if (process.env.SITE_URL || process.env.PRODUCTION_URL)
    return getServerConfig().productionUrl;
  return url.origin;
}

export async function loader({ url }: LoaderFunctionArgs) {
  const baseUrl = getBaseUrl(url).replace(/\/$/, '');

  const body = [
    'User-agent: *',
    'Disallow: /studio',
    'Disallow: /api/',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': publicPageCacheControl,
    },
  });
}
