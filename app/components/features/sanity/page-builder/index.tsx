import type { HOMEPAGE_QUERYResult } from '@gen/sanity';
import { Link } from 'react-router';
import { RichText } from '@/components/features/sanity/rich-text';
import { ComplexImage } from '@/components/features/sanity/complex-image';
import {
  ContentCollection,
  type CollectionValue,
  type ContentItem,
} from '@/components/features/sanity/content-collection';
import { NewsletterForm } from '@/components/features/newsletter-form';
import { cleanString } from '@/components/features/sanity/helpers/stega';
import { resolveHref } from '@/components/features/sanity/helpers/resolve-href';

type PageComponents = NonNullable<
  NonNullable<HOMEPAGE_QUERYResult>['components']
>;
export type PageBuilderValue = PageComponents;

type Props = {
  value: PageBuilderValue | null | undefined;
  library?: ContentItem[] | null;
  newsletterPrivacyNote?: string | null;
};

type BuilderLink = NonNullable<
  Extract<PageComponents[number], { _type: 'heroBlock' }>['links']
>[number];

function hrefForLink(link: BuilderLink) {
  const type = cleanString(link.type);
  if (type === 'internal') return resolveHref(link.reference) ?? undefined;
  if (type === 'external')
    return (
      cleanString(link.externalLink?.url) ||
      (cleanString(link.externalLink?.email)
        ? `mailto:${cleanString(link.externalLink?.email)}`
        : cleanString(link.externalLink?.phone)
          ? `tel:${cleanString(link.externalLink?.phone)}`
          : cleanString(link.externalLink?.fileUrl))
    );
}

function Links({ links }: { links?: BuilderLink[] | null }) {
  if (!links?.length) return null;
  return (
    <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
      {links.map((link, index) => {
        const href = hrefForLink(link);
        if (!href) return null;
        const className =
          'border-foreground hover:border-brand inline-flex border-b pb-0.5 text-sm font-semibold transition-colors';
        return href.startsWith('/') ? (
          <Link className={className} to={href} key={`${href}-${index}`}>
            {link.title}
          </Link>
        ) : (
          <a
            className={className}
            href={href}
            key={`${href}-${index}`}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {link.title}
          </a>
        );
      })}
    </div>
  );
}

export function PageBuilder({ value, library, newsletterPrivacyNote }: Props) {
  if (!value?.length) return null;
  return (
    <div>
      {value.map((section, idx) => {
        const key = section._key || `${section._type}-${idx}`;
        switch (section._type) {
          case 'heroBlock':
            return (
              <section
                key={key}
                className="grid min-h-[58dvh] content-center gap-8 py-14 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,.65fr)] md:items-center"
              >
                <div>
                  {section.eyebrow ? (
                    <p className="text-brand mb-5 text-xs font-semibold uppercase tracking-[0.18em]">
                      {section.eyebrow}
                    </p>
                  ) : null}
                  <h1 className="max-w-4xl text-[clamp(3rem,8vw,7.8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
                    {section.heading}
                  </h1>
                  <div className="mt-7 max-w-2xl text-lg">
                    <RichText value={section.richBody} library={library} />
                  </div>
                  <Links links={section.links} />
                </div>
                {section.image ? (
                  <ComplexImage
                    value={section.image}
                    sizes="(min-width: 768px) 34vw, 100vw"
                    widths={[480, 800, 1200]}
                    className="max-h-[30rem]"
                    imgClassName="h-full w-full object-cover"
                  />
                ) : (
                  <aside className="border-border self-end border-t pt-4 text-sm text-foreground/60">
                    <span className="text-brand mr-2">●</span>Design, software,
                    civic systems, and whatever seems worth following.
                  </aside>
                )}
              </section>
            );
          case 'richTextBlock':
            return (
              <section
                key={key}
                className="mx-auto max-w-[var(--reading-width)] py-10"
              >
                <RichText value={section.richBody} library={library} />
              </section>
            );
          case 'referenceCollection':
            return (
              <ContentCollection
                key={key}
                value={section as CollectionValue}
                library={library}
              />
            );
          case 'newsletterBlock':
            return (
              <NewsletterForm
                key={key}
                heading={section.heading}
                body={section.body}
                buttonLabel={section.buttonLabel}
                successMessage={section.successMessage}
                groupId={section.groupId}
                privacyNote={newsletterPrivacyNote}
              />
            );
          case 'linkListBlock':
            return (
              <section key={key} className="py-10">
                <div className="mb-6 max-w-2xl">
                  {section.title ? (
                    <h2
                      id={(cleanString(section.title) ?? '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')}
                      className="text-3xl font-semibold tracking-[-0.035em]"
                    >
                      {section.title}
                    </h2>
                  ) : null}
                  {section.body ? (
                    <p className="text-foreground/70 mt-3">{section.body}</p>
                  ) : null}
                </div>
                <Links links={section.links} />
              </section>
            );
          case 'complexImage':
            return (
              <div key={key} className="py-8">
                <ComplexImage
                  value={section}
                  sizes="(min-width: 1200px) 72rem, 100vw"
                  widths={[640, 960, 1440, 1920]}
                />
              </div>
            );
          case 'separator':
            return <hr key={key} className="border-border my-8" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
