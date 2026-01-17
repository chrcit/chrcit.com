import { EmbedConsent } from "~/components/consent/EmbedConsent";

export function YouTubeEmbed({ id }: { id: string }) {
  const videoId = id.includes("watch?v=")
    ? new URL(id).searchParams.get("v") ?? id
    : id;
  const url = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <EmbedConsent
      title="YouTube video"
      description="This embed loads a video from YouTube and may set cookies."
      category="experience"
    >
      <div className="aspect-video w-full overflow-hidden rounded-[1.25rem] border border-white/10">
        <iframe
          src={url}
          title="YouTube video"
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </EmbedConsent>
  );
}
