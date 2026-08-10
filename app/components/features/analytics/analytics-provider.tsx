import type { ReactNode } from 'react';
import { ConsentManagerProvider, type AllConsentNames } from '@c15t/react';
import type { SITE_SETTINGS_QUERYResult } from '@gen/sanity';
import { CookieConsentBanner } from '@/components/features/analytics/cookie-consent-banner';
import { PlausibleGate } from '@/components/features/analytics/plausible-gate';
import { PostHogGate } from '@/components/features/analytics/posthog-gate';

type AnalyticsConfig = NonNullable<
  NonNullable<SITE_SETTINGS_QUERYResult>['analytics']
>;

type Props = {
  config: AnalyticsConfig | null | undefined;
  children: ReactNode;
};

const CONSENT_NAMES = ['necessary', 'functionality'] as const;

function isConsentName(value: string): value is AllConsentNames {
  return (CONSENT_NAMES as readonly string[]).includes(value);
}

export function AnalyticsProvider({ config, children }: Props) {
  const categories =
    config?.consentCategories?.map((c) => c?.key ?? '').filter(isConsentName) ??
    undefined;

  return (
    <ConsentManagerProvider
      options={{
        mode: 'offline',
        consentCategories: categories ?? ['necessary', 'functionality'],
      }}
    >
      {children}
      <CookieConsentBanner config={config} />
      <PlausibleGate config={config} />
      <PostHogGate config={config} />
    </ConsentManagerProvider>
  );
}
