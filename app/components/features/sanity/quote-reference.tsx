import { toPlainText } from '@portabletext/react';
import {
  isQuoteVisible,
  type QuotePlacement,
} from '@/components/features/sanity/quote-visibility';

export type QuoteValue = {
  _id?: string | null;
  text?: string | null;
  attribution?: string | null;
  location?: string | null;
  locationType?: string | null;
  sourceUrl?: string | null;
  commentary?: Parameters<typeof toPlainText>[0] | null;
  sourceItem?: {
    _id?: string | null;
    _type?: string | null;
    kind?: string | null;
    title?: string | null;
    creator?: string | null;
    url?: string | null;
  } | null;
};

export function QuoteReference({
  quote,
  placement,
  context,
  showSource = true,
  showCommentary = false,
}: {
  quote?: QuoteValue | null;
  placement: QuotePlacement;
  context?: string | null;
  showSource?: boolean | null;
  showCommentary?: boolean | null;
}) {
  if (!quote?.text || !isQuoteVisible(quote, placement)) return null;
  const sourceTitle = quote.sourceItem?.title || quote.attribution;
  const sourceUrl = quote.sourceItem?.url || quote.sourceUrl;
  const location = quote.location
    ? `${quote.locationType || 'location'} ${quote.location}`
    : null;
  const commentaryText = quote.commentary ? toPlainText(quote.commentary) : '';

  return (
    <figure className="border-border my-10 border-y py-7">
      <blockquote className="max-w-3xl text-[clamp(1.35rem,3vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.025em]">
        “{quote.text}”
      </blockquote>
      {showSource && (sourceTitle || quote.sourceItem?.creator || location) ? (
        <figcaption className="text-foreground/60 mt-5 text-sm">
          {sourceUrl ? (
            <a
              className="hover:text-foreground underline decoration-current/30 underline-offset-4"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {sourceTitle || 'Source'}
            </a>
          ) : (
            <span>{sourceTitle}</span>
          )}
          {quote.sourceItem?.creator ? (
            <span> · {quote.sourceItem.creator}</span>
          ) : null}
          {location ? <span> · {location}</span> : null}
        </figcaption>
      ) : null}
      {context ? (
        <p className="text-foreground/72 mt-5 max-w-2xl text-sm leading-relaxed">
          {context}
        </p>
      ) : null}
      {showCommentary && commentaryText ? (
        <p className="text-foreground/72 mt-5 max-w-2xl text-sm leading-relaxed">
          {commentaryText}
        </p>
      ) : null}
    </figure>
  );
}
