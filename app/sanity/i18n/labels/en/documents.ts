import type { DocumentLabels } from '@/sanity/i18n/labels/schema';

export const documents: DocumentLabels = {
  page: {
    title: 'Page',
    fields: {
      title: { title: 'Title' },
      slug: { title: 'Slug' },
      meta: { title: 'Meta' },
      contentMode: {
        title: 'Content mode',
        options: { richText: 'Rich text', pageBuilder: 'Page builder' },
      },
      richText: { title: 'Rich text' },
      components: { title: 'Components' },
    },
  },
  siteSettings: {
    title: 'Site Settings',
    fields: {
      metaSettings: { title: 'Meta settings' },
      favicon: { title: 'Favicon' },
      ogVisual: { title: 'Default Open Graph visual' },
      socials: { title: 'Social links' },
      privacyPolicy: { title: 'Privacy policy page' },
      imprint: { title: 'Imprint page' },
      analytics: { title: 'Analytics' },
    },
  },
  themeSettings: {
    title: 'Theme Settings',
    fields: {
      brandColor: {
        title: 'Brand color',
        description: 'CSS color value (e.g. #ff0000).',
      },
      textColor: {
        title: 'Text color',
        description: 'CSS color value (e.g. #111111).',
      },
      backgroundColor: {
        title: 'Background color',
        description: 'CSS color value (e.g. #ffffff).',
      },
    },
  },
  header: {
    title: 'Header',
    fields: {
      logo: { title: 'Logo' },
      nav: { title: 'Navigation' },
      cta: { title: 'CTA' },
    },
  },
  footer: {
    title: 'Footer',
    fields: {
      logo: { title: 'Logo' },
      mainNav: { title: 'Main navigation' },
      secondaryNav: { title: 'Secondary navigation' },
      socials: { title: 'Social links' },
    },
  },
};
