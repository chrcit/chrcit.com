import { useEffect, useRef } from "react";
import { EmbedOverlay } from "./EmbedOverlay";

interface TwitterEmbedProps {
  tweetId: string;
  hasConsent: boolean;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export function TwitterEmbed({ tweetId, hasConsent }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasConsent) return;

    // Load Twitter widget script if not already loaded
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, render the tweet
      window.twttr.widgets.load(containerRef.current);
    }
  }, [hasConsent]);

  return (
    <EmbedOverlay
      type="twitter"
      title="Twitter Post"
      description="This content is hosted by Twitter. By loading this content, you agree to Twitter's privacy policy."
      hasConsent={hasConsent}
    >
      <div ref={containerRef} className="flex justify-center">
        <blockquote
          className="twitter-tweet"
          data-conversation="none"
          data-theme="light"
          data-lang="en"
        >
          <a href={`https://twitter.com/x/status/${tweetId}`}>
            Loading tweet...
          </a>
        </blockquote>
      </div>
    </EmbedOverlay>
  );
}
