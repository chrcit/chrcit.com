import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.meta;

export const meta = defineType({
  name: 'meta',
  title: l.title,
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'title',
      title: l.fields.title.title,
      type: 'string',
      description: 'Leave empty to use page title',
    }),
    defineField({
      name: 'description',
      title: l.fields.description.title,
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keywords',
      title: l.fields.keywords.title,
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: l.fields.ogImage.title,
      type: 'complexImage',
    }),
    defineField({
      name: 'visibility',
      title: l.fields.visibility.title,
      type: 'string',
      initialValue: 'public',
      options: {
        list: [
          { title: l.fields.visibility.options.public, value: 'public' },
          { title: l.fields.visibility.options.hidden, value: 'hidden' },
          { title: l.fields.visibility.options.private, value: 'private' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      visibility: 'visibility',
    },
    prepare({ title, visibility }) {
      return {
        title: title || l.title,
        subtitle: visibility
          ? `${l.fields.visibility.title}: ${visibility}`
          : undefined,
      };
    },
  },
});
