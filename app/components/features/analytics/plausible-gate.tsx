import { useEffect } from 'react';
import { useConsentManager, type AllConsentNames } from '@c15t/react';
import type { SITE_SETTINGS_QUERYResult } from '@gen/sanity';

type AnalyticsConfig = NonNullable<
  NonNullable<SITE_SETTINGS_QUERYResult>['analytics']
>;

type Props = {
  config: AnalyticsConfig | null | undefined;
};

const SCRIPT_ID = 'plausible-script';

type PlausibleFn = ((...args: unknown[]) => void) & { q?: Array<unknown[]> };

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function PlausibleGate({ config }: Props) {
  const { hasConsentFor } = useConsentManager();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (typeof window === 'undefined') return;
    if (!import.meta.env.PROD) return;

    if (!config?.enabled) return;
    if (!config.plausible?.enabled) return;

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';
    if (isLocalhost) return;

    const consent: AllConsentNames = 'functionality';
    if (!hasConsentFor(consent)) return;

    if (document.getElementById(SCRIPT_ID)) return;

    const domain = config.plausible.domain;
    if (!domain) return;

    const base = (
      config.plausible.selfHostedUrl ?? 'https://plausible.io'
    ).replace(/\/$/, '');
    const useProxy = config.plausible.proxyEnabled ?? true;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = useProxy ? '/js/script' : `${base}/js/script.js`;
    script.setAttribute(
      'data-api',
      useProxy ? '/api/event' : `${base}/api/event`
    );
    script.setAttribute('data-domain', domain);
    document.head.appendChild(script);

    // Provide the `plausible()` helper immediately.
    window.plausible =
      window.plausible ??
      ((...args: unknown[]) => {
        const q = (window.plausible!.q ??= []);
        q.push(args);
      });
  }, [config, hasConsentFor]);

  return null;
}
