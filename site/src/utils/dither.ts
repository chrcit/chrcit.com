const variants = ["dt-4", "dt-3", "dt-5 inv", "dt-2"];

// Stable dither fallback per item so thumbs don't reshuffle between builds.
export function ditherFor(key: string): string {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return variants[h % variants.length];
}
