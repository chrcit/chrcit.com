import { type PropsWithChildren } from "react";

interface BaseLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

export function BaseLayout({ children, title, description }: BaseLayoutProps) {
  const pageTitle = title ? `${title} | chrcit.com` : "Hi, I'm Christian";
  const pageDescription = description ?? "I create things for the internet";

  return (
    <div className="min-h-screen font-sans">
      {/* Plausible Analytics */}
      <script
        defer
        data-domain="chrcit.com"
        data-api="/scripts/api/event"
        src="/scripts/js/script.js"
      />
      {children}
    </div>
  );
}
