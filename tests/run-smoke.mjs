import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  NODE_ENV: 'test',
  SANITY_SESSION_SECRET: 'ci-smoke-session-secret',
  WRANGLER_WRITE_LOGS: 'false',
  VITE_SANITY_API_VERSION: '2024-02-13',
  VITE_SANITY_DATASET: 'production',
  VITE_SANITY_PROJECT_ID: 'ci-smoke-project',
  VITE_SANITY_STUDIO_PREVIEW_ORIGIN: 'https://ci.example.test',
  VITE_SANITY_STUDIO_URL: 'https://ci.example.test/studio',
};

const build = spawnSync('pnpm', ['run', 'build'], {
  env,
  stdio: 'inherit',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const tests = spawnSync(
  process.execPath,
  [
    '--experimental-strip-types',
    '--test',
    'tests/quote-visibility.test.mjs',
    'tests/worker.smoke.test.mjs',
  ],
  {
    env,
    stdio: 'inherit',
  }
);

process.exit(tests.status ?? 1);
