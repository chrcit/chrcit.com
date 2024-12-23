export type ActiveTabType = "home" | "articles" | "projects" | "books";

export const navigationLinks = [
  {
    name: "Articles",
    href: "/articles",
    activeTab: "articles" as const,
  },
  {
    name: "Projects",
    href: "/projects",
    activeTab: "projects" as const,
  },
  {
    name: "Books",
    href: "/books",
    activeTab: "books" as const,
  },
];
