import { studioLocale } from '@/sanity/i18n/config';
import type { StudioLabels } from '@/sanity/i18n/labels/schema';
import { en } from '@/sanity/i18n/labels/en';
import { de } from '@/sanity/i18n/labels/de';

const locales: Record<string, StudioLabels> = {
  en,
  de,
};

/**
 * The active labels based on the configured studio locale.
 * Change `studioLocale` in `app/sanity/i18n/config.ts` to switch languages.
 */
export const labels: StudioLabels = locales[studioLocale] ?? en;

// Re-export for convenience
export type {
  StudioLabels,
  DocumentLabels,
  ObjectLabels,
  CommonLabels,
  ValidationLabels,
} from '@/sanity/i18n/labels/schema';
export { en } from '@/sanity/i18n/labels/en';
export { de } from '@/sanity/i18n/labels/de';
