import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.page;

export const page = defineType({
  name: 'page',
  title: l.title,
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: l.fields.title.title,
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: l.fields.slug.title,
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      hidden: ({ document }) => document?._id === 'homepage',
      validation: (Rule) =>
        Rule.custom((slug, context) => {
          const docId = context.document?._id;
          if (docId === 'homepage') return true;
          return slug?.current ? true : 'Required';
        }),
    }),
    defineField({
      name: 'meta',
      title: l.fields.meta.title,
      type: 'meta',
      group: 'seo',
    }),
    defineField({
      name: 'showTableOfContents',
      title: 'Show table of contents',
      type: 'boolean',
      initialValue: false,
      group: 'content',
      description:
        'Build a compact table from H2 and H3 headings in editorial text.',
    }),
    defineField({
      name: 'contentMode',
      title: l.fields.contentMode.title,
      type: 'string',
      group: 'content',
      initialValue: 'pageBuilder',
      options: {
        list: [
          { title: l.fields.contentMode.options.richText, value: 'richText' },
          {
            title: l.fields.contentMode.options.pageBuilder,
            value: 'pageBuilder',
          },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'richText',
      title: l.fields.richText.title,
      type: 'richText',
      group: 'content',
      hidden: ({ parent }) => parent?.contentMode === 'pageBuilder',
    }),
    defineField({
      name: 'components',
      title: l.fields.components.title,
      type: 'array',
      group: 'content',
      of: [
        { type: 'heroBlock' },
        { type: 'richTextBlock' },
        { type: 'referenceCollection' },
        { type: 'quoteBlock' },
        { type: 'newsletterBlock' },
        { type: 'linkListBlock' },
        { type: 'complexImage' },
        { type: 'separator' },
      ],
      hidden: ({ parent }) => parent?.contentMode !== 'pageBuilder',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      visibility: 'meta.visibility',
    },
    prepare({ title, slug, visibility }) {
      const subtitleParts = [slug ? `/${slug}` : undefined, visibility];
      return {
        title,
        subtitle: subtitleParts.filter(Boolean).join(' • '),
      };
    },
  },
});
