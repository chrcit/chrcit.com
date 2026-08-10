import { cacheHeader } from 'pretty-cache-header';

/**
 * Keep document freshness short because HTML points at hashed Vite assets.
 * Cloudflare Workers Cache uses this response header when `cache.enabled` is on.
 */
export const publicPageCacheControl = cacheHeader({
  public: true,
  maxAge: '0s',
  sMaxage: '60s',
  staleWhileRevalidate: '5m',
});

export const noStoreCacheControl = cacheHeader({ noStore: true });

export function getDocumentCacheHeaders(preview: boolean): HeadersInit {
  return {
    'Cache-Control': preview ? noStoreCacheControl : publicPageCacheControl,
  };
}
