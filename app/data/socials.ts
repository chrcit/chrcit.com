export type SocialType =
  | "twitter"
  | "github"
  | "youtube"
  | "instagram"
  | "linkedin";

export const socials = {
  twitter: "https://twitter.com/chrcit",
  github: "https://github.com/chrcit",
  youtube: "https://www.youtube.com/@chrcit",
  instagram: "https://instagram.com/chrcit",
  linkedin: "https://linkedin.com/in/chrcit",
} as const;

export const socialLinks: {
  type: SocialType;
  href: string;
}[] = [
  { type: "twitter", href: socials.twitter },
  { type: "github", href: socials.github },
  { type: "youtube", href: socials.youtube },
  { type: "instagram", href: socials.instagram },
  { type: "linkedin", href: socials.linkedin },
];
