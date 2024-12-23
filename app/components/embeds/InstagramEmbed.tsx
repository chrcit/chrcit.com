import { useEffect, useRef } from "react";
import { EmbedOverlay } from "./EmbedOverlay";

interface InstagramEmbedProps {
  postId: string;
  hasConsent: boolean;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export function InstagramEmbed({ postId, hasConsent }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasConsent) return;

    // Load Instagram embed script if not already loaded
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, process the embed
      window.instgrm.Embeds.process();
    }
  }, [hasConsent]);

  return (
    <EmbedOverlay
      type="instagram"
      title="Instagram Post"
      description="This content is hosted by Instagram. By loading this content, you agree to Instagram's privacy policy."
      hasConsent={hasConsent}
    >
      <div ref={containerRef} className="flex justify-center">
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            boxShadow:
              "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        >
          <div style={{ padding: "16px" }}>
            <a
              href={`https://www.instagram.com/p/${postId}/`}
              style={{
                background: "#FFFFFF",
                lineHeight: 0,
                padding: "0 0",
                textAlign: "center",
                textDecoration: "none",
                width: "100%",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Loading Instagram post...
            </a>
          </div>
        </blockquote>
      </div>
    </EmbedOverlay>
  );
}
