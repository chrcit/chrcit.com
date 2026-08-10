import { defineField, defineType } from 'sanity';

export const linkListBlock = defineType({
  name: 'linkListBlock',
  title: 'Link list',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Introduction', type: 'text', rows: 3 }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'navLink' }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Link list' }),
  },
});
