import { socialLinks } from "~/data/socials";
import { SocialIcon } from "./SocialIcon";
import clsx from "clsx";

interface SocialLinksProps {
  size?: number;
  className?: string;
}

export function SocialLinks({ size = 16, className }: SocialLinksProps) {
  return (
    <ul
      className={clsx(
        "not-prose flex flex-row flex-wrap items-center gap-1",
        className ?? "justify-center",
      )}
    >
      {socialLinks.map((link) => (
        <li key={link.type} className="p-2">
          <a
            className="cursor-pointer"
            href={link.href}
            title={`Link to my ${link.type}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon size={size} type={link.type} />
          </a>
        </li>
      ))}
    </ul>
  );
}
