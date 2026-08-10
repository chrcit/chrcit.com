import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.socialLink;

export const socialLink = defineType({
  name: 'socialLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: l.fields.platform.title,
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Pinterest', value: 'pinterest' },
          { title: 'Snapchat', value: 'snapchat' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: l.fields.url.title,
      type: 'url',
      validation: (Rule) => Rule.required().uri({ allowRelative: false }),
    }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
});
