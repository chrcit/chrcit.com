import { BlockquoteIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Referenced quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'reference',
      to: [{ type: 'quote' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'context',
      title: 'Placement note',
      description:
        'Optional context for this placement only. The quote itself stays canonical.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'showSource',
      title: 'Show source',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCommentary',
      title: 'Show my note',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { text: 'quote.text', source: 'quote.sourceItem.title' },
    prepare: ({ text, source }) => ({
      title: text || 'Referenced quote',
      subtitle: source,
    }),
  },
});
