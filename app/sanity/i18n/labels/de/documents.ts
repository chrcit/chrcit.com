import type { DocumentLabels } from '@/sanity/i18n/labels/schema';

export const documents: DocumentLabels = {
  page: {
    title: 'Seite',
    fields: {
      title: { title: 'Titel' },
      slug: { title: 'URL-Pfad' },
      meta: { title: 'Meta' },
      contentMode: {
        title: 'Inhaltsmodus',
        options: { richText: 'Fließtext', pageBuilder: 'Seitenbuilder' },
      },
      richText: { title: 'Fließtext' },
      components: { title: 'Komponenten' },
    },
  },
  siteSettings: {
    title: 'Website-Einstellungen',
    fields: {
      metaSettings: { title: 'Meta-Einstellungen' },
      favicon: { title: 'Favicon' },
      ogVisual: { title: 'Standard Open-Graph-Bild' },
      socials: { title: 'Social-Media-Links' },
      privacyPolicy: { title: 'Datenschutzseite' },
      imprint: { title: 'Impressumseite' },
      analytics: { title: 'Analytics' },
    },
  },
  themeSettings: {
    title: 'Design-Einstellungen',
    fields: {
      brandColor: {
        title: 'Markenfarbe',
        description: 'CSS-Farbwert (z. B. #ff0000).',
      },
      textColor: {
        title: 'Textfarbe',
        description: 'CSS-Farbwert (z. B. #111111).',
      },
      backgroundColor: {
        title: 'Hintergrundfarbe',
        description: 'CSS-Farbwert (z. B. #ffffff).',
      },
    },
  },
  header: {
    title: 'Kopfzeile',
    fields: {
      logo: { title: 'Logo' },
      nav: { title: 'Navigation' },
      cta: { title: 'Handlungsaufforderung' },
    },
  },
  footer: {
    title: 'Fußzeile',
    fields: {
      logo: { title: 'Logo' },
      mainNav: { title: 'Hauptnavigation' },
      secondaryNav: { title: 'Sekundärnavigation' },
      socials: { title: 'Social-Media-Links' },
    },
  },
};
