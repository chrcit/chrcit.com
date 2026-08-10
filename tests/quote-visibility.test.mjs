import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isQuoteVisible } from '../app/components/features/sanity/quote-visibility.ts';

const bookQuote = {
  text: 'A connected highlight',
  sourceItem: { _id: 'book-1', _type: 'thing', kind: 'book' },
};

test('an explicit page reference may render a standalone quote', () => {
  assert.equal(
    isQuoteVisible(
      { text: 'Editorially placed', sourceItem: null },
      { type: 'page-reference' }
    ),
    true
  );
});

test('automatic quote placement requires a connected book', () => {
  assert.equal(
    isQuoteVisible(bookQuote, { type: 'connected-book' }),
    true
  );
  assert.equal(
    isQuoteVisible(
      {
        text: 'Article highlight',
        sourceItem: { _id: 'article-1', _type: 'thing', kind: 'article' },
      },
      { type: 'connected-book' }
    ),
    false
  );
  assert.equal(
    isQuoteVisible(
      { text: 'Orphan highlight', sourceItem: null },
      { type: 'connected-book' }
    ),
    false
  );
});

test('a book page only renders quotes attached to that exact book', () => {
  assert.equal(
    isQuoteVisible(bookQuote, { type: 'book-page', bookId: 'book-1' }),
    true
  );
  assert.equal(
    isQuoteVisible(bookQuote, { type: 'book-page', bookId: 'book-2' }),
    false
  );
});

test('empty quote text is never visible', () => {
  assert.equal(
    isQuoteVisible(
      {
        text: '',
        sourceItem: { _id: 'book-1', _type: 'thing', kind: 'book' },
      },
      { type: 'connected-book' }
    ),
    false
  );
});
