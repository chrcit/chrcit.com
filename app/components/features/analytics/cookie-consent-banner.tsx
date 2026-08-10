import { CookieBanner } from '@c15t/react';
import type { SITE_SETTINGS_QUERYResult } from '@gen/sanity';

type AnalyticsConfig = NonNullable<
  NonNullable<SITE_SETTINGS_QUERYResult>['analytics']
>;

type Props = {
  config: AnalyticsConfig | null | undefined;
};

export function CookieConsentBanner({ config }: Props) {
  const banner = config?.consentBanner;

  return (
    <CookieBanner
      title={banner?.headline ?? 'Privacy settings'}
      description={
        banner?.description ??
        'We use cookies and similar technologies to improve the experience.'
      }
      acceptButtonText={banner?.acceptAllLabel ?? 'Accept all'}
      rejectButtonText={banner?.rejectAllLabel ?? 'Reject all'}
      customizeButtonText={banner?.manageLabel ?? 'Manage'}
    />
  );
}
