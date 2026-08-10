export type QuotePlacement =
  | { type: 'page-reference' }
  | { type: 'connected-book' }
  | { type: 'book-page'; bookId: string };

export type QuoteVisibilityValue = {
  text?: string | null;
  sourceItem?: {
    _id?: string | null;
    _type?: string | null;
    kind?: string | null;
  } | null;
};

function connectedBookId(quote?: QuoteVisibilityValue | null) {
  const source = quote?.sourceItem;
  return source?._type === 'thing' && source.kind === 'book'
    ? source._id || null
    : null;
}

export function isQuoteVisible(
  quote: QuoteVisibilityValue | null | undefined,
  placement: QuotePlacement
) {
  if (!quote?.text) return false;
  if (placement.type === 'page-reference') return true;

  const bookId = connectedBookId(quote);
  if (placement.type === 'connected-book') return Boolean(bookId);
  return Boolean(bookId && bookId === placement.bookId);
}
