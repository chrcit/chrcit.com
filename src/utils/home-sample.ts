export const BOOK_SAMPLE_SIZE = 6;
export const TOOL_SAMPLE_SIZE = 8;
export const HOME_CACHE_CONTROL = "public, max-age=300, s-maxage=300";

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const swap = next[i];
    next[i] = next[j]!;
    next[j] = swap!;
  }
  return next;
}

export function pickItems<T>(items: T[], n: number, random: () => number = Math.random): T[] {
  if (n <= 0 || items.length === 0) return [];
  return shuffle(items, random).slice(0, Math.min(n, items.length));
}
