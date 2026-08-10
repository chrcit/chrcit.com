import { cleanString } from '@/components/features/sanity/helpers/stega';

type PageLike = {
  _id?: string | null;
  _ref?: string | null;
  _type?: string | null;
  slug?: { current?: string | null } | null;
};

const SETTINGS_IDS = new Set([
  'siteSettings',
  'themeSettings',
  'header',
  'footer',
]);

/**
 * Single source of truth for resolving Sanity references → site URLs.
 * Homepage is a `page` document with fixed `_id="homepage"`.
 */
export function resolveHref(
  reference: PageLike | null | undefined
): string | null {
  if (!reference) return null;
  const id =
    cleanString(reference._id) ??
    cleanString(reference._ref) ??
    reference._id ??
    reference._ref ??
    undefined;
  const type = cleanString(reference._type) ?? reference._type ?? undefined;

  // Route all singleton settings documents to the homepage.
  if (
    id === 'homepage' ||
    SETTINGS_IDS.has(id ?? '') ||
    SETTINGS_IDS.has(type ?? '')
  ) {
    return '/';
  }

  const slug = cleanString(reference.slug?.current);
  if (!slug) return null;

  if (type === 'project') return `/projects/${slug}`;
  if (type === 'article') return `/writing/${slug}`;
  return `/${slug}`;
}
