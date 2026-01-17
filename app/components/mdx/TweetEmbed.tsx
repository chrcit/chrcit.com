import { useEffect, useRef } from "react";
import { EmbedConsent } from "~/components/consent/EmbedConsent";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: Element) => void;
      };
    };
  }
}

export function TweetEmbed({ id }: { id: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const url = id.startsWith("http")
    ? id
    : `https://x.com/i/web/status/${id}`;

  useEffect(() => {
    if (!containerRef.current) return;
    const existingScript = document.getElementById("twitter-wjs");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "twitter-wjs";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.defer = true;
      script.onload = () => window.twttr?.widgets.load(containerRef.current ?? undefined);
      document.body.appendChild(script);
      return;
    }
    window.twttr?.widgets.load(containerRef.current);
  }, [url]);

  return (
    <EmbedConsent
      title="Tweet"
      description="This embed loads a tweet from X and may set cookies."
      category="experience"
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/40 p-4"
      >
        <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
          <a href={url}>View on X</a>
        </blockquote>
      </div>
    </EmbedConsent>
  );
}
