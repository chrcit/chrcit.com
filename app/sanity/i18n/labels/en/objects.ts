import type { ObjectLabels } from '@/sanity/i18n/labels/schema';

export const objects: ObjectLabels = {
  meta: {
    title: 'Meta',
    fields: {
      title: { title: 'Title' },
      description: { title: 'Description' },
      keywords: { title: 'Keywords' },
      ogImage: { title: 'Open Graph Image' },
      visibility: {
        title: 'Visibility',
        options: {
          public: 'Public',
          hidden: 'Hidden (noindex + excluded from sitemap)',
          private: 'Private (404)',
        },
      },
    },
  },
  metaSettings: {
    title: 'Meta Settings',
    fields: {
      siteTitle: {
        title: 'Site title',
        description: 'Used as a default title and for title templates.',
      },
      titleTemplate: {
        title: 'Title template',
        description: 'Example: "%s | My Site"',
      },
      defaultDescription: { title: 'Default description' },
      defaultKeywords: { title: 'Default keywords' },
      defaultOgImage: { title: 'Default Open Graph image' },
    },
  },
  complexImage: {
    title: 'Complex Image',
    fields: {
      asset: { title: 'Image' },
      alt: { title: 'Alt text' },
      caption: { title: 'Caption' },
      width: {
        title: 'Preferred width',
        description: 'Optional: hint for rendering width in the UI.',
      },
    },
  },
  richText: {
    title: 'Rich Text',
    styles: {
      normal: 'Normal',
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
    },
    lists: {
      bullet: 'Bullet',
      number: 'Numbered',
    },
    decorators: {
      strong: 'Strong',
      em: 'Emphasis',
      code: 'Code',
    },
  },
  markExternalLink: {
    title: 'External Link',
    fields: {
      type: {
        title: 'Link type',
        options: { url: 'URL', email: 'Email', phone: 'Phone', file: 'File' },
      },
      url: { title: 'URL' },
      email: { title: 'Email' },
      phone: { title: 'Phone' },
      file: { title: 'File' },
    },
  },
  markInternalLink: {
    title: 'Internal Link',
    fields: {
      link: { title: 'Link' },
    },
  },
  navLink: {
    title: 'Navigation Link',
    fields: {
      type: {
        title: 'Type',
        options: { internal: 'Internal', external: 'External' },
      },
      title: { title: 'Title' },
      reference: { title: 'Internal page' },
      externalLink: { title: 'External link' },
    },
  },
  ctaLink: {
    title: 'CTA Link',
    fields: {
      type: {
        title: 'Type',
        options: { internal: 'Internal', external: 'External' },
      },
      label: { title: 'Label' },
      internalLink: { title: 'Internal page' },
      externalLink: { title: 'External link' },
    },
  },
  socialLink: {
    title: 'Social Link',
    fields: {
      platform: { title: 'Platform' },
      url: { title: 'URL' },
    },
  },
  analyticsSettings: {
    title: 'Analytics Settings',
    description: 'Configure analytics tracking for the site.',
    fields: {
      enabled: { title: 'Enabled' },
      consentBanner: {
        title: 'Consent banner',
        fields: {
          headline: { title: 'Headline' },
          description: { title: 'Description' },
          acceptAllLabel: { title: 'Accept all label' },
          rejectAllLabel: { title: 'Reject all label' },
          manageLabel: { title: 'Manage label' },
          saveLabel: { title: 'Save label' },
        },
      },
      consentCategories: {
        title: 'Consent categories',
        fields: {
          key: { title: 'Key' },
          label: { title: 'Label' },
          description: { title: 'Description' },
          required: { title: 'Required' },
        },
      },
      plausible: {
        title: 'Plausible',
        fields: {
          enabled: { title: 'Enabled' },
          domain: {
            title: 'Domain',
            description: 'Plausible site domain (e.g. example.com).',
          },
          proxyEnabled: { title: 'Use proxy routes' },
          selfHostedUrl: { title: 'Self-hosted URL (optional)' },
        },
      },
      posthog: {
        title: 'PostHog',
        fields: {
          enabled: { title: 'Enabled' },
          projectKey: { title: 'Project key' },
          host: {
            title: 'Host',
            description: 'Default: https://eu.posthog.com',
          },
          proxyEnabled: { title: 'Use proxy routes' },
        },
      },
    },
  },
  pageBuilderComponent: {
    title: 'Page Builder Component',
    fields: {
      title: { title: 'Title' },
      body: { title: 'Body' },
    },
  },
  separator: {
    title: 'Separator',
  },
};
