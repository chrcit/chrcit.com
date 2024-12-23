import { EmbedOverlay } from "./EmbedOverlay";

interface YouTubeEmbedProps {
  videoId: string;
  hasConsent: boolean;
  title?: string;
}

export function YouTubeEmbed({
  videoId,
  hasConsent,
  title,
}: YouTubeEmbedProps) {
  return (
    <EmbedOverlay
      type="youtube"
      title="YouTube Video"
      description="This content is hosted by YouTube. By loading this content, you agree to YouTube's privacy policy."
      hasConsent={hasConsent}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title ?? "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute left-0 top-0 h-full w-full border-0"
        />
      </div>
    </EmbedOverlay>
  );
}
