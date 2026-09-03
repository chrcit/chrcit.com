import { getCollection } from "astro:content";
import { getImage } from "astro:assets";
import type { SampleItem } from "../components/SampleList";

const groupLabel: Record<string, string> = {
  Gear: "Gear",
  Stack: "Tech Stack",
  "Dev Tools": "Dev Tools",
  Productivity: "Productivity",
};

const srcOf = (image: { src: string } | undefined) => image?.src ?? null;

export async function loadHomeItems(optimize = true): Promise<{
  books: SampleItem[];
  tools: SampleItem[];
}> {
  const items = await getCollection("items");

  const books: SampleItem[] = await Promise.all(
    items
      .filter((item) => item.data.category === "book")
      .map(async (item) => {
        const img =
          optimize && item.data.cover
            ? await getImage({ src: item.data.cover, width: 240, height: 360 })
            : null;
        return {
          id: item.id,
          title: item.data.title,
          meta: [item.data.author, item.data.year].filter(Boolean).join(", "),
          url: `/${item.id}`,
          image: img?.src ?? srcOf(item.data.cover),
          kind: "book" as const,
        };
      }),
  );

  const tools: SampleItem[] = await Promise.all(
    items
      .filter((item) => item.data.category === "tool")
      .map(async (item) => {
        const img =
          optimize && item.data.icon
            ? await getImage({ src: item.data.icon, width: 160, height: 160 })
            : null;
        return {
          id: item.id,
          title: item.data.title,
          meta: item.data.group ? (groupLabel[item.data.group] ?? item.data.group) : undefined,
          url: `/uses/${item.id.replace(/^tools\//, "")}`,
          image: img?.src ?? srcOf(item.data.icon),
          kind: "tool" as const,
        };
      }),
  );

  return { books, tools };
}
