import type { ReactNode } from 'react';
import {
  PortableText,
  toPlainText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from '@portabletext/react';
import type {
  ComplexImage as ComplexImageSchema,
  HOMEPAGE_QUERYResult,
  PAGE_QUERYResult,
} from '@gen/sanity';
import { ComplexImage } from '@/components/features/sanity/complex-image';
import { ExternalLink } from '@/components/features/sanity/links/external-link';
import { InternalLink } from '@/components/features/sanity/links/internal-link';
import {
  ContentCollection,
  type CollectionValue,
  type ContentItem,
} from '@/components/features/sanity/content-collection';
import {
  QuoteReference,
  type QuoteValue,
} from '@/components/features/sanity/quote-reference';

type PageRichText = NonNullable<NonNullable<PAGE_QUERYResult>['richText']>;
type HomepageRichText = NonNullable<
  NonNullable<HOMEPAGE_QUERYResult>['richText']
>;
type BuilderBody = NonNullable<
  Extract<
    NonNullable<NonNullable<HOMEPAGE_QUERYResult>['components']>[number],
    { _type: 'richTextBlock' }
  >['richBody']
>;
export type RichTextValue = PageRichText | HomepageRichText | BuilderBody;
type Props = {
  value: RichTextValue | null | undefined;
  library?: ContentItem[] | null;
};
type ChildrenProps = { children?: ReactNode };
type MarkInternalLinkDeref = {
  _type: 'markInternalLink';
  _key?: string;
  link?: {
    _id: string;
    _type: 'page' | 'article' | 'project';
    slug: { current?: string | null } | null;
  } | null;
};
type MarkExternalLinkValue = {
  _type: 'markExternalLink';
  _key?: string;
  type?: 'url' | 'email' | 'phone' | 'file';
  url?: string;
  email?: string;
  phone?: string;
  fileUrl?: string;
};
type PopupValue = {
  _type: 'popupText';
  _key?: string;
  label?: string;
  text?: string;
};
type QuoteBlockValue = {
  _type: 'quoteBlock';
  _key?: string;
  quote?: QuoteValue | null;
  context?: string | null;
  showSource?: boolean | null;
  showCommentary?: boolean | null;
};

function headingId(value: Parameters<typeof toPlainText>[0]) {
  return toPlainText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function RichText({ value, library }: Props) {
  if (!value?.length) return null;
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value }) => (
        <h1
          id={headingId(value)}
          className="mt-12 text-4xl font-semibold tracking-[-0.045em] first:mt-0"
        >
          {children}
        </h1>
      ),
      h2: ({ children, value }) => (
        <h2
          id={headingId(value)}
          className="mt-12 text-3xl font-semibold tracking-[-0.04em] first:mt-0"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          id={headingId(value)}
          className="mt-9 text-xl font-semibold tracking-[-0.025em]"
        >
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className="my-5 leading-[1.75] text-foreground/85">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-brand my-8 border-l-2 pl-5 text-xl leading-relaxed">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: ChildrenProps) => (
        <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>
      ),
      number: ({ children }: ChildrenProps) => (
        <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>
      ),
    },
    marks: {
      markExternalLink: ({
        children,
        value,
      }: PortableTextMarkComponentProps<MarkExternalLinkValue>) => (
        <ExternalLink value={value ?? null}>{children}</ExternalLink>
      ),
      markInternalLink: ({
        children,
        value,
      }: PortableTextMarkComponentProps<MarkInternalLinkDeref>) => (
        <InternalLink value={value ?? null}>{children}</InternalLink>
      ),
      popupText: ({
        children,
        value,
      }: PortableTextMarkComponentProps<PopupValue>) => (
        <button
          type="button"
          className="group relative cursor-help border-b border-dotted border-current bg-transparent p-0 text-left font-inherit text-inherit"
          aria-describedby={`popup-${value?._key || 'note'}`}
          title={value?.label || 'Open note'}
        >
          {children}
          <span
            id={`popup-${value?._key || 'note'}`}
            role="tooltip"
            className="bg-foreground text-background invisible absolute bottom-[calc(100%+.5rem)] left-0 z-10 w-64 rounded-[var(--radius-site)] p-3 text-sm leading-relaxed opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100"
          >
            {value?.text}
          </span>
        </button>
      ),
      code: ({ children }: ChildrenProps) => (
        <code className="bg-muted rounded px-1.5 py-0.5 text-[0.9em]">
          {children}
        </code>
      ),
    },
    types: {
      complexImage: ({
        value,
      }: PortableTextTypeComponentProps<
        ComplexImageSchema & { _key?: string }
      >) => <ComplexImage value={value} />,
      separator: () => <hr className="border-border my-10" />,
      referenceCollection: ({
        value,
      }: PortableTextTypeComponentProps<CollectionValue>) => (
        <div className="not-prose -mx-[min(4vw,2rem)]">
          <ContentCollection value={value} library={library} />
        </div>
      ),
      quoteBlock: ({
        value,
      }: PortableTextTypeComponentProps<QuoteBlockValue>) => (
        <QuoteReference
          quote={value.quote}
          context={value.context}
          showSource={value.showSource}
          showCommentary={value.showCommentary}
        />
      ),
    },
  };
  return <PortableText value={value} components={components} />;
}
