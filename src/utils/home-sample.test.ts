import assert from "node:assert/strict";
import { test } from "node:test";
import { BOOK_SAMPLE_SIZE, pickItems, shuffle } from "./home-sample.ts";

const books = ["a", "b", "c", "d", "e", "f", "g"];

test("pickItems returns n unique items", () => {
  const picked = pickItems(books, BOOK_SAMPLE_SIZE, () => 0);
  assert.equal(picked.length, BOOK_SAMPLE_SIZE);
  assert.equal(new Set(picked).size, BOOK_SAMPLE_SIZE);
  assert.equal(picked.every((id) => books.includes(id)), true);
});

test("pickItems returns the whole list when n is larger", () => {
  assert.deepEqual(new Set(pickItems(books, 99, () => 0)), new Set(books));
});

test("pickItems returns nothing for an empty pool or a zero count", () => {
  assert.deepEqual(pickItems(books, 0), []);
  assert.deepEqual(pickItems([], 6), []);
});

test("shuffle with a cycling rng is a permutation", () => {
  let i = 0;
  const shuffled = shuffle(books, () => {
    const values = [0, 0.99, 0.25, 0.5];
    return values[i++ % values.length]!;
  });
  assert.equal(shuffled.length, books.length);
  assert.deepEqual(new Set(shuffled), new Set(books));
  assert.notDeepEqual(shuffled, books);
});
