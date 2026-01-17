import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-react";
import { socials, type SocialKey } from "~/data/socials";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const labels: Record<SocialKey, string> = {
  email: "Email",
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  twitch: "Twitch",
  youtube: "YouTube",
};

const icons: Record<SocialKey, React.ReactNode> = {
  email: <Mail className="h-4 w-4" aria-hidden="true" />,
  github: <Github className="h-4 w-4" aria-hidden="true" />,
  instagram: <Instagram className="h-4 w-4" aria-hidden="true" />,
  linkedin: <Linkedin className="h-4 w-4" aria-hidden="true" />,
  twitter: <Twitter className="h-4 w-4" aria-hidden="true" />,
  twitch: <Twitch className="h-4 w-4" aria-hidden="true" />,
  youtube: <Youtube className="h-4 w-4" aria-hidden="true" />,
};

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <TooltipProvider>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {(Object.keys(socials) as SocialKey[]).map((key) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <a
                href={socials[key]}
                aria-label={labels[key]}
                className="pressable inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                rel={key === "email" ? undefined : "noreferrer"}
                target={key === "email" ? undefined : "_blank"}
              >
                {icons[key]}
                <span className="sr-only">{labels[key]}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>{labels[key]}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
