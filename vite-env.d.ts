/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
  readonly VITE_SANITY_API_VERSION: string;
  readonly VITE_SANITY_STUDIO_URL: string;
  readonly VITE_SANITY_STUDIO_PREVIEW_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window interface to include ENV for server-side rendering
declare global {
  interface Window {
    ENV: {
      VITE_SANITY_PROJECT_ID: string;
      VITE_SANITY_DATASET: string;
      VITE_SANITY_API_VERSION: string;
      VITE_SANITY_STUDIO_URL: string;
      VITE_SANITY_STUDIO_PREVIEW_ORIGIN: string;
    };
  }
}
