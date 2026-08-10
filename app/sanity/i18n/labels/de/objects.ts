import type { ObjectLabels } from '@/sanity/i18n/labels/schema';

export const objects: ObjectLabels = {
  meta: {
    title: 'Meta',
    fields: {
      title: { title: 'Titel' },
      description: { title: 'Beschreibung' },
      keywords: { title: 'Schlüsselwörter' },
      ogImage: { title: 'Open-Graph-Bild' },
      visibility: {
        title: 'Sichtbarkeit',
        options: {
          public: 'Öffentlich',
          hidden: 'Versteckt (noindex + nicht in Sitemap)',
          private: 'Privat (404)',
        },
      },
    },
  },
  metaSettings: {
    title: 'Meta-Einstellungen',
    fields: {
      siteTitle: {
        title: 'Seitentitel',
        description: 'Wird als Standardtitel und für Titelvorlagen verwendet.',
      },
      titleTemplate: {
        title: 'Titelvorlage',
        description: 'Beispiel: „%s | Meine Website"',
      },
      defaultDescription: { title: 'Standardbeschreibung' },
      defaultKeywords: { title: 'Standard-Schlüsselwörter' },
      defaultOgImage: { title: 'Standard-Open-Graph-Bild' },
    },
  },
  complexImage: {
    title: 'Erweitertes Bild',
    fields: {
      asset: { title: 'Bild' },
      alt: { title: 'Alternativtext' },
      caption: { title: 'Bildunterschrift' },
      width: {
        title: 'Bevorzugte Breite',
        description: 'Optional: Hinweis für die Darstellungsbreite.',
      },
    },
  },
  richText: {
    title: 'Fließtext',
    styles: {
      normal: 'Normal',
      h1: 'Überschrift 1',
      h2: 'Überschrift 2',
      h3: 'Überschrift 3',
    },
    lists: {
      bullet: 'Aufzählung',
      number: 'Nummerierung',
    },
    decorators: {
      strong: 'Fett',
      em: 'Kursiv',
      code: 'Code',
    },
  },
  markExternalLink: {
    title: 'Externer Link',
    fields: {
      type: {
        title: 'Link-Typ',
        options: {
          url: 'URL',
          email: 'E-Mail',
          phone: 'Telefon',
          file: 'Datei',
        },
      },
      url: { title: 'URL' },
      email: { title: 'E-Mail' },
      phone: { title: 'Telefon' },
      file: { title: 'Datei' },
    },
  },
  markInternalLink: {
    title: 'Interner Link',
    fields: {
      link: { title: 'Link' },
    },
  },
  navLink: {
    title: 'Navigationslink',
    fields: {
      type: {
        title: 'Typ',
        options: { internal: 'Intern', external: 'Extern' },
      },
      title: { title: 'Titel' },
      reference: { title: 'Interne Seite' },
      externalLink: { title: 'Externer Link' },
    },
  },
  ctaLink: {
    title: 'CTA-Link',
    fields: {
      type: {
        title: 'Typ',
        options: { internal: 'Intern', external: 'Extern' },
      },
      label: { title: 'Beschriftung' },
      internalLink: { title: 'Interne Seite' },
      externalLink: { title: 'Externer Link' },
    },
  },
  socialLink: {
    title: 'Social-Media-Link',
    fields: {
      platform: { title: 'Plattform' },
      url: { title: 'URL' },
    },
  },
  analyticsSettings: {
    title: 'Analytics-Einstellungen',
    description: 'Konfiguration der Analyse-Erfassung für die Website.',
    fields: {
      enabled: { title: 'Aktiviert' },
      consentBanner: {
        title: 'Consent-Banner',
        fields: {
          headline: { title: 'Überschrift' },
          description: { title: 'Beschreibung' },
          acceptAllLabel: { title: '„Alle akzeptieren“ Label' },
          rejectAllLabel: { title: '„Alle ablehnen“ Label' },
          manageLabel: { title: '„Verwalten“ Label' },
          saveLabel: { title: '„Speichern“ Label' },
        },
      },
      consentCategories: {
        title: 'Consent-Kategorien',
        fields: {
          key: { title: 'Key' },
          label: { title: 'Label' },
          description: { title: 'Beschreibung' },
          required: { title: 'Erforderlich' },
        },
      },
      plausible: {
        title: 'Plausible',
        fields: {
          enabled: { title: 'Aktiviert' },
          domain: {
            title: 'Domain',
            description: 'Plausible-Site-Domain (z. B. beispiel.de).',
          },
          proxyEnabled: { title: 'Proxy-Routen verwenden' },
          selfHostedUrl: { title: 'Self-hosted URL (optional)' },
        },
      },
      posthog: {
        title: 'PostHog',
        fields: {
          enabled: { title: 'Aktiviert' },
          projectKey: { title: 'Project key' },
          host: {
            title: 'Host',
            description: 'Standard: https://eu.posthog.com',
          },
          proxyEnabled: { title: 'Proxy-Routen verwenden' },
        },
      },
    },
  },
  pageBuilderComponent: {
    title: 'Seitenbuilder-Komponente',
    fields: {
      title: { title: 'Titel' },
      body: { title: 'Inhalt' },
    },
  },
  separator: {
    title: 'Trennlinie',
  },
};
