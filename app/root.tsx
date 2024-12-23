import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import { useEffect } from "react";

import tailwindStyles from "~/styles/tailwind.css";
import { getTheme, setTheme } from "~/utils/theme.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Christian Cito" },
    { name: "description", content: "Personal website of Christian Cito" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { name: "theme-color", content: "#000000" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Christian Cito" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    theme: await getTheme(request),
  });
}

function prefetchNextRoutes() {
  const matches = useMatches();
  const location = useLocation();

  useEffect(() => {
    // Prefetch next likely routes based on current route
    let routesToPrefetch: string[] = [];

    if (location.pathname === "/") {
      routesToPrefetch = ["/articles", "/projects", "/books"];
    } else if (location.pathname === "/articles") {
      routesToPrefetch = ["/projects", "/books"];
    } else if (location.pathname === "/projects") {
      routesToPrefetch = ["/articles", "/books"];
    } else if (location.pathname === "/books") {
      routesToPrefetch = ["/articles", "/projects"];
    }

    // Use requestIdleCallback to prefetch during idle time
    const handle = window.requestIdleCallback(() => {
      routesToPrefetch.forEach((route) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
      });
    });

    return () => {
      window.cancelIdleCallback(handle);
    };
  }, [location.pathname]);
}

export default function App() {
  const { theme } = useLoaderData<typeof loader>();
  prefetchNextRoutes();

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <SkipToContent />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
    >
      Skip to content
    </a>
  );
}
