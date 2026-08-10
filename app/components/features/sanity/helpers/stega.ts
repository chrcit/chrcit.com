import { stegaClean } from '@sanity/client/stega';

/**
 * Stega (Visual Editing) can append invisible characters to strings in preview mode.
 * Use these helpers for any value that participates in routing, comparisons, or URLs.
 */
export function cleanString(
  value: string | null | undefined
): string | undefined {
  if (!value) return undefined;
  return stegaClean(value);
}
