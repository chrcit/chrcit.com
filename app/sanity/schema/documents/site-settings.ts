import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.siteSettings;

export const siteSettings = defineType({
  name: 'siteSettings',
  title: l.title,
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'legal', title: 'Legal' },
    { name: 'analytics', title: 'Analytics' },
    { name: 'newsletter', title: 'Newsletter' },
  ],
  fields: [
    defineField({
      name: 'metaSettings',
      title: l.fields.metaSettings.title,
      type: 'metaSettings',
      group: 'seo',
    }),
    defineField({
      name: 'favicon',
      title: l.fields.favicon.title,
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'ogVisual',
      title: l.fields.ogVisual.title,
      type: 'complexImage',
      group: 'seo',
    }),
    defineField({
      name: 'socials',
      title: l.fields.socials.title,
      type: 'array',
      group: 'general',
      of: [{ type: 'socialLink' }],
    }),
    defineField({
      name: 'privacyPolicy',
      title: l.fields.privacyPolicy.title,
      type: 'reference',
      group: 'legal',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'imprint',
      title: l.fields.imprint.title,
      type: 'reference',
      group: 'legal',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'analytics',
      title: l.fields.analytics.title,
      type: 'analyticsSettings',
      group: 'analytics',
    }),
    defineField({
      name: 'newsletter',
      title: 'MailerLite',
      type: 'object',
      group: 'newsletter',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'groupId',
          title: 'Default group ID',
          type: 'string',
        }),
        defineField({
          name: 'privacyNote',
          title: 'Privacy note',
          type: 'string',
          initialValue: 'No spam. Unsubscribe whenever you like.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: l.title,
      };
    },
  },
});
