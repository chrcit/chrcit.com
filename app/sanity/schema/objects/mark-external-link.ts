import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.markExternalLink;

const isType =
  (expected: string) =>
  ({ parent }: { parent?: { type?: string } }) =>
    parent?.type !== expected;

export const markExternalLink = defineType({
  name: 'markExternalLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: l.fields.type.title,
      type: 'string',
      initialValue: 'url',
      options: {
        list: [
          { title: l.fields.type.options.url, value: 'url' },
          { title: l.fields.type.options.email, value: 'email' },
          { title: l.fields.type.options.phone, value: 'phone' },
          { title: l.fields.type.options.file, value: 'file' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: l.fields.url.title,
      type: 'url',
      hidden: isType('url'),
      validation: (Rule) => Rule.uri({ allowRelative: false }),
    }),
    defineField({
      name: 'email',
      title: l.fields.email.title,
      type: 'string',
      hidden: isType('email'),
    }),
    defineField({
      name: 'phone',
      title: l.fields.phone.title,
      type: 'string',
      hidden: isType('phone'),
    }),
    defineField({
      name: 'file',
      title: l.fields.file.title,
      type: 'file',
      hidden: isType('file'),
    }),
  ],
  preview: {
    select: {
      type: 'type',
      url: 'url',
      email: 'email',
      phone: 'phone',
    },
    prepare({ type, url, email, phone }) {
      const subtitle =
        type === 'email'
          ? email
          : type === 'phone'
            ? phone
            : type === 'url'
              ? url
              : l.fields.file.title;
      return {
        title: l.title,
        subtitle: subtitle || type,
      };
    },
  },
});
