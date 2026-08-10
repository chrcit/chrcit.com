import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.header;

export const header = defineType({
  name: 'header',
  title: l.title,
  type: 'document',
  groups: [
    { name: 'branding', title: 'Branding', default: true },
    { name: 'navigation', title: 'Navigation' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: l.fields.logo.title,
      type: 'complexImage',
      group: 'branding',
    }),
    defineField({
      name: 'nav',
      title: l.fields.nav.title,
      type: 'array',
      group: 'navigation',
      of: [{ type: 'navLink' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: l.title,
      };
    },
  },
});
