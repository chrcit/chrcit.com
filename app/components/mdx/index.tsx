import { Link } from "@remix-run/react";
import { useMemo } from "react";
import { type EmbedConsent } from "~/utils/embed-consent";
import {
  YouTubeEmbed,
  TwitterEmbed,
  InstagramEmbed,
  RedditEmbed,
} from "../embeds";

interface MDXComponentsProps {
  embedConsent: EmbedConsent;
}

export function getMDXComponents({ embedConsent }: MDXComponentsProps) {
  return useMemo(
    () => ({
      // Custom link handling
      a: ({
        href,
        children,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const isExternal = href?.startsWith("http");
        const isAnchor = href?.startsWith("#");

        if (isExternal) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2"
              {...props}
            >
              {children}
            </a>
          );
        }

        if (isAnchor) {
          return (
            <a
              href={href}
              className="text-brand underline underline-offset-2"
              {...props}
            >
              {children}
            </a>
          );
        }

        return (
          <Link
            to={href ?? ""}
            className="text-brand underline underline-offset-2"
            {...props}
          >
            {children}
          </Link>
        );
      },

      // Headings with anchor links
      h2: ({ id, children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 id={id} className="group relative scroll-mt-20">
          <a
            href={`#${id}`}
            className="absolute -left-5 hidden text-gray-400 no-underline group-hover:inline-block"
            aria-hidden
          >
            #
          </a>
          {children}
        </h2>
      ),

      h3: ({ id, children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 id={id} className="group relative scroll-mt-20">
          <a
            href={`#${id}`}
            className="absolute -left-5 hidden text-gray-400 no-underline group-hover:inline-block"
            aria-hidden
          >
            #
          </a>
          {children}
        </h3>
      ),

      // Code blocks
      pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
          className="not-prose overflow-auto rounded-lg bg-gray-100 p-4"
          {...props}
        >
          {children}
        </pre>
      ),

      code: ({ children }: React.HTMLAttributes<HTMLElement>) => (
        <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">
          {children}
        </code>
      ),

      // Embeds
      YouTubeEmbed: ({ id, title }: { id: string; title?: string }) => (
        <YouTubeEmbed
          videoId={id}
          hasConsent={embedConsent.youtube ?? false}
          title={title}
        />
      ),

      TwitterEmbed: ({ id }: { id: string }) => (
        <TwitterEmbed tweetId={id} hasConsent={embedConsent.twitter ?? false} />
      ),

      InstagramEmbed: ({ id }: { id: string }) => (
        <InstagramEmbed
          postId={id}
          hasConsent={embedConsent.instagram ?? false}
        />
      ),

      RedditEmbed: ({ url }: { url: string }) => (
        <RedditEmbed postUrl={url} hasConsent={embedConsent.reddit ?? false} />
      ),
    }),
    [embedConsent],
  );
}
