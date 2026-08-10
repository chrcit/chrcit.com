import { BlockquoteIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  icon: BlockquoteIcon,
  groups: [
    { name: 'content', title: 'Quote', default: true },
    { name: 'relations', title: 'Relations' },
    { name: 'source', title: 'Source data' },
  ],
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 8,
      group: 'content',
      validation: (Rule) => Rule.required().max(10000),
    }),
    defineField({
      name: 'sourceItem',
      title: 'Reading item',
      description:
        'The book or article this quote belongs to. The item remains reusable independently.',
      type: 'reference',
      to: [{ type: 'thing' }],
      options: {
        filter: 'kind in ["book", "article"]',
      },
      group: 'relations',
    }),
    defineField({
      name: 'attribution',
      title: 'Fallback attribution',
      description:
        'Used for a person, conversation, or source that is not represented by a reading item.',
      type: 'string',
      group: 'relations',
    }),
    defineField({
      name: 'commentary',
      title: 'My note',
      description:
        'Editorial context. Source syncs never overwrite this field.',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })],
      group: 'relations',
    }),
    defineField({
      name: 'tags',
      title: 'Source tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'relations',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'relations',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Curated order',
      type: 'number',
      group: 'relations',
    }),
    defineField({
      name: 'origin',
      title: 'Origin',
      type: 'string',
      initialValue: 'manual',
      options: {
        layout: 'radio',
        list: [
          { title: 'Manual', value: 'manual' },
          { title: 'Readwise', value: 'readwise' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'source',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'source',
    }),
    defineField({
      name: 'locationType',
      title: 'Location type',
      type: 'string',
      group: 'source',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Original URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'source',
    }),
    defineField({
      name: 'sourceNote',
      title: 'Readwise note',
      description:
        'Annotation stored with the source highlight. Use “My note” for site-specific editorial context.',
      type: 'text',
      rows: 4,
      readOnly: ({ document }) => document?.origin === 'readwise',
      group: 'source',
    }),
    defineField({
      name: 'readwise',
      title: 'Readwise metadata',
      type: 'object',
      description:
        'Owned by the Readwise importer or a future MCP sync. Editorial fields above remain untouched.',
      hidden: ({ document }) => document?.origin !== 'readwise',
      readOnly: true,
      group: 'source',
      fields: [
        defineField({ name: 'highlightId', type: 'string' }),
        defineField({ name: 'externalId', type: 'string' }),
        defineField({ name: 'readwiseUrl', type: 'url' }),
        defineField({ name: 'color', type: 'string' }),
        defineField({ name: 'highlightedAt', type: 'datetime' }),
        defineField({ name: 'sourceUpdatedAt', type: 'datetime' }),
        defineField({ name: 'syncedAt', type: 'datetime' }),
      ],
    }),
    defineField({
      name: 'sourceState',
      title: 'Source state',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Archived at source', value: 'archived' },
        ],
      },
      readOnly: ({ document }) => document?.origin === 'readwise',
      group: 'source',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      sourceTitle: 'sourceItem.title',
      attribution: 'attribution',
      origin: 'origin',
    },
    prepare: ({ text, sourceTitle, attribution, origin }) => ({
      title: text || 'Untitled quote',
      subtitle: [sourceTitle || attribution, origin]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
