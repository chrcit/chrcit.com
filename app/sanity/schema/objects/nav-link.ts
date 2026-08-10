import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.navLink;

export const navLink = defineType({
  name: 'navLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: l.fields.type.title,
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          { title: l.fields.type.options.internal, value: 'internal' },
          { title: l.fields.type.options.external, value: 'external' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: l.fields.title.title,
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reference',
      title: l.fields.reference.title,
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'externalLink',
      title: l.fields.externalLink.title,
      type: 'markExternalLink',
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
    },
    prepare({ title, type }) {
      return {
        title,
        subtitle: type,
      };
    },
  },
});
