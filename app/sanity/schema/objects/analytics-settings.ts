import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.analyticsSettings;

export const analyticsSettings = defineType({
  name: 'analyticsSettings',
  title: l.title,
  type: 'object',
  description: l.description,
  fields: [
    defineField({
      name: 'enabled',
      title: l.fields.enabled.title,
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'consentBanner',
      title: l.fields.consentBanner.title,
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: l.fields.consentBanner.fields.headline.title,
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: l.fields.consentBanner.fields.description.title,
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'acceptAllLabel',
          title: l.fields.consentBanner.fields.acceptAllLabel.title,
          type: 'string',
        }),
        defineField({
          name: 'rejectAllLabel',
          title: l.fields.consentBanner.fields.rejectAllLabel.title,
          type: 'string',
        }),
        defineField({
          name: 'manageLabel',
          title: l.fields.consentBanner.fields.manageLabel.title,
          type: 'string',
        }),
        defineField({
          name: 'saveLabel',
          title: l.fields.consentBanner.fields.saveLabel.title,
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'consentCategories',
      title: l.fields.consentCategories.title,
      type: 'array',
      of: [
        defineField({
          name: 'consentCategory',
          title: l.fields.consentCategories.title,
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: l.fields.consentCategories.fields.key.title,
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: l.fields.consentCategories.fields.label.title,
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: l.fields.consentCategories.fields.description.title,
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'required',
              title: l.fields.consentCategories.fields.required.title,
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'key' },
          },
        }),
      ],
      initialValue: [
        {
          key: 'necessary',
          label: 'Necessary',
          required: true,
        },
        {
          key: 'functionality',
          label: 'Functionality',
          required: false,
        },
      ],
    }),
    defineField({
      name: 'plausible',
      title: l.fields.plausible.title,
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: l.fields.plausible.fields.enabled.title,
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'domain',
          title: l.fields.plausible.fields.domain.title,
          description: l.fields.plausible.fields.domain.description,
          type: 'string',
        }),
        defineField({
          name: 'proxyEnabled',
          title: l.fields.plausible.fields.proxyEnabled.title,
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'selfHostedUrl',
          title: l.fields.plausible.fields.selfHostedUrl.title,
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'posthog',
      title: l.fields.posthog.title,
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: l.fields.posthog.fields.enabled.title,
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'projectKey',
          title: l.fields.posthog.fields.projectKey.title,
          type: 'string',
        }),
        defineField({
          name: 'host',
          title: l.fields.posthog.fields.host.title,
          description: l.fields.posthog.fields.host.description,
          type: 'url',
        }),
        defineField({
          name: 'proxyEnabled',
          title: l.fields.posthog.fields.proxyEnabled.title,
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
});
