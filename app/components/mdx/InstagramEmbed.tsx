import { EmbedConsent } from "~/components/consent/EmbedConsent";

export function InstagramEmbed({ url }: { url: string }) {
  const cleanUrl = url.split("?")[0];
  const embedUrl = `${cleanUrl}embed`;

  return (
    <EmbedConsent
      title="Instagram post"
      description="This embed loads a post from Instagram and may set cookies."
      category="experience"
    >
      <div className="w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/40">
        <iframe
          title="Instagram embed"
          src={embedUrl}
          className="h-[520px] w-full"
          loading="lazy"
        />
      </div>
    </EmbedConsent>
  );
}

export function AndererseitsInstagram() {
  return (
    <InstagramEmbed url="https://www.instagram.com/p/C1cZlHJs7s0/" />
  );
}
