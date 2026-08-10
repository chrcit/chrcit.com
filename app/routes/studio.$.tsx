import { Suspense, lazy } from 'react';
import studio from '@/studio.css?url';

import type { LinksFunction, MetaFunction } from 'react-router';
import { noStoreCacheControl } from '@/lib/cache';

export const meta: MetaFunction = () => [
  { title: 'Sanity Studio' },
  { name: 'robots', content: 'noindex' },
];

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: studio }];
};

export const headers = () => ({
  'Cache-Control': noStoreCacheControl,
});

const StudioApp = lazy(() =>
  import('@/components/studio-app.client').then((module) => ({
    default: module.StudioApp,
  }))
);

export function HydrateFallback() {
  return <div className="studio-loading">Loading Studio…</div>;
}

export default function StudioPage() {
  // Sanity Studio is intentionally client-only: the Cloudflare/Vite build
  // removes `.client` modules from the Worker bundle to keep Studio out of
  // SSR. Return the same stable fallback during the initial document render
  // and let the browser hydrate the real Studio application.
  if (typeof document === 'undefined') {
    return <HydrateFallback />;
  }

  return (
    <Suspense fallback={<div className="studio-loading">Loading Studio…</div>}>
      <StudioApp />
    </Suspense>
  );
}
