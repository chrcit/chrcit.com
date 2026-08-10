import type { StudioLabels } from '@/sanity/i18n/labels/schema';
import { documents } from '@/sanity/i18n/labels/de/documents';
import { objects } from '@/sanity/i18n/labels/de/objects';
import { common, validation } from '@/sanity/i18n/labels/de/common';

const structure = {
  homepage: 'Homepage',
  allPages: 'Alle Seiten',
  imprint: 'Impressum',
  privacy: 'Datenschutz',
  settings: 'Einstellungen',
};

export const de: StudioLabels = {
  documents,
  objects,
  structure,
  common,
  validation,
};
