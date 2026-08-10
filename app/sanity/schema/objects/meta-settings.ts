import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.metaSettings;

export const metaSettings = defineType({
  name: 'metaSettings',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'siteTitle',
      title: l.fields.siteTitle.title,
      type: 'string',
      description: l.fields.siteTitle.description,
    }),
    defineField({
      name: 'titleTemplate',
      title: l.fields.titleTemplate.title,
      type: 'string',
      description: l.fields.titleTemplate.description,
    }),
    defineField({
      name: 'defaultDescription',
      title: l.fields.defaultDescription.title,
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'defaultKeywords',
      title: l.fields.defaultKeywords.title,
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'defaultOgImage',
      title: l.fields.defaultOgImage.title,
      type: 'complexImage',
    }),
  ],
});
