import groq, { defineQuery } from 'groq';

export const ANALYTICS_QUERY = defineQuery(groq`
  *[_type == "siteSettings"][0]{
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
