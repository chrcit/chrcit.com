import { defineField, defineType } from 'sanity';

export const newsletterBlock = defineType({
  name: 'newsletterBlock',
  title: 'Newsletter signup',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Subscribe',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      initialValue: 'You are on the list. Thank you.',
    }),
    defineField({
      name: 'groupId',
      title: 'MailerLite group ID override',
      type: 'string',
      description: 'Optional. Uses the global newsletter group when empty.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Newsletter signup' }),
  },
});
