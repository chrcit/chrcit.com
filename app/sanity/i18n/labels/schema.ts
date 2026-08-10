/**
 * Type definitions for all translatable Studio labels.
 * Every language file must satisfy these interfaces.
 */

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
export interface DocumentLabels {
  page: {
    title: string;
    fields: {
      title: { title: string };
      slug: { title: string };
      meta: { title: string };
      contentMode: {
        title: string;
        options: { richText: string; pageBuilder: string };
      };
      richText: { title: string };
      components: { title: string };
    };
  };
  siteSettings: {
    title: string;
    fields: {
      metaSettings: { title: string };
      favicon: { title: string };
      ogVisual: { title: string };
      socials: { title: string };
      privacyPolicy: { title: string };
      imprint: { title: string };
      analytics: { title: string };
    };
  };
  themeSettings: {
    title: string;
    fields: {
      brandColor: { title: string; description: string };
      textColor: { title: string; description: string };
      backgroundColor: { title: string; description: string };
    };
  };
  header: {
    title: string;
    fields: {
      logo: { title: string };
      nav: { title: string };
      cta: { title: string };
    };
  };
  footer: {
    title: string;
    fields: {
      logo: { title: string };
      mainNav: { title: string };
      secondaryNav: { title: string };
      socials: { title: string };
    };
  };
}

// ---------------------------------------------------------------------------
// Objects
// ---------------------------------------------------------------------------
export interface ObjectLabels {
  meta: {
    title: string;
    fields: {
      title: { title: string };
      description: { title: string };
      keywords: { title: string };
      ogImage: { title: string };
      visibility: {
        title: string;
        options: {
          public: string;
          hidden: string;
          private: string;
        };
      };
    };
  };
  metaSettings: {
    title: string;
    fields: {
      siteTitle: { title: string; description: string };
      titleTemplate: { title: string; description: string };
      defaultDescription: { title: string };
      defaultKeywords: { title: string };
      defaultOgImage: { title: string };
    };
  };
  complexImage: {
    title: string;
    fields: {
      asset: { title: string };
      alt: { title: string };
      caption: { title: string };
      width: { title: string; description: string };
    };
  };
  richText: {
    title: string;
    styles: {
      normal: string;
      h1: string;
      h2: string;
      h3: string;
    };
    lists: {
      bullet: string;
      number: string;
    };
    decorators: {
      strong: string;
      em: string;
      code: string;
    };
  };
  markExternalLink: {
    title: string;
    fields: {
      type: {
        title: string;
        options: { url: string; email: string; phone: string; file: string };
      };
      url: { title: string };
      email: { title: string };
      phone: { title: string };
      file: { title: string };
    };
  };
  markInternalLink: {
    title: string;
    fields: {
      link: { title: string };
    };
  };
  navLink: {
    title: string;
    fields: {
      type: {
        title: string;
        options: { internal: string; external: string };
      };
      title: { title: string };
      reference: { title: string };
      externalLink: { title: string };
    };
  };
  ctaLink: {
    title: string;
    fields: {
      type: {
        title: string;
        options: { internal: string; external: string };
      };
      label: { title: string };
      internalLink: { title: string };
      externalLink: { title: string };
    };
  };
  socialLink: {
    title: string;
    fields: {
      platform: { title: string };
      url: { title: string };
    };
  };
  analyticsSettings: {
    title: string;
    description: string;
    fields: {
      enabled: { title: string };
      consentBanner: {
        title: string;
        fields: {
          headline: { title: string };
          description: { title: string };
          acceptAllLabel: { title: string };
          rejectAllLabel: { title: string };
          manageLabel: { title: string };
          saveLabel: { title: string };
        };
      };
      consentCategories: {
        title: string;
        fields: {
          key: { title: string };
          label: { title: string };
          description: { title: string };
          required: { title: string };
        };
      };
      plausible: {
        title: string;
        fields: {
          enabled: { title: string };
          domain: { title: string; description: string };
          proxyEnabled: { title: string };
          selfHostedUrl: { title: string };
        };
      };
      posthog: {
        title: string;
        fields: {
          enabled: { title: string };
          projectKey: { title: string };
          host: { title: string; description: string };
          proxyEnabled: { title: string };
        };
      };
    };
  };
  pageBuilderComponent: {
    title: string;
    fields: {
      title: { title: string };
      body: { title: string };
    };
  };
  separator: {
    title: string;
  };
}

// ---------------------------------------------------------------------------
// Structure Builder labels
// ---------------------------------------------------------------------------
export interface StructureLabels {
  homepage: string;
  allPages: string;
  imprint: string;
  privacy: string;
  settings: string;
}

// ---------------------------------------------------------------------------
// Common / Shared
// ---------------------------------------------------------------------------
export interface CommonLabels {
  untitled: string;
  noAddress: string;
}

// ---------------------------------------------------------------------------
// Validation messages
// ---------------------------------------------------------------------------
export interface ValidationLabels {
  required: string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
}

// ---------------------------------------------------------------------------
// Combined interface
// ---------------------------------------------------------------------------
export interface StudioLabels {
  documents: DocumentLabels;
  objects: ObjectLabels;
  structure: StructureLabels;
  common: CommonLabels;
  validation: ValidationLabels;
}
