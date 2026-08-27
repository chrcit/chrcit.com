// One high-contrast dither for letter fallbacks so the initial stays readable.
export function ditherFor(_key: string): string {
  return "is-fallback";
}
