import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { SiteShell } from "~/components/layout/SiteShell";
import { ConsentProvider } from "~/components/consent/ConsentProvider";
import { MusicPlayerProvider } from "~/components/music/MusicPlayerProvider";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Christian Cito builds bold web experiences, thoughtful products, and digital experiments."
        />
        <meta property="og:title" content="Christian Cito" />
        <meta
          property="og:description"
          content="Product engineer + designer building projects that blend clarity with motion."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chrcit.com" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <ConsentProvider>{children}</ConsentProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MusicPlayerProvider>
      <SiteShell>
        <Outlet />
      </SiteShell>
    </MusicPlayerProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-black/40">
        {message}
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-[color:var(--color-ink)]">
        {details}
      </h1>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto rounded-xl bg-white/70 p-4 text-xs text-black/70">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
