import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.footer;

export const footer = defineType({
  name: 'footer',
  title: l.title,
  type: 'document',
  groups: [
    { name: 'branding', title: 'Branding', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'social', title: 'Social Media' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: l.fields.logo.title,
      type: 'complexImage',
      group: 'branding',
    }),
    defineField({
      name: 'mainNav',
      title: l.fields.mainNav.title,
      type: 'array',
      group: 'navigation',
      of: [{ type: 'navLink' }],
    }),
    defineField({
      name: 'secondaryNav',
      title: l.fields.secondaryNav.title,
      type: 'array',
      group: 'navigation',
      of: [{ type: 'navLink' }],
    }),
    defineField({
      name: 'socials',
      title: l.fields.socials.title,
      type: 'array',
      group: 'social',
      of: [{ type: 'socialLink' }],
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
