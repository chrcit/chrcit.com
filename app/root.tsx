import {
  data as routeData,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { getServerConfig } from '@/config';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';
import { previewContext } from '@/sanity/preview';
import './app.css';

export async function loader({ request }: Route.LoaderArgs) {
  const { preview } = await previewContext(request.headers);

  const ENV = {
    VITE_SANITY_PROJECT_ID: process.env.VITE_SANITY_PROJECT_ID,
    VITE_SANITY_DATASET: process.env.VITE_SANITY_DATASET,
    VITE_SANITY_API_VERSION: process.env.VITE_SANITY_API_VERSION,
    VITE_SANITY_STUDIO_URL: process.env.VITE_SANITY_STUDIO_URL,
    VITE_SANITY_STUDIO_PREVIEW_ORIGIN:
      process.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN,
  };

  const config = getServerConfig();

  return routeData(
    { preview, ENV, config },
    { headers: getDocumentCacheHeaders(preview) }
  );
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {/* dangerouslySetInnerHTML coming from guide https://www.sanity.io/docs/visual-editing/visual-editing-with-react-router */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
