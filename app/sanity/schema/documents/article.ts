import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Article',
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
      name: 'excerpt',
      title: 'Excerpt',
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
      title: 'Article',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External canonical URL',
      type: 'url',
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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'details',
    }),
    defineField({ name: 'meta', title: 'SEO', type: 'meta', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'cover.asset' },
  },
});
