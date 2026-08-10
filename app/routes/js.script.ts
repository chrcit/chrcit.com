import type { LoaderFunctionArgs } from 'react-router';
import type { ANALYTICS_QUERYResult } from '@gen/sanity';
import { loadQuery } from '@/sanity/loader.server';
import { ANALYTICS_QUERY } from '@/sanity/queries';

export async function loader({ request }: LoaderFunctionArgs) {
  if (process.env.NODE_ENV !== 'production') {
    return new Response('// analytics disabled in dev', {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const { data } = await loadQuery<ANALYTICS_QUERYResult>(
    ANALYTICS_QUERY,
    {},
    { perspective: 'published', stega: false }
  );

  const plausible = data?.analytics?.plausible;
  if (!data?.analytics?.enabled || !plausible?.enabled) {
    return new Response('// analytics disabled', {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const url = new URL(request.url);
  const isLocalhost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1';
  if (isLocalhost) {
    return new Response('// analytics disabled on localhost', {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const base =
    plausible.selfHostedUrl?.replace(/\/$/, '') ?? 'https://plausible.io';
  const upstream = `${base}/js/script.js`;

  const res = await fetch(upstream, {
    headers: { 'User-Agent': request.headers.get('user-agent') ?? '' },
  });
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
