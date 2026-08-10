import type { StudioLabels } from '@/sanity/i18n/labels/schema';
import { documents } from '@/sanity/i18n/labels/en/documents';
import { objects } from '@/sanity/i18n/labels/en/objects';
import { common, validation } from '@/sanity/i18n/labels/en/common';

const structure = {
  homepage: 'Homepage',
  allPages: 'All Pages',
  imprint: 'Imprint',
  privacy: 'Privacy Policy',
  settings: 'Settings',
};

export const en: StudioLabels = {
  documents,
  objects,
  structure,
  common,
  validation,
};
