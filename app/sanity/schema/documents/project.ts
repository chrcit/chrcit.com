import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'details', title: 'Details' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'complexImage',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Project story',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'components',
      title: 'Additional blocks',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'richTextBlock' },
        { type: 'referenceCollection' },
        { type: 'newsletterBlock' },
        { type: 'linkListBlock' },
        { type: 'complexImage' },
        { type: 'separator' },
      ],
      group: 'content',
    }),
    defineField({
      name: 'url',
      title: 'Project URL',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
      group: 'details',
    }),
    defineField({
      name: 'historical',
      title: 'Historical',
      type: 'boolean',
      initialValue: true,
      description:
        'Kept in the library but excluded from current-work views unless selected.',
      group: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'details',
    }),
    defineField({ name: 'meta', title: 'SEO', type: 'meta', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary', media: 'cover.asset' },
  },
});
