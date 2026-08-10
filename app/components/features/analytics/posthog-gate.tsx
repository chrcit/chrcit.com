import { useEffect } from 'react';
import { useConsentManager, type AllConsentNames } from '@c15t/react';
import posthog from 'posthog-js';
import type { SITE_SETTINGS_QUERYResult } from '@gen/sanity';

type AnalyticsConfig = NonNullable<
  NonNullable<SITE_SETTINGS_QUERYResult>['analytics']
>;

type Props = {
  config: AnalyticsConfig | null | undefined;
};

type PostHogWithLoadState = typeof posthog & {
  __loaded?: boolean;
};

export function PostHogGate({ config }: Props) {
  const { hasConsentFor } = useConsentManager();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!import.meta.env.PROD) return;

    if (!config?.enabled) return;
    if (!config.posthog?.enabled) return;

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';
    if (isLocalhost) return;

    const consent: AllConsentNames = 'functionality';
    if (!hasConsentFor(consent)) return;

    const projectKey = config.posthog.projectKey;
    if (!projectKey) return;

    const posthogWithState = posthog as PostHogWithLoadState;
    if (posthogWithState.__loaded) return;

    posthog.init(projectKey, {
      api_host: config.posthog.proxyEnabled
        ? '/ingest'
        : (config.posthog.host ?? 'https://eu.posthog.com'),
      autocapture: true,
      capture_pageview: true,
    });

    posthogWithState.__loaded = true;
  }, [config, hasConsentFor]);

  return null;
}
