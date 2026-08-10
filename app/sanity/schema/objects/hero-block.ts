import { defineField, defineType } from 'sanity';

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', title: 'Introduction', type: 'richText' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'navLink' }],
    }),
    defineField({
      name: 'image',
      title: 'Optional image',
      type: 'complexImage',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Hero', subtitle }),
  },
});
