import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.ctaLink;

export const ctaLink = defineType({
  name: 'ctaLink',
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
      name: 'label',
      title: l.fields.label.title,
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: l.fields.internalLink.title,
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
});
