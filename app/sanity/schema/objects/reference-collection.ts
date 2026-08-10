import { defineField, defineType } from 'sanity';

const referenceTypes = [
  { type: 'thing' },
  { type: 'project' },
  { type: 'article' },
  { type: 'page' },
  { type: 'quote' },
];

export const referenceCollection = defineType({
  name: 'referenceCollection',
  title: 'Reference collection',
  type: 'object',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'manual',
      options: {
        layout: 'radio',
        list: [
          { title: 'Hand-picked', value: 'manual' },
          { title: 'Filtered library', value: 'filter' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'reference', to: referenceTypes }],
      hidden: ({ parent }) => parent?.source === 'filter',
      group: 'content',
    }),
    defineField({
      name: 'filter',
      title: 'Filter',
      type: 'object',
      hidden: ({ parent }) => parent?.source !== 'filter',
      group: 'content',
      fields: [
        defineField({
          name: 'contentTypes',
          title: 'Content types',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Things', value: 'thing' },
              { title: 'Projects', value: 'project' },
              { title: 'Articles', value: 'article' },
            ],
          },
        }),
        defineField({
          name: 'kinds',
          title: 'Thing kinds',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Book', value: 'book' },
              { title: 'Article', value: 'article' },
              { title: 'Film', value: 'film' },
              { title: 'Music', value: 'music' },
              { title: 'Album', value: 'album' },
              { title: 'Tool', value: 'tool' },
              { title: 'Game', value: 'game' },
              { title: 'Website', value: 'website' },
              { title: 'Other', value: 'other' },
            ],
          },
        }),
        defineField({
          name: 'topics',
          title: 'Topics',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'topic' }] }],
        }),
        defineField({
          name: 'featuredOnly',
          title: 'Featured only',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'includeHistorical',
          title: 'Include historical projects',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'limit',
          title: 'Maximum items',
          type: 'number',
          initialValue: 12,
          validation: (Rule) => Rule.min(1).max(500),
        }),
        defineField({
          name: 'order',
          title: 'Order',
          type: 'string',
          initialValue: 'manual',
          options: {
            list: [
              { title: 'Newest first', value: 'newest' },
              { title: 'Title', value: 'title' },
              { title: 'Curated order', value: 'manual' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'presentation',
      title: 'Presentation',
      type: 'string',
      initialValue: 'list',
      options: {
        layout: 'radio',
        list: [
          { title: 'List', value: 'list' },
          { title: 'Grid', value: 'grid' },
          { title: 'Media list', value: 'mediaList' },
          { title: 'Swipe carousel', value: 'carousel' },
          { title: 'Single', value: 'single' },
          { title: 'Filterable list', value: 'filterList' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'display',
    }),
    defineField({
      name: 'showFilters',
      title: 'Show visitor filters',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.presentation !== 'filterList',
      group: 'display',
    }),
    defineField({
      name: 'showNotes',
      title: 'Show my notes',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
  ],
  preview: {
    select: { title: 'title', presentation: 'presentation', source: 'source' },
    prepare: ({ title, presentation, source }) => ({
      title: title || 'Reference collection',
      subtitle: `${source || 'manual'} · ${presentation || 'list'}`,
    }),
  },
});
