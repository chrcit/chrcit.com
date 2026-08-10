import type { Route } from './+types/layout';
import type {
  HEADER_QUERYResult,
  FOOTER_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  THEME_SETTINGS_QUERYResult,
} from '@gen/sanity';
import type { CSSProperties } from 'react';
import { data as routeData, Outlet } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import {
  HEADER_QUERY,
  FOOTER_QUERY,
  SITE_SETTINGS_QUERY,
  THEME_SETTINGS_QUERY,
} from '@/sanity/queries';
import { Header, Footer } from '@/components/features/layout';
import { Container } from '@/components/ui';
import { Hydrated, SanityVisualEditing } from '@/components/features/sanity';
import { AnalyticsProvider } from '@/components/features/analytics';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';

type ThemeCssVars =
  | '--color-background-light'
  | '--color-foreground-light'
  | '--color-brand-light';

export async function loader({ request }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);

  const [headerData, footerData, siteSettingsData, themeSettingsData] =
    await Promise.all([
      loadQuery<HEADER_QUERYResult | null>(HEADER_QUERY, {}, options),
      loadQuery<FOOTER_QUERYResult | null>(FOOTER_QUERY, {}, options),
      loadQuery<SITE_SETTINGS_QUERYResult | null>(
        SITE_SETTINGS_QUERY,
        {},
        options
      ),
      loadQuery<THEME_SETTINGS_QUERYResult>(THEME_SETTINGS_QUERY, {}, options),
    ]);

  return routeData(
    {
      preview,
      header: headerData,
      footer: footerData,
      siteSettings: siteSettingsData,
      themeSettings: themeSettingsData,
    },
    { headers: getDocumentCacheHeaders(preview) }
  );
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  const { data: header, encodeDataAttribute: encodeHeaderDataAttribute } =
    useQuery<HEADER_QUERYResult | null>(
      HEADER_QUERY,
      {},
      {
        initial: loaderData.header,
      }
    );

  const { data: footer, encodeDataAttribute: encodeFooterDataAttribute } =
    useQuery<FOOTER_QUERYResult | null>(
      FOOTER_QUERY,
      {},
      {
        initial: loaderData.footer,
      }
    );

  const {
    data: _siteSettings,
    encodeDataAttribute: encodeSiteSettingsDataAttribute,
  } = useQuery<SITE_SETTINGS_QUERYResult | null>(
    SITE_SETTINGS_QUERY,
    {},
    {
      initial: loaderData.siteSettings,
    }
  );

  const {
    data: themeSettings,
    encodeDataAttribute: encodeThemeSettingsDataAttribute,
  } = useQuery<THEME_SETTINGS_QUERYResult>(
    THEME_SETTINGS_QUERY,
    {},
    {
      initial: loaderData.themeSettings,
    }
  );

  const headerSanity = encodeHeaderDataAttribute(['nav']);
  const footerSanity = encodeFooterDataAttribute(['mainNav']);
  const siteSettingsSanity = encodeSiteSettingsDataAttribute(['analytics']);
  const themeSettingsSanity = encodeThemeSettingsDataAttribute(['brandColor']);

  const themeStyle: CSSProperties & Partial<Record<ThemeCssVars, string>> = {};
  if (themeSettings?.backgroundColor) {
    themeStyle['--color-background-light'] = themeSettings.backgroundColor;
  }
  if (themeSettings?.textColor) {
    themeStyle['--color-foreground-light'] = themeSettings.textColor;
  }
  if (themeSettings?.brandColor) {
    themeStyle['--color-brand-light'] = themeSettings.brandColor;
  }

  return (
    <AnalyticsProvider config={_siteSettings?.analytics}>
      <div
        className="bg-background text-foreground flex min-h-[100dvh] flex-col antialiased"
        style={themeStyle}
      >
        <Header header={header} dataSanity={headerSanity} />
        <main className="flex-1" data-sanity={siteSettingsSanity}>
          <div hidden data-sanity={themeSettingsSanity} />
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer footer={footer} dataSanity={footerSanity} />
        {loaderData.preview && (
          <Hydrated>
            <SanityVisualEditing />
          </Hydrated>
        )}
      </div>
    </AnalyticsProvider>
  );
}
