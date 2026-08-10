const defaultApiVersion = '2024-02-13';
type RuntimeEnv = Record<string, string | undefined>;
type WindowWithEnv = Window & { ENV?: RuntimeEnv };

function getEnvVar(key: string): string | undefined {
  // Vite replaces process.env with {} in client bundles. Only return when the
  // requested key is present so browser env fallbacks still get a chance.
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value) return value;
  }

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = (import.meta.env as Record<string, string | undefined>)[key];
    if (value) return value;
  }

  if (typeof window !== 'undefined') {
    const windowEnv = (window as WindowWithEnv).ENV;
    const value = windowEnv?.[key];
    if (value) return value;
  }

  return undefined;
}

// Get environment variables
const projectId = getEnvVar('VITE_SANITY_PROJECT_ID');
const dataset = getEnvVar('VITE_SANITY_DATASET');
const apiVersion = getEnvVar('VITE_SANITY_API_VERSION') ?? defaultApiVersion;
const studioUrl =
  getEnvVar('VITE_SANITY_STUDIO_URL') ??
  // Sensible dev default for `sanity dev` (default port + basePath in `sanity.config.ts`)
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
    ? 'http://localhost:5173/studio'
    : undefined);

// Validate required environment variables
if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID in .env, run npx sanity@latest init --env'
  );
}
if (!dataset) {
  throw new Error(
    'Missing VITE_SANITY_DATASET in .env, run npx sanity@latest init --env'
  );
}

export { apiVersion, dataset, projectId, studioUrl };
