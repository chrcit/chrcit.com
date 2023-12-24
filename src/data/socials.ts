export type SocialType = keyof typeof socials;

export const socials = {
  linkedin: "https://www.linkedin.com/in/christian-cito-9b72a117b/",
  twitter: "https://twitter.com/chrcit",
  github: "https://github.com/chrcit",
  email: "citochris@gmail.com",
  instagram: "https://instagram.com/chrcit",
  twitch: "https://twitch.tv/chrcit",
  youtube: "https://youtube.com/@chrcit",
} as const;
