import type { LoaderFunctionArgs } from 'react-router';
import type { SITEMAP_QUERYResult } from '@gen/sanity';
import { getServerConfig } from '@/config';
import { loadQuery } from '@/sanity/loader.server';
import { SITEMAP_QUERY } from '@/sanity/queries';
import { publicPageCacheControl } from '@/lib/cache';

function getBaseUrl(url: URL): string {
  if (process.env.SITE_URL || process.env.PRODUCTION_URL)
    return getServerConfig().productionUrl;
  return url.origin;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function loader({ url }: LoaderFunctionArgs) {
  const baseUrl = getBaseUrl(url).replace(/\/$/, '');

  const { data } = await loadQuery<SITEMAP_QUERYResult>(
    SITEMAP_QUERY,
    {},
    { perspective: 'published', stega: false }
  );

  const urls = (data ?? [])
    .map((entry) => {
      const path = entry?.url ?? null;
      if (!path) return null;
      const loc = new URL(path, `${baseUrl}/`).toString();
      const lastmod = entry?._updatedAt ?? null;
      return { loc, lastmod };
    })
    .filter(Boolean) as Array<{ loc: string; lastmod: string | null }>;

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ loc, lastmod }) =>
      [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': publicPageCacheControl,
    },
  });
}
