import { buildLegacyTheme } from 'sanity';

/**
 * Studio branding is intentionally centralized here.
 * Tweak these values to match client branding.
 */
const brand = {
  name: 'Sanity Starter',
  primary: '#11110f',
  black: '#11110f',
  white: '#f2eee6',
};

export function StudioLogo() {
  return (
    <div
      style={{
        fontFamily: 'ABC Whyte Inktrap, sans-serif',
        fontWeight: 400,
        letterSpacing: '-0.02em',
      }}
    >
      {brand.name}
    </div>
  );
}

export const studioTheme = buildLegacyTheme({
  '--black': brand.black,
  '--white': brand.white,
  '--gray': '#6b6860',
  '--gray-base': '#6b6860',
  '--component-bg': brand.white,
  '--component-text-color': brand.black,
  '--brand-primary': brand.primary,
  '--default-button-color': brand.black,
  '--default-button-primary-color': brand.primary,
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#ca8a04',
  '--default-button-danger-color': '#dc2626',
  '--state-info-color': brand.primary,
  '--state-success-color': '#16a34a',
  '--state-warning-color': '#ca8a04',
  '--state-danger-color': '#dc2626',
  '--main-navigation-color': brand.black,
  '--main-navigation-color--inverted': brand.white,
  '--focus-color': brand.primary,
});
