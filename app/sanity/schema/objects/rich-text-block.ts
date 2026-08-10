import { defineField, defineType } from 'sanity';

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Editorial text',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Editor label', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'richText' }),
  ],
  preview: {
    select: { title: 'label' },
    prepare: ({ title }) => ({ title: title || 'Editorial text' }),
  },
});
