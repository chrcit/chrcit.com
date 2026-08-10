import type { ReactNode } from 'react';

type Heading = { id: string; title: string; level: 2 | 3 };

function idFor(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function collect(value: unknown, headings: Heading[]) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, headings);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const object = value as Record<string, unknown>;
  if (
    (object._type === 'referenceCollection' ||
      object._type === 'newsletterBlock' ||
      object._type === 'linkListBlock') &&
    typeof (object.title || object.heading) === 'string'
  ) {
    const title = String(object.title || object.heading);
    headings.push({ id: idFor(title), title, level: 2 });
  }
  if (
    object._type === 'block' &&
    (object.style === 'h2' || object.style === 'h3') &&
    Array.isArray(object.children)
  ) {
    const title = object.children
      .map((child) =>
        typeof child === 'object' && child && 'text' in child
          ? String((child as { text?: unknown }).text || '')
          : ''
      )
      .join('');
    const id = idFor(title);
    if (title)
      headings.push({ id, title, level: object.style === 'h2' ? 2 : 3 });
  }
  for (const [key, child] of Object.entries(object)) {
    const isPortableTextField =
      key === 'richText' ||
      key === 'richBody' ||
      (key === 'body' && !('richBody' in object));
    if (isPortableTextField) collect(child, headings);
  }
}

export function TableOfContents({ content }: { content: unknown }): ReactNode {
  const headings: Heading[] = [];
  collect(content, headings);
  if (headings.length < 2) return null;
  return (
    <nav
      aria-label="On this page"
      className="border-border mx-auto mb-10 max-w-[var(--reading-width)] border-y py-4"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
        On this page
      </p>
      <ol className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li className={heading.level === 3 ? 'pl-4' : ''} key={heading.id}>
            <a
              className="text-foreground/65 hover:text-foreground"
              href={`#${heading.id}`}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
