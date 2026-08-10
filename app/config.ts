// Server-side configuration - only use on the server
export function getServerConfig() {
  const siteUrl = process.env.SITE_URL ?? process.env.PRODUCTION_URL ?? '';
  const normalizedSiteUrl = siteUrl ? siteUrl.replace(/\/$/, '') : '';
  const host = normalizedSiteUrl ? new URL(normalizedSiteUrl).hostname : '';

  return {
    siteUrl: normalizedSiteUrl,
    siteHost: host,
    productionUrl: normalizedSiteUrl,
  };
}

// Client-side configuration type
export type Config = {
  siteUrl: string;
  siteHost: string;
  productionUrl: string;
};

// Default client config (used as fallback)
export const defaultConfig: Config = {
  siteUrl: '',
  siteHost: '',
  productionUrl: '',
};
