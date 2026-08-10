import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.complexImage;

export const complexImage = defineType({
  name: 'complexImage',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: l.fields.asset.title,
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: l.fields.alt.title,
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: l.fields.caption.title,
      type: 'string',
    }),
    defineField({
      name: 'width',
      title: l.fields.width.title,
      type: 'number',
      description: l.fields.width.description,
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'asset',
    },
    prepare({ title, media }) {
      return {
        title: title || l.fields.asset.title,
        media,
      };
    },
  },
});
