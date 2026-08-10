import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const SITE_SETTINGS_QUERY = defineQuery(groq`
  *[_type == "siteSettings"][0]{
    _id,
    _type,
    metaSettings{
      siteTitle,
      titleTemplate,
      defaultDescription,
      defaultKeywords,
      defaultOgImage{${complexImageStub}}
    },
    favicon{
      ...,
      asset->{_id, url}
    },
    ogVisual{${complexImageStub}},
    socials[]{platform, url},
    privacyPolicy->{_id, _type, title, slug, meta{visibility}},
    imprint->{_id, _type, title, slug, meta{visibility}},
    newsletter{enabled, groupId, privacyNote},
    analytics{
      enabled,
      consentBanner{
        headline,
        description,
        acceptAllLabel,
        rejectAllLabel,
        manageLabel,
        saveLabel
      },
      consentCategories[]{
        key,
        label,
        description,
        required
      },
      plausible{
        enabled,
        domain,
        proxyEnabled,
        selfHostedUrl
      },
      posthog{
        enabled,
        projectKey,
        host,
        proxyEnabled
      }
    }
  }
`);
