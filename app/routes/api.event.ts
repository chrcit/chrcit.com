import type { Route } from './+types/api.event';
import type { ANALYTICS_QUERYResult } from '@gen/sanity';
import { loadQuery } from '@/sanity/loader.server';
import { ANALYTICS_QUERY } from '@/sanity/queries';
import { noStoreCacheControl } from '@/lib/cache';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { 'Cache-Control': noStoreCacheControl },
    });
  }
  if (!import.meta.env.PROD && process.env.NODE_ENV !== 'production') {
    return new Response('OK', {
      status: 200,
      headers: { 'Cache-Control': noStoreCacheControl },
    });
  }

  const { data } = await loadQuery<ANALYTICS_QUERYResult>(
    ANALYTICS_QUERY,
    {},
    { perspective: 'published', stega: false }
  );

  const plausible = data?.analytics?.plausible;
  if (!data?.analytics?.enabled || !plausible?.enabled) {
    return new Response('OK', {
      status: 200,
      headers: { 'Cache-Control': noStoreCacheControl },
    });
  }

  const url = new URL(request.url);
  const isLocalhost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1';
  if (isLocalhost) {
    return new Response('OK', {
      status: 200,
      headers: { 'Cache-Control': noStoreCacheControl },
    });
  }

  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-ip') ||
    request.headers.get('x-nf-client-connection-ip');

  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type') ?? 'application/json';
  const body = await request.text();

  const base =
    plausible.selfHostedUrl?.replace(/\/$/, '') ?? 'https://plausible.io';
  const upstream = `${base}/api/event`;

  const res = await fetch(upstream, {
    body,
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      ...(clientIp ? { 'X-Forwarded-For': clientIp } : null),
      ...(userAgent ? { 'User-Agent': userAgent } : null),
    } as Record<string, string>,
  });

  const resBody = await res.text();
  return new Response(resBody, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'text/plain',
      'Cache-Control': noStoreCacheControl,
    },
  });
}
