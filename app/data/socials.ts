export const socials = {
  email: "mailto:citochris@gmail.com",
  github: "https://github.com/chrcit",
  instagram: "https://instagram.com/chrcit",
  linkedin: "https://www.linkedin.com/in/christian-cito-9b72a117b/",
  twitter: "https://twitter.com/chrcit",
  twitch: "https://twitch.tv/chrcit",
  youtube: "https://youtube.com/@chrcit",
} as const;

export type SocialKey = keyof typeof socials;
