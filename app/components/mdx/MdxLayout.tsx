import type { ReactNode } from "react";
import {
  TableOfContents,
  TableOfContentsDrawer,
  type TocHeading,
} from "~/components/mdx/TableOfContents";

export function MdxLayout({
  title,
  description,
  image,
  eyebrow = "Article",
  headings,
  children,
}: {
  title: string;
  description?: string;
  image?: string;
  eyebrow?: string;
  headings: TocHeading[];
  children: ReactNode;
}) {
  return (
    <article className="space-y-8">
      <header className="reveal space-y-4 border-b border-white/10 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          {eyebrow}
        </p>
        <h1 className="font-[var(--font-display)] text-[clamp(2.2rem,4vw,3.6rem)] font-semibold text-[color:var(--color-ink)]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-white/70">{description}</p>
        ) : null}
        <div className="pt-2 lg:hidden">
          <TableOfContentsDrawer headings={headings} />
        </div>
      </header>

      {image ? (
        <div className="reveal overflow-hidden rounded-[1rem] border border-white/10">
          <img src={image} alt={title} className="h-auto w-full" />
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="prose prose-base max-w-none font-sans prose-headings:font-[var(--font-display)] prose-headings:font-semibold prose-headings:text-[color:var(--color-ink)] prose-a:text-[color:var(--color-brand)] prose-strong:text-[color:var(--color-ink)] prose-p:text-white/75 prose-code:font-[var(--font-mono)] prose-code:text-white/80 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50">
          {children}
        </div>
        <div className="hidden lg:block">
          <TableOfContents headings={headings} />
        </div>
      </section>
    </article>
  );
}
