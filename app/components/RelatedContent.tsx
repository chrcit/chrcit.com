import { Link } from "@remix-run/react";

interface RelatedContentItem {
  title: string;
  description: string;
  slug: string;
  type: "article" | "book" | "project";
  tags: string[];
}

interface RelatedContentProps {
  items: RelatedContentItem[];
  title?: string;
}

export function RelatedContent({
  items,
  title = "Related Content",
}: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.type}-${item.slug}`}>
            <Link
              to={`/${item.type}s/${item.slug}`}
              className="group block h-full space-y-2 rounded-lg border border-gray-200 p-4 no-underline transition-all hover:border-brand"
            >
              <div className="flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
