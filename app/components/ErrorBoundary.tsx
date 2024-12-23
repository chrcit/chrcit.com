import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { RootLayout } from "./layouts/RootLayout";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <RootLayout
            title="Page Not Found"
            description="The page you're looking for doesn't exist."
          >
            <main className="mx-auto max-w-4xl px-6 py-12">
              <div className="prose prose-lg">
                <h1>Page Not Found</h1>
                <p>
                  The page you're looking for doesn't exist. Please check the
                  URL and try again.
                </p>
                <p>
                  <a href="/" className="text-brand hover:text-brand/90">
                    ← Go back home
                  </a>
                </p>
              </div>
            </main>
          </RootLayout>
        );
      case 401:
        return (
          <RootLayout
            title="Unauthorized"
            description="You don't have permission to access this page."
          >
            <main className="mx-auto max-w-4xl px-6 py-12">
              <div className="prose prose-lg">
                <h1>Unauthorized</h1>
                <p>
                  You don't have permission to access this page. Please log in
                  and try again.
                </p>
                <p>
                  <a href="/" className="text-brand hover:text-brand/90">
                    ← Go back home
                  </a>
                </p>
              </div>
            </main>
          </RootLayout>
        );
      default:
        return (
          <RootLayout
            title="Error"
            description="Something went wrong. Please try again later."
          >
            <main className="mx-auto max-w-4xl px-6 py-12">
              <div className="prose prose-lg">
                <h1>Error</h1>
                <p>
                  Something went wrong. Please try again later. If the problem
                  persists, please contact support.
                </p>
                <p>
                  <a href="/" className="text-brand hover:text-brand/90">
                    ← Go back home
                  </a>
                </p>
                {process.env.NODE_ENV === "development" && (
                  <pre className="mt-4 rounded-lg bg-gray-100 p-4">
                    {error.data.message || JSON.stringify(error.data, null, 2)}
                  </pre>
                )}
              </div>
            </main>
          </RootLayout>
        );
    }
  }

  return (
    <RootLayout
      title="Error"
      description="Something went wrong. Please try again later."
    >
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-lg">
          <h1>Error</h1>
          <p>
            Something went wrong. Please try again later. If the problem
            persists, please contact support.
          </p>
          <p>
            <a href="/" className="text-brand hover:text-brand/90">
              ← Go back home
            </a>
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 rounded-lg bg-gray-100 p-4">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </pre>
          )}
        </div>
      </main>
    </RootLayout>
  );
}
