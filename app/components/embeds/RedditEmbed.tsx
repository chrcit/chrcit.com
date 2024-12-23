import { useEffect, useRef } from "react";
import { EmbedOverlay } from "./EmbedOverlay";

interface RedditEmbedProps {
  postUrl: string;
  hasConsent: boolean;
}

declare global {
  interface Window {
    rembeddit?: {
      init: () => void;
    };
  }
}

export function RedditEmbed({ postUrl, hasConsent }: RedditEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasConsent) return;

    // Load Reddit embed script if not already loaded
    if (!window.rembeddit) {
      const script = document.createElement("script");
      script.src = "https://embed.reddit.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, initialize the embed
      window.rembeddit.init();
    }
  }, [hasConsent]);

  return (
    <EmbedOverlay
      type="reddit"
      title="Reddit Post"
      description="This content is hosted by Reddit. By loading this content, you agree to Reddit's privacy policy."
      hasConsent={hasConsent}
    >
      <div ref={containerRef} className="flex justify-center">
        <blockquote className="reddit-card">
          <a href={postUrl}>Loading Reddit post...</a>
        </blockquote>
      </div>
    </EmbedOverlay>
  );
}
