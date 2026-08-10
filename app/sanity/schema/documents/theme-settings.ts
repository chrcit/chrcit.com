import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.themeSettings;

export const themeSettings = defineType({
  name: 'themeSettings',
  title: l.title,
  type: 'document',
  groups: [{ name: 'colors', title: 'Colors', default: true }],
  fields: [
    defineField({
      name: 'brandColor',
      title: l.fields.brandColor.title,
      type: 'string',
      group: 'colors',
      description: l.fields.brandColor.description,
    }),
    defineField({
      name: 'textColor',
      title: l.fields.textColor.title,
      type: 'string',
      group: 'colors',
      description: l.fields.textColor.description,
    }),
    defineField({
      name: 'backgroundColor',
      title: l.fields.backgroundColor.title,
      type: 'string',
      group: 'colors',
      description: l.fields.backgroundColor.description,
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
