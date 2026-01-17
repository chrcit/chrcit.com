import type { ComponentProps } from "react";
import { Link } from "react-router";
import { ExternalLink } from "~/components/mdx/ExternalLink";
import { YouTubeEmbed } from "~/components/mdx/YouTubeEmbed";
import { TweetEmbed } from "~/components/mdx/TweetEmbed";
import { AndererseitsInstagram, InstagramEmbed } from "~/components/mdx/InstagramEmbed";

type MdxComponentsArgs = {
  assetRoot: string;
  assetBaseDir: string;
};

function resolveAssetUrl(
  src: string | undefined,
  assetRoot: string,
  assetBaseDir: string,
) {
  if (!src) return src;
  if (src.startsWith("http")) return src;
  const resolved = new URL(
    src,
    `https://content.local/${assetBaseDir}/`,
  ).pathname.replace(/^\//, "");
  return `${assetRoot}/${resolved}`.replace(/\/+/g, "/");
}

function MdxLink({ href, ...props }: ComponentProps<"a">) {
  if (!href) {
    return <a {...props} />;
  }

  if (href.startsWith("#")) {
    return <a href={href} {...props} />;
  }

  if (href.startsWith("/")) {
    return <Link to={href} {...props} />;
  }

  if (href.startsWith("./") || href.startsWith("../")) {
    return <a href={href} {...props} />;
  }

  return <ExternalLink href={href} {...props} />;
}

export function createMdxComponents({ assetRoot, assetBaseDir }: MdxComponentsArgs) {
  return {
    a: MdxLink,
    img: (props: ComponentProps<"img">) => (
      <img
        {...props}
        src={resolveAssetUrl(props.src, assetRoot, assetBaseDir)}
        className={`w-full rounded-[1.25rem] border border-white/10 shadow-[var(--shadow-soft)] ${
          props.className ?? ""
        }`}
        loading="lazy"
      />
    ),
    script: () => null,
    ExternalLink,
    Tweet: TweetEmbed,
    YouTube: YouTubeEmbed,
    InstagramEmbed,
    AndererseitsInstagram,
  };
}
