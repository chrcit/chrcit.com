import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { HOMEPAGE_QUERYResult } from '@gen/sanity';
import { stegaClean } from '@sanity/client/stega';
import { toPlainText } from '@portabletext/react';
import { ComplexImage } from '@/components/features/sanity/complex-image';
import { QuoteReference } from '@/components/features/sanity/quote-reference';

export type CollectionValue = NonNullable<
  NonNullable<HOMEPAGE_QUERYResult>['components']
>[number] & { _type: 'referenceCollection' };
export type ContentItem =
  | NonNullable<NonNullable<HOMEPAGE_QUERYResult>['library']>[number]
  | NonNullable<CollectionValue['items']>[number];

function hrefFor(item: ContentItem) {
  if (item._type === 'quote') return undefined;
  const slug = stegaClean(item.slug?.current || '');
  if (item._type === 'project' && slug) return `/projects/${slug}`;
  if (item._type === 'article' && slug) return `/writing/${slug}`;
  return stegaClean(item.url || item.externalUrl || '') || undefined;
}

function filterItems(value: CollectionValue, library: ContentItem[]) {
  const source = stegaClean(value.source || 'manual');
  const selected = (source === 'filter' ? library : (value.items ?? [])).filter(
    Boolean
  );
  const filter = value.filter;
  const contentTypes = (filter?.contentTypes ?? []).map((type) =>
    stegaClean(type)
  );
  const filterKinds = (filter?.kinds ?? []).map((kind) => stegaClean(kind));
  const topicIds = new Set((filter?.topics ?? []).map((topic) => topic._id));
  let items = selected.filter((item) => {
    if (source !== 'filter') return true;
    if (contentTypes.length && !contentTypes.includes(item._type)) return false;
    const itemKind = stegaClean(item.kind || '');
    if (filterKinds.length && (!itemKind || !filterKinds.includes(itemKind)))
      return false;
    if (
      topicIds.size &&
      !(item.topics ?? []).some((topic) => topicIds.has(topic._id))
    )
      return false;
    if (filter?.featuredOnly && !item.featured) return false;
    if (
      !filter?.includeHistorical &&
      item._type === 'project' &&
      item.historical
    )
      return false;
    return true;
  });
  const order = stegaClean(filter?.order || 'manual');
  if (order === 'title')
    items = [...items].sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );
  if (order === 'newest')
    items = [...items].sort((a, b) =>
      String(
        b.publishedAt || b.readwise?.highlightedAt || b.year || ''
      ).localeCompare(
        String(a.publishedAt || a.readwise?.highlightedAt || a.year || '')
      )
    );
  if (order === 'manual')
    items = [...items].sort(
      (a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999)
    );
  return items.slice(0, filter?.limit ?? 100);
}

function Item({
  item,
  showNotes,
  presentation,
}: {
  item: ContentItem;
  showNotes?: boolean | null;
  presentation: string;
}) {
  if (item._type === 'quote') {
    return (
      <QuoteReference
        quote={item}
        placement={{ type: 'page-reference' }}
        showSource
        showCommentary={showNotes}
      />
    );
  }
  const href = hrefFor(item);
  const external = href?.startsWith('http');
  const title = item.title || 'Untitled';
  const kind = stegaClean(item.kind || item._type);
  const details = (
    <>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-foreground/55 mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            {kind}
            {item.year ? ` · ${item.year}` : ''}
          </p>
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          {item.creator ? (
            <p className="text-foreground/65 mt-1 text-sm">{item.creator}</p>
          ) : null}
        </div>
        {href ? (
          <span aria-hidden className="text-brand text-lg">
            ↗
          </span>
        ) : null}
      </div>
      {item.summary || item.excerpt ? (
        <p className="text-foreground/72 mt-4 max-w-prose text-sm leading-relaxed">
          {item.summary || item.excerpt}
        </p>
      ) : null}
      {showNotes && item.notes?.length ? (
        <p className="text-foreground/70 mt-4 text-sm leading-relaxed">
          {toPlainText(item.notes)}
        </p>
      ) : null}
    </>
  );
  const artwork = item.image || item.cover;
  const remoteCover = item.readwise?.coverImageUrl;
  const content =
    presentation === 'mediaList' ? (
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-7">
        <div className="bg-muted aspect-[2/3] overflow-hidden rounded-[var(--radius-site)]">
          {artwork ? (
            <ComplexImage
              value={artwork}
              widths={[144, 240, 360]}
              sizes="(min-width: 640px) 6rem, 4.5rem"
              className="h-full w-full"
              figureClassName="h-full"
              imgClassName="h-full w-full object-cover"
            />
          ) : remoteCover ? (
            <img
              src={remoteCover}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-end p-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-foreground/35">
              No cover
            </div>
          )}
        </div>
        <div className="min-w-0 self-center">{details}</div>
      </div>
    ) : (
      details
    );
  const classes =
    presentation === 'mediaList'
      ? 'border-border bg-background hover:border-foreground/60 hover:bg-muted/50 block rounded-[var(--radius-site)] border p-4 transition-colors sm:p-5'
      : 'border-border hover:border-foreground/60 block border-t py-5 transition-colors';
  if (!href) return <article className={classes}>{content}</article>;
  if (external)
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  return (
    <Link className={classes} to={href}>
      {content}
    </Link>
  );
}

export function ContentCollection({
  value,
  library = [],
}: {
  value: CollectionValue;
  library?: ContentItem[] | null;
}) {
  const items = useMemo(
    () => filterItems(value, library || []),
    [value, library]
  );
  const kinds = [
    ...new Set(items.map((item) => stegaClean(item.kind || item._type))),
  ];
  const [activeKind, setActiveKind] = useState('all');
  const visible =
    activeKind === 'all'
      ? items
      : items.filter(
          (item) => stegaClean(item.kind || item._type) === activeKind
        );
  const presentation = stegaClean(value.presentation || 'list');
  const headingId = stegaClean(value.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <section className="py-10">
      {value.title || value.introduction ? (
        <header className="mb-7 max-w-2xl">
          {value.title ? (
            <h2
              id={headingId || undefined}
              className="text-3xl font-semibold tracking-[-0.035em]"
            >
              {value.title}
            </h2>
          ) : null}
          {value.introduction ? (
            <p className="text-foreground/70 mt-3 leading-relaxed">
              {value.introduction}
            </p>
          ) : null}
        </header>
      ) : null}
      {presentation === 'filterList' &&
      value.showFilters !== false &&
      kinds.length > 1 ? (
        <fieldset className="mb-6 flex flex-wrap gap-2">
          <legend className="sr-only">Filter items</legend>
          {['all', ...kinds].map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setActiveKind(kind)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize ${activeKind === kind ? 'border-foreground bg-foreground text-background' : 'border-border'}`}
            >
              {kind}
            </button>
          ))}
        </fieldset>
      ) : null}
      {visible.length ? (
        <div
          className={
            presentation === 'grid'
              ? 'grid gap-x-8 md:grid-cols-2'
              : presentation === 'mediaList'
                ? 'grid gap-3 md:grid-cols-2'
                : presentation === 'carousel'
                  ? 'flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4'
                  : ''
          }
        >
          {visible.map((item) => (
            <div
              key={item._id}
              className={
                presentation === 'carousel'
                  ? 'w-[82vw] max-w-md shrink-0 snap-start'
                  : ''
              }
            >
              <Item
                item={item}
                showNotes={value.showNotes}
                presentation={presentation}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground/55 border-border border-t py-5 text-sm">
          No matching items yet.
        </p>
      )}
    </section>
  );
}
